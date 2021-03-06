
namespace Truth
{
	/**
	 * A chain of subjects that form a path to a particular location within a Document.
	 * 
	 * The lifetime of a Phrase is pinned (directly or indirectly) to the lifetime of a Document.
	 * A Document object as a reference to a surface-level Phrase, and Phrase objects are then
	 * store references to their nested Phrase children.
	 * 
	 * Phrases can be either "hypothetical" or "non-hypothetical". A non-hypothetical phrase
	 * is one that is supported by a Span object that represents a region of text that was typed
	 * directly into the document. A hypothetical phrase is one that refers to some path in
	 * the document that wasn't entered by the user, and therefore only exists hypothetically.
	 * Determining whether an actual Type is present at the hypothetical location requires
	 * invoking the type checker.
	 * 
	 * Because non-hypothetical phrases are supported by one or more physical spans, Phrases
	 * therefore have a concept of being "inflated" and "deflated" by backing spans. This is
	 * a kind of reference counting mechanism. Phrases are instantiated at the time when the
	 * first supporting span makes an appearance, and are disposed at the time when the last
	 * one is removed.
	 */
	export class Phrase
	{
		/**
		 * @internal
		 * Creates a new root 0-length phrase, which should only ever
		 * be attached to a document object. Root phrases act as the
		 * gateway from a document into it's nested phrase structure.
		 */
		static new(containingDocument: Document)
		{
			return new Phrase(containingDocument);
		}
		
		/**
		 * @internal
		 * @deprecated
		 * Finds a possible Phrase object, which is identified by an phrase path
		 * string.
		 * 
		 * @returns The existing Phrase found at the phrase path specified, or
		 * null in the case when the path specified refers to a non-existent
		 * phrase, to the path refers to a Phrase that has cruft somewhere in
		 * it's ancestry.
		 */
		static fromPath(
			containingDocument: Document,
			encodedPhrasePath: string): Phrase | null
		{
			/*
			TODO
			This method is going to require the use of a custom phrase path string parser.
			This is so that Types may be referred to through a kind of custom URI structure.
			This could be a simple path/to/the/type, but the first term of the path will
			require the ability to parse a clarifier, to allow for disambiguating between a
			possible homograph.
			*/
			throw Exception.notImplemented();
		}
		
		/**
		 * Returns an array of Phrase objects that refer to the (potentially hypothetical) areas
		 * in the specified document. The returned array will contain multiple Phrase objects
		 * in the case when the first term in the path is a member of a homograph. In order to
		 * restrict the returned array to a single item, a non-empty array should be provided
		 * in the clarifier argument in order to disambiguate.
		 * 
		 * Returns an empty array in the case when the case when the provided path of subjects
		 * argument is a zero-length array, the first term in the path refers to a non-existent area
		 * of the target document, or when a homograph was detected at some point beyond the
		 * first level.
		 * 
		 * Returns a number in the case when a homograph was detected at some point beyond
		 * the first level. The number indicates the index of the path at which the homograph
		 * was detected (this should be considered an error).
		 */
		static fromPathComponents(document: Document, path: string[]): readonly Phrase[]
		/**
		 * Returns the Phrase object that refers to the (potentially hypothetical) area in the
		 * specified document.
		 * 
		 * Returns null in the case when a homograph was detected at some point beyond
		 * the first level. 
		 */
		static fromPathComponents(
			document: Document,
			path: string[],
			clarifier: string[]): Phrase | null
		/** */
		static fromPathComponents(
			document: Document,
			path: string[],
			clarifier: string[] = [])
		{
			if (path.length === 0)
				return [] as readonly Phrase[];
			
			// In order to make this method work with patterns, 
			// pathSubjects needs to be an array of subjects, or there
			// needs to be some easy way to turn these into subjects.
			
			const clarifierKey = this.getClarifierKey(clarifier);
			const pathTerms = path.map(v => Term.from(v));
			const firstTerm = pathTerms.shift()!;
			
			const rootPhrases = clarifierKey ?
				document.phrase.peek(firstTerm, clarifierKey) :
				document.phrase.peek(firstTerm);
			
			if (!rootPhrases || rootPhrases.length === 0)
				return [];
			
			const outPhrases: Phrase[] = [];
			
			for (const rootPhrase of rootPhrases)
			{
				let currentPhrase = rootPhrase;
				
				for (const pathTerm of pathTerms)
				{
					const phrases = currentPhrase.peek(pathTerm);
					
					// Invalid homograph detected
					if (phrases.length > 1)
						return clarifier.length === 0 ? null : [];
					
					currentPhrase = phrases.length === 0 ?
						this.createHypothetical(currentPhrase, pathTerm) :
						phrases[0];
				}
				
				if (clarifierKey)
					return currentPhrase;
				
				outPhrases.push(currentPhrase);
			}
			
			return outPhrases;
		}
		
