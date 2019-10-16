/// <reference types="makets" />

make.on(() =>
{
	console.log("TODO: Run makets on ReflexCore"); 
});

make.on("build", async () =>
{
	await make.typescript("./tsconfig.json");
});

make.on("test", () =>
{
	make.typescriptWatcher("../ReflexCore/tsconfig.json");
	make.typescriptWatcher("./tsconfig.test.json");
});

make.on("bundle", "publish", async () =>
{
	const returns = ["Reflex", "ss"];
	
	//# Create reflex.js (which contains Core + ML)
	
	make.concat(
		"../ReflexCore/build/reflex-core.js",
		"./build/reflex-ss.js",
		"./bundle/reflex.js",
	);
	
	make.augment("./bundle/reflex.js", {
		returns,
		globals: true,
		exports: returns.concat("on", "once")
	});
	
	make.minify("./bundle/reflex.js");
	
	//# Create reflex-ss.js (which require()'s Core if necessary)
	
	make.copy("./build/reflex-ss.js", "./bundle");
	make.augment("./bundle/reflex-ss.js", {
		returns,
		globals: true,
		encapsulatedAbove: 
			`var Reflex;` +
			`if (typeof navigator !== "object" && typeof require === "function")` +
				`Reflex = require("reflex-core");`,
	});
	
	make.compilationConstants("./bundle/reflex-ss.js", {
		MODERN: true,
		DEBUG: false
	});
	
	make.minify("./bundle/reflex-ss.js");
	
	//# Handle the d.ts processing
	
	make.copy("./build/reflex-ss.d.ts", "./bundle/index.d.ts");
	make.augment("./bundle/index.d.ts", {
		above: `/// <reference types="reflex-core" />\n\n`
	});
});

make.on("publish", async () => 
{
	make.publish({
		packageFileChanges: {
			main: "./reflex-ss.js",
			eslintIgnore: null,
			// Reflex ML only has a dependency on Reflex Core
			// when it's used from the npm module. When it's
			// drawn in via a script tag, this reflex.js file will have
			// the core built into it.
			dependencies: make.npm.latestOf(["reflex-core"])
		}
	});
});