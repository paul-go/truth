
namespace Truth
{
	/**
	 * 
	 */
	export class Pattern
	{
		/** @internal */
		constructor(
			/**
			 * 
			 */
			readonly units: readonly (RegexUnit | Infix)[],
			/**
			 * Stores whether the pattern is considered to be "Total"
			 * or "Partial". Total patterns must match an entire annotation
			 * set (the entire strip of content to the right of a joint, after
			 * being trimmed). Partial patterns match individually 
			 * specified subjects (separated by commas).
			 */
			readonly isTotal: boolean,
			/**
			 * Stores a hash which is computed from the set of
			 * annotations specified to the right of the pattern.
			 */
			readonly hash: string)
		{
			this.nativeRegExp = PatternPrecompiler.exec(this);
			this.isValid = this.nativeRegExp instanceof RegExp;
		}
		
		/** @internal */
		readonly id = id();
		
		/**
		 * Stores whether the internal regular expression
		 * was compiled successfully.
		 */
		readonly isValid: boolean;
		
		/**
		 * Recursively enumerates through this Pattern's unit structure.
		 */
		*walk()
		{
			function *recurse(units: readonly (RegexUnit | Infix)[]):
				IterableIterator<RegexUnit | Infix>
			{
				for (const unit of units)
				{
					yield unit;
					
					if (unit instanceof RegexGroup)
						for (const unitCase of unit.cases)
							yield *recurse(unitCase);
				}
			}
			
			yield *recurse(this.units);
		}
		
		/**
		 * @internal
		 * Gets whether this pattern can possibly match the
		 * combinator token. Patterns that have this ability
		 * have slightly different handling in the type checker.
		 * 
		 * Note that the method only scans the regular expression
		 * tokens that are defined within this Pattern. If the Pattern
		 * contains Infixes, these are not analyzed.
		 */
		canMatchCombinator()
		{
			if (this._canMatchCombinator !== null)
				return this._canMatchCombinator;
			
			const units = Array.from(this.walk());
			
			for (const unit of units)
			{
				if (unit instanceof RegexGrapheme)
				{
					if (unit.grapheme === Syntax.combinator)
						return this._canMatchCombinator = true;
				}
				else if (unit instanceof RegexSet)
				{
					if (unit.includes(Syntax.combinator))
						return this._canMatchCombinator = true;
				}
			}
			
			return this._canMatchCombinator = false;
		}
		private _canMatchCombinator: boolean | null = null;
		
		/**
		 * @returns A boolean value that indicates whether
		 * this Pattern has at least one infix, of any type.
		 */
		hasInfixes()
		{
			return this.units.some(u => u instanceof Infix);
		}
		
		/**
		 * @returns An array containing the infixes of the
		 * specified type that are defined in this Pattern.
		 * If the argument is omitted, all infixes of any type
		 * defined on this Pattern are returned.
		 */
		getInfixes(type = InfixFlags.none)
		{
			return this.units
				.filter((u): u is Infix => u instanceof Infix)
				.filter(nfx => (nfx.flags & type) === type);
		}
		
		/**
		 * Performs an "expedient" test that determines whether the
		 * specified input has a chance of being matched by this pattern.
		 * The check is considered expedient, rather than thorough,
		 * because any infixes that exist in this pattern are replaced
		 * with "catch all" regular expression sequence, rather than
		 * embedding the pattern associated with the Type specified
		 * in the infix.
		 */
		test(input: string)
		{
			const regExp = this.nativeRegExp;
			if (regExp === null)
				return false;
			
			const inputTrimmed = input.trim();
			if (inputTrimmed === "")
				return false;
			
			return regExp.test(input);
		}
		
		/**
		 * Executes the pattern (like a function) using the specified
		 * string as the input.
		 * 
		 * @returns A ReadonlyMap whose keys align with the infixes
		 * contained in this Pattern, and whose values are strings that
		 * are the extracted "inputs", found in the place of each infix. 
		 * If this Pattern has no infixes, an empty map is returned.
		 */
		exec(patternParameter: string): ReadonlyMap<Infix, string>
		{
			const regExp = this.nativeRegExp;
			if (regExp === null)
				return new Map();
			
			const result = new Map<Infix, string>();
			const infixes = this.getInfixes();
			
			if (this.getInfixes().length === 0)
				return result;
			
			const infixCaptureGroupIndexes = (() =>
			{
				const idxArray: number[] = [];
				let idx = 0;
				
				for (const unit of this.walk())
				{
					if (unit instanceof Infix)
						idxArray.push(++idx);
					
					if (unit instanceof RegexGroup)
						idx++;
				}
				
				///Make sure the above produces the same behavior before deleting
				///const recurseUnits = (units: readonly (RegexUnit | Infix>)[]) =>
				///{
				///	for (const unit of units)
				///	{
				///		if (unit instanceof Infix)
				///		{
				///			idxArray.push(++idx);
				///		}
				///		else if (unit instanceof RegexGroup)
				///		{
				///			++idx;
				///			for (const unitCase of unit.cases)
				///				recurseUnits(unitCase);
				///		}
				///	}
				///}
				///recurseUnits(this.units);
				
				return idxArray;
			})();
			
			const reg = new RegExp(regExp.source, regExp.flags);
			const matches = reg.exec(patternParameter);
			
			if (matches === null)
				return result;
			
			for (const [idx, infix] of infixes.entries())
				result.set(infix, matches[infixCaptureGroupIndexes[idx]]);
			
			return result;
		}
		
		/**
		 * @internal
		 * Feeds the specified input into the internal regular expression,
		 * and returns an array of captured strings, if any where generated.
		 * This method does not work as expected in the case when the 
		 * pattern has infixes.
		 */
		capture(input: string): readonly string[]
		{
			if (this.hasInfixes())
				throw Exception.notImplemented();
			
			return this.nativeRegExp ?
				input.match(this.nativeRegExp) || [] : 
				[];
		}
		
		/**
		 * Stores the JavaScript-native Regular Expression object for
		 * this pattern, or null in the case when this Pattern object was
		 * created with regular expression text with syntactical errors,
		 * and could therefore not be compiled.
		 */
		private readonly nativeRegExp: RegExp | null;
		
		/**
		 * Converts this Pattern to a string representation.
		 * (Note that the serialized pattern cannot be used
		 * as a parameter to a JavaScript RegExp object.)
		 * 
		 * @param includeHashPrefix If true, the Pattern's hash
		 * prefix will be prepended to the serialized result.
		 */
		toString(includeHashPrefix?: boolean)
		{
			const prefix = includeHashPrefix ? escape(this.hash) : "";
			
			const delim = RegexSyntaxDelimiter.main.toString();
			return delim + prefix +
				this.units.map(u => u.toString()).join("") + 
				(this.isTotal ? delim : "");
		}
	}
}