		/**
		 * Creates a hypothetical phrase that forwards from the phrase
		 * specified, to the subject specified.
		 */
		static createHypothetical(phrase: Phrase, subject: Subject)
		{
			return new Phrase(phrase, subject);
		}
		
		/**
		 * @internal
		 * Iterates through the first-level phrases of the specified document,
		 * skipping over the phrases that don't have an associated node.
		 */
		static *rootsOf(document: Document): IterableIterator<Phrase>
		{
			if (document.phrase._forwardings)
				for (const [subject, clarifier, phrase] of document.phrase._forwardings)
					yield phrase;
		}
		
		/**
		 * @internal
		 * Deflates the phrases that correspond to statements specified in
		 * the array, and their descendents.
		 */
		static deflateRecursive(statements: readonly Statement[])
		{
			for (const span of this.enumerateSpans(statements))
				for (const phrase of Phrase.fromSpan(span))
					phrase.deflate(span);
		}
		
		/**
		 * @internal
		 * Inflates the phrases that correspond to statements specified in
		 * the array, and their descendent statements.
		 */
		static inflateRecursive(statements: readonly Statement[])
		{
			for (const span of this.enumerateSpans(statements))
				for (const phrase of Phrase.fromSpan(span, true))
					phrase.inflate(span);
		}
		
		/**
		 * Performs a deep enumeration of the statements provided in
		 * the array, as well as their descendent statements.
		 */
		private static *enumerateSpans(statements: readonly Statement[])
		{
			if (statements.length === 0)
				return;
			
			const doc = statements[0].document;
			const visted = new Set<Statement>();
			
			for (const paramStatement of statements)
			{
				for (const { statement } of doc.eachDescendant(paramStatement, true))
				{
					if (visted.has(statement))
						continue;
					
					for (const span of statement.declarations)
						yield span;
					
					visted.add(statement);
				}
			}
		}
		
		/**
		 * @internal
		 * Returns all Phrase objects that are terminated by the specified Span.
		 * Phrases created thought this method are considered non-hypothetical.
		 * 
		 * @param span The span from which to begin creating phrases.
		 * @param createIfMissing If true, new phrases are created and added to
		 * the internal forwarding table in the case when they're missing, before
		 * being returned. Defaults to false.
		 */
		static fromSpan(span: Span, createIfMissing = false)
		{
			const phrases: Phrase[] = [];
			const root = span.statement.document.phrase;
			
			outer: for (const spine of span.spines)
			{
				let current = root;
				
				for (const spineSpan of spine)
				{
					if (spineSpan.isCruftMarker)
						continue;
					
					const clarifiers = spineSpan.statement.annotations
						.map(span => span.boundary.subject as Term);
					
					const clarifierKey = this.getClarifierKey(clarifiers);
					const subject = spineSpan.boundary.subject;
					const forwardPhrases = current.getForwarding(subject, clarifierKey);
					
					if (forwardPhrases.length > 0)
						current = forwardPhrases[0];
					
					else if (createIfMissing)
						current = new Phrase(current, spineSpan, clarifiers, clarifierKey);
					
					else continue outer;
				}
				
				if (current !== root)
					phrases.push(current);
			}
			
			return phrases;
		}
		
