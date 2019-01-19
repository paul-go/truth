import * as X from "../CoreTests/X";
import * as Viz from "./Viz";
import * as Fs from "fs";


/**
 * Entry point used for debugging.
 */
setTimeout(() =>
{
	Viz.init();
	
	const findArg = (key: string) =>
	{
		const val = process.argv.find(arg => arg.startsWith(key)) || "";
		return val.slice(key.length);
	};
	
	const filePath = findArg("--file=");
	const typePath = findArg("--typePath=").split("/");
	const fileContent = Fs.readFileSync(filePath, "utf8");
	const program = new X.Program(false);
	const doc = program.documents.create(fileContent);
	const type = program.query(doc, ...typePath);
	
	const uriMessage = `Using URI: ${filePath}//${typePath}`;
	const pipe = "-".repeat(uriMessage.length);
	console.log(pipe);
	console.log(uriMessage);
	console.log(pipe);
	
	const printedFaults = new Set<X.Fault>();
	const printFault = (fault: X.Fault) =>
	{
		if (printedFaults.has(fault))
			return;
		 
		printedFaults.add(fault);
		console.log(fault.toString());
	}
	
	if (program.faults.count > 0)
	{
		for (const fault of program.faults.each())
			printFault(fault);
	}
	else
	{
		console.log(`No faults were detected:`);
	}
	
	if (type === null)
	{
		console.log(`No type exists at the input URI.`);
		return;
	}
},
1);