import * as X from "../../X";


/** */
export type Subject = DeclarationSubject | AnnotationSubject;

/**
 * Stores a map of the character offsets within a Statement
 * that represent the starting positions of the statement's
 * declarartions.
 */
export type DeclarationSubject = X.Identifier | X.Pattern | X.Uri | X.Anon;

/**
 * Stores a map of the character offsets within a Statement
 * that represent the starting positions of the statement's
 * annotations.
 */
export type AnnotationSubject = X.Identifier;


/** */
export class SubjectSerializer
{
	/**
	 * Universal method for serializing a subject to a string,
	 * useful for debugging and supporting tests.
	 */
	static invoke(subject: Subject, escapeStyle: X.IdentifierEscapeKind)
	{
		if (subject instanceof X.Identifier)
			return subject.toString(escapeStyle);
		
		else if (subject instanceof X.Pattern)
			return subject.toString();
		
		else if (subject instanceof X.Uri)
			return subject.toString(true, true);
		
		else if (subject instanceof X.Anon)
			return subject.toString();
		
		throw X.Exception.unknownState();
	}
}


/**
 * @deprecated
 * This code is only called by the Fragmenter, which is deprecated.
 */
export class SubjectParser
{
	/**
	 * @deprecated
	 * This code is only called by the Fragmenter, which is deprecated.
	 */
	static invoke(text: string): Subject
	{
		if (text.trim().length === 0)
			throw X.Exception.invalidArgument();
		
		return new X.Identifier(text);
	}
	
	private constructor() { }
}