		/**
		 * Returns a clarification key from the specified set of strings or Terms,
		 * which are annotations in some statement. The clarification key is
		 * a single string of comma-separated terms. For example:
		 * ```
		 * A : B, C
		 * ```
		 * Given the above statement, the clarification key for A would be "B,C".
		 */
		private static getClarifierKey(clarifiers: (string | Term)[])
		{
			return clarifiers.length === 0 ?
				"" :
				clarifiers
					.map(v => v instanceof Term ? v.id : Term.from(v).id)
					.sort((a, b) => a - b)
					.join();
		}
		
		/**
		 * Create a zero-length Phrase, intended to be owned directly by a document.
		 */
		private constructor(containingDocument: Document)
		/**
		 * Create an L > 0 length Phrase that represents a path to an explicit area of the
		 * document (meaning, an area that isn't explicitly backed by a span).
		 */
		private constructor(parent: Phrase, inflator: Span, clarifiers: Term[], clarifierKey: string)
		/**
		 * Create an L > 0 length Phrase that represents a path to a hypothetical area of the
		 * document (meaning, an area that is suggested to be valid through inheritance).
		 */
		private constructor(parent: Phrase, terminal: Subject)
		private constructor(a: Document | Phrase, b?: Span | Subject, c?: Term[], d?: string)
		{
			this.terminal = Term.anonymous;
			this.clarifiers = [];
			this.clarifierKey = "";
			
			// First overload
			if (a instanceof Document)
			{
				this.containingDocument = a;
				this.parent = this;
				this.length = 0;
			}
			else
			{
				this.containingDocument = a.containingDocument;
				this.parent = a;
				this.length = a.length + 1;
				
				// Second overload
				if (b instanceof Span)
				{
					this.terminal = b.boundary.subject;
					this.clarifiers = c || [];
					this.clarifierKey = d || "";
					
					this.parent.setForwarding(this.terminal, this.clarifierKey, this);
				}
				// Third overload
				else if (b)
				{
					// Hypothetical phrases are not added to the forwarding table, 
					// because these are managed by PhraseProvider.
					this.isHypothetical = true;
					this.terminal = b;
				}
			}
			
			this.outboundsVersion = Version.of(this.containingDocument.program.version);
		}
		
		/** @internal */
		readonly id = id();
		
		/**
		 * Stores the list of terms that exist on the right-side of the
		 * statement (or statements) that caused this Phrase to come
		 * into being.
		 */
		readonly clarifiers: readonly Term[];
		
		/**
		 * Stores a string that can be used as a hash that corresponds
		 * to a unique set of clarifier terms.
		 */
		readonly clarifierKey: string;
		
		/**
		 * Stores a reference to the Phrase object that contains exactly one
		 * less term than this one (from the end). In the case when the Phrase
		 * is surface-level, this field stores a self-reference.
		 */
		readonly parent: Phrase;
		
		/**
		 * Gets whether this phrase is a zero-length, document-owned phrase.
		 */
		get isDocumentOwned()
		{
			return this.parent === this;
		}
		
		/**
		 * Stores a reference to the Document that ultimately
		 * contains this Phrase.
		 */
		readonly containingDocument: Document;
		
		/**
		 * @internal
		 * Stores whether this Phrase represents a path to an hypothetical area of the
		 * document (meaning, an area that is suggested to be valid through
		 * inheritance).
		 */
		readonly isHypothetical: boolean = false;
		
		/**
		 * Gets a read-only array of Statement objects from which this Phrase
		 * is composed. This array will have a length > 1 in the case when the
		 * Phrase is composed from a fragmented Type. In other cases, the
		 * length of the array will be 1.
		 */
		get statements()
		{
			if (this._statements !== null)
				return this._statements;
			
			if (this.isHypothetical)
				return this._statements = [];
			
			const statements = new Set<Statement>();
			
			for (const span of this.inflatingSpans)
				statements.add(span.statement);
			
			return this._statements = Array.from(statements);
		}
		private _statements: readonly Statement[] | null = null;
		
		/**
		 * Gets a read-only array of declaration-side Span objects from which
		 * this Phrase is composed.
		 */
		get declarations(): readonly Span[]
		{
			return Array.from(this.inflatingSpans);
		}
		
		/**
		 * Gets a read-only array of annotation-side Span objects that exist
		 * on the right side of the statement that contains the declaration
		 * that influenced the creation of this phrase.
		 */
		get annotations(): readonly Span[]
		{
			const result = new Set<Span>();
			
			for (const inflatingSpan of this.inflatingSpans)
				for (const span of inflatingSpan.statement.annotations)
					result.add(span);
			
			return Array.from(result);
		}
		
		/**
		 * Stores the subject that exists at the end of this phrase.
		 */
		readonly terminal: Subject;
		
		/**
		 * Stores the number of subjects in this Phrase. This value
		 * is equivalent to the length of this Phrase's ancestry. 
		 */
		readonly length: number;
		
		/**
		 * Inflates this phrase with the span provided.
		 */
		private inflate(inflatingSpan: Span)
		{
			if (this.isHypothetical)
				throw Exception.unknownState();
			
			const doc = this.containingDocument;
			const key = getDisposalKey(doc, this.terminal);
			const isCreating = this.inflatingSpans.size === 0;
			this.inflatingSpans.add(inflatingSpan);
			
			// We need to check to see if this inflation is simply reinflating
			// an already-existing phrase. See the comments in the .dispose()
			// method for further information.
			if (isCreating && !disposalQueue.has(key) && this.length === 1)
				doc.program.emit("declare", this.terminal, doc);
		}
		
		/**
		 * Deflates this phrase with the span provided,
		 * and triggers the disposal operation if necessary.
		 */
		private deflate(inflatingSpan: Span)
		{
			if (this.isHypothetical)
				throw Exception.unknownState();
			
			this.inflatingSpans.delete(inflatingSpan);
			if (this.inflatingSpans.size === 0)
				this.dispose();
		}
		private readonly inflatingSpans = new Set<Span>();
		
		/**
		 * @internal
		 * Gets a number that indicates the number of Spans that are contributing
		 * the necessary existence of the Phrase.
		 */
		get inflationSize()
		{
			return this.inflatingSpans.size;
		}
		
		/**
		 * Returns a reference to the phrases that are extended by the subject specified,
		 * in the case when such a phrase has been added to the internal forwarding
		 * table.
		 * 
		 * An array must be returned from this method rather than a singular Phrase
		 * object, because the phrase structure may have a nested homograph. Although
		 * these are invalid, the phrase structure must still be capable of representing
		 * these.
		 */
		peek(subject: Subject, clarifierKey?: string): readonly Phrase[]
		{
			if (clarifierKey === undefined)
				return this.getForwarding(subject);
			
			return this.getForwarding(subject, clarifierKey) || [];
		}
		
		/**
		 * Yields the non-hypothetical phrases that extend from this one,
		 * yielding phrase arrays that correspond to the series of homographic
		 * phrases that extend from a subject.
		 */
		*peekMany()
		{
			for (const subject of this.eachForwardingSubject())
				yield this.peek(subject);
		}
		
		/**
		 * Yields subjects that correspond to the non-hypothetical phrases that
		 * extend from this phrase.
		 */
		*peekSubjects()
		{
			if (this._forwardings)
				for (const [subject, clarifieKey, phrase] of this._forwardings)
					if (!phrase.isHypothetical)
						yield subject;
		}
		
		/**
		 * Performs a recursive traversal through the non-hypothetical phrases that
		 * extend from this one, yielding phrase arrays that correspond to the series
		 * of homographic phrases that extend from a subject.
		 */
		*peekRecursive()
		{
			function *recurse(phrase: Phrase): IterableIterator<readonly Phrase[]>
			{
				for (const subject of phrase.eachForwardingSubject())
				{
					const subPhrases = phrase.getForwarding(subject);
					if (subPhrases.length > 0)
						yield subPhrases;
					
					for (const subPhrase of subPhrases)
						yield *recurse(subPhrase);
				}
			}
			
			yield *recurse(this);
		}
		
		/**
		 * Gets an array of Phrase objects that form a path leading to this Phrase.
		 * For example, if the subjects of this Phrase were to serialize to something
		 * like AA / BB / CC, then this property would store an array of 3 Phrases,
		 * which would serialize to:
		 * ```
		 * AA
		 * AA / BB
		 * AA / BB / CC
		 * ```
		 * Note that if only the length of the phrase is required, the .length
		 * field should be used instead.
		 */
		get ancestry(): Phrase[]
		{
			if (this._ancestry === null)
			{
				this._ancestry = [];
				let current: Phrase = this;
				
				// The ancestry never includes the 0-length phrase
				// attached to a document, and always includes itself.
				while (current.length > 0)
				{
					this._ancestry.unshift(current);
					current = current.parent;
				}
			}
			
			return this._ancestry;
		}
		private _ancestry: (Phrase[] | null) = null;
		
		/**
		 * @internal
		 * Gets a text representation of this Phrase's subject,
		 * for debugging purposes only.
		 */
		get name()
		{
			return Subject.serializeInternal(this.terminal);
		}
		
		/**
		 * In the case when this PhraseContext is a direct descendent of
		 * a another PhraseContext that represents a pattern, and that
		 * pattern has population infixes, and this PhraseContext directly
		 * corresponds to one of those infixes, this property gets a
		 * reference to said corresponding infix.
		 */
		get parentInfix()
		{
			if (this.isDocumentOwned)
				return null;
			
			const flag = InfixFlags.population;
			
			if (this.parent.terminal instanceof Pattern)
				for (const nfx of this.parent.terminal.getInfixes(flag))
					if (nfx.lhs.length > 0)
						return nfx;
			
			return null;
		}
		
		/** */
		get isListIntrinsic()
		{
			return this.terminal instanceof Term && this.terminal.isList;
		}
		
		/**
		 * Gets whether this Phrase has been explicitly defined as a list extrinsic.
		 * It is worth noting that this property in and of itself is not sufficient to
		 * determine whether any corresponding Type is actually a list (full type
		 * checking is required to draw this conclusion).
		 */
		get isListExtrinsic()
		{
			return this.clarifiers.some(term => term.isList);
		}
		
		/**
		 * Gets a reference to the "opposite side of the list".
		 * 
		 * If this Phrase represents a list intrinsic Type, this property gets
		 * a reference to the Phrase that represents the corresponding
		 * extrinsic side.
		 * 
		 * If this Phrase represents anything that *isn't* a list intrinsic Type,
		 * the property gets a reference to the Phrase that represents the
		 * corresponding intrinsic side (whether the node is a list or not).
		 * 
		 * Gets null in the case when there is no corresponding list intrinsic
		 * or extrinsic Phrase to connect.
		 */
		get intrinsicExtrinsicBridge(): Phrase | null
		{
			if (this.terminal instanceof Term)
				for (const adjacent of this.adjacents)
					if (adjacent.terminal instanceof Term)
						if (adjacent.terminal === this.terminal)
							if (adjacent.terminal.isList !== this.isListIntrinsic)
								return adjacent;
			
			return null;
		}
		
		/**
		 * Gets an array of phrases that exist "beside" this phrase, 
		 * at the same level of depth.
		 */
		private get adjacents(): readonly Phrase[]
		{
			if (this.isDocumentOwned)
				return [];
			
			// Note: It's important that this property does not return a cached
			// value, because there is no notification when adjacent phrases
			// are added and removed from the forwarding table, and so there
			// would be no way to know when to clear a cached value.
			
			const out: Phrase[] = [];
			
			for (const phrase of this.parent.eachForwardingPhrase())
				if (phrase !== this)
					out.push(phrase);
			
			return out;
		}
		
		/**
		 * Gets an array of Forks that connect this Phrase to others, through
		 * the annotations 
		 */
		get outbounds()
		{
			// Do a cache clear if necessary
			if (this.outboundsVersion)
			{
				const currentVersion = this.containingDocument.program.version;
				if (currentVersion.after(this.outboundsVersion))
				{
					this._outbounds = null;
					this.outboundsVersion.equalize(currentVersion);
				}
			}
			
			if (this._outbounds !== null)
				return this._outbounds;
			
			if (this.isHypothetical)
				throw Exception.invalidOperationOnHypotheticalPhrase();
			
			if (this.isDocumentOwned)
				return this._outbounds = [];
			
			const forks: Fork[] = [];
			
			// The ancestry property returns an ancestry of phrases that
			// includes the current phrase, which we don't want to include
			// in the upward peeking process that follows.
			const peekAncestry = this.ancestry.slice(0, -1);
			
			// The global ancestry should include the root phrase, because
			// it's direct children should be included in the peeking process.
			// The root may be found in different locations depending on
			// whether this phrase is a document-owned (zero-length) phrase.
			peekAncestry.length === 0 ?
				peekAncestry.unshift(this.parent) :
				peekAncestry.unshift(peekAncestry[0].parent);
			
			for (const doc of this.containingDocument.traverseDependencies())
				peekAncestry.unshift(doc.phrase);
			
			// In the case when there are no clarifiers defined, and the phrase
			// isn't surface level, the terminal essentially acts as the annotation.
			// This is to support inference via containment.
			const scanTerms = 
				this.length > 1 &&
				this.clarifiers.length === 0 && 
				this.terminal instanceof Term ?
					[this.terminal] :
					this.clarifiers;
			
			for (const term of scanTerms)
			{
				const successors: Phrase[] = [];
				
				for (const ancestorPhrase of peekAncestry)
				{
					const phrases = ancestorPhrase
						// Always connect the outbound to the singular form of a term.
						.peek(term.singular)
						// In no cases should an outbound be established between this
						// phrase and itself. Statements such as "A : A" refer to the "A"
						// in a higher-level scope.
						.filter(ph => ph !== this);
					
					if (phrases.length)
						successors.unshift(...phrases);
				}
				
				forks.push(new Fork(this, successors, term));
			}
			
			return this._outbounds = forks;
		}
		private _outbounds: Fork[] | null = null;
		
		/**
		 * Stores the version of the containing program when the outbounds
		 * array was computed, used as a cache clearing indicator.
		 */
		private outboundsVersion: Version | null = null;
		
		/**
		 * Returns a substring of the annotations set on this phrase, starting with
		 * the annotation the corresponds to the fork specified, and then counting
		 * forward until the specified number of forks has been consumed.
		 * 
		 * The string returned will be exactly as it's found in the underlying document.
		 * Returns an empty string in the case when this Phrase is supported by
		 * multiple statements.
		 */
		slice(fork: Fork, count: number)
		{
			if (this.statements.length !== 1 || count < 1)
				return "";
			
			// Because phrase slicing only works in the case when there is one statement
			// supporting the phrase, this means that the number of annotations in the
			// statement is equal to the number of annotations in the .annotations field,
			// which is also then equal to the number of clarifiers in the .clarifiers field,
			// which is then also equal to the number of forks in the .outbounds field.
			
			const startForkIdx = this.outbounds.indexOf(fork);
			if (startForkIdx < 0)
				return "";
			
			const endForkIdx = Math.max(
				startForkIdx + (count - 1),
				this.annotations.length - 1);
			
			const startOffset = this.annotations[startForkIdx].boundary.offsetStart;
			const endOffset = this.annotations[endForkIdx].boundary.offsetEnd;
			return this.statements[0].sourceText.slice(startOffset, endOffset + 1);
		}
		
		/**
		 * @internal
		 * Performs a non-recursive disposal of the stored information in this phrase.
		 */
		dispose()
		{
			if (this.parent === this)
				throw Exception.unknownState();
			
			this.parent.deleteForwarding(this.terminal, this.clarifierKey);
			this._outbounds = null;
			this._ancestry = null;
			this._statements = null;
			this._isDisposed = true;
			
			// Only non hypothetical phrases generate the declare events,
			// and it's unlikely that these may ever trigger a dispose, but
			// we have a sanity check here anyways.
			if (this.length === 1 && !this.isHypothetical)
			{
				// The "undeclare" event is only emitted in the case when the phrase
				// is disposed for good, and is not simply going to be recreated again
				// in the current turn of the event loop. Therefore, we need to check
				// to see if the phrase is still gone in the following turn before emitting
				// the event. During a typical edit transaction, the invalidated parts of
				// the phrase structure are removed before the new phrases are added,
				// so the deferral to setTimeout is done primarily as a safety precaution.
				const doc = this.containingDocument;
				const terminal = this.terminal;
				const clarifier = this.clarifierKey;
				const key = getDisposalKey(doc, terminal);
				disposalQueue.add(key);
				
				setTimeout(() =>
				{
					disposalQueue.delete(key);
					
					const existing = doc.phrase.peek(terminal, clarifier);
					if (existing.length === 0)
						doc.program.emit("undeclare", terminal, doc);
				});
			}
		}
		
		/**
		 * Gets whether the phrase has been removed from it's parent's
		 * forwarding table.
		 */
		get isDisposed()
		{
			return this._isDisposed;
		}
		private _isDisposed = false;
		
		/** */
		private getForwarding(subject: Subject, clarifierKey?: string): readonly Phrase[]
		{
			if (this._forwardings === null)
				return [];
			
			if (clarifierKey)
			{
				const result = this._forwardings.get(subject, clarifierKey);
				return result ? [result] : [];
			}
			
			return this._forwardings.get(subject);
		}
		
		/** */
		private setForwarding(subject: Subject, clarifierKey: string, phrase: Phrase)
		{
			if (this._forwardings === null)
				this._forwardings = new Map3D();
			
			this._forwardings.set(subject, clarifierKey, phrase);
		}
		
		/** */
		private deleteForwarding(subject: Subject, clarifierKey: string)
		{
			return this._forwardings ?
				this._forwardings.delete(subject, clarifierKey) :
				false;
		}
		
		/** */
		private *eachForwardingPhrase()
		{
			if (this._forwardings)
				for (const [subject, key, phrase] of this._forwardings)
					yield phrase;
		}
		
		/** */
		private *eachForwardingSubject()
		{
			if (this._forwardings)
				for (const subject of this._forwardings.keys())
					yield subject;
		}
		
		/**
		 * Stores a table of nested phrases, keyed in 2 dimensions, firstly by the
		 * Phrases terminating subject, and secondly by the Phrase's clarifierKey,
		 * (a hash of the phrase's associated annotations).
		 */
		private _forwardings: Map3D<Subject, string, Phrase> | null = null;
		
		/**
		 * Returns a string representation of this Phrase, suitable for debugging purposes.
		 */
		toString(includeClarifiers = false)
		{
			const prefix = this.containingDocument.uri.toString() + "//";
			const parts: string[] = [];
			
			for (const phrase of this.ancestry)
			{
				let part = phrase.terminal === Term.anonymous ?
					"•" :
					phrase.terminal.toString();
				
				if (includeClarifiers)
					part += ":" + phrase.clarifierKey;
				
				parts.push(part);
			}
			
			return "DEBUG" ?
				`#${this.id} ` + prefix + parts.join("/") :
				prefix + parts.join("/");
		}
	}
	
	/**
	 * Creates a well-formed string from the specified document and terminal,
	 * suitable for insertion into the disposal queue.
	 */
	function getDisposalKey(document: Document, terminal: Subject)
	{
		return terminal.toString() + Syntax.terminal + document.id;
	}
	
	/**
	 * Stores a set of disposal keys, which are used to indicate the disposal status
	 * of a phrase. The purpose of the disposal queue is to limit the times when the
	 * "declare" and "undeclare" events are emitted. These events should only be
	 * emitted when a surface-level phrase has actually been disposed or created, 
	 * in the sense that it's removal or creation wasn't a temporary operation that
	 * will be reversed by the end of the turn of the event loop.
	 */
	const disposalQueue = new Set<string>();
}
