import packageJson from "./package.json";
import inflect from "jargon";

export default class StimpakGenerator {
	setup(stimpak) {
		this.prompt(stimpak);
		stimpak
		.then(() => {
			this.setGeneratorClassName(stimpak);
			this.renderTemplates(stimpak);
			this.buildDependencies(stimpak);
		});
	}

	prompt(stimpak) {
		stimpak
		.note("Basic Generator Information:")
		.prompt({
			type: "input",
			name: "generatorName",
			message: "What do you want the generator to be named?",
			default: "my-generator"
		}, {
			type: "input",
			name: "generatorDescription",
			message: "How would you describe the generator?",
			default: "It's a new generator. I don't really have a description for it, yet."
		}, {
			type: "input",
			name: "libDirectoryName",
			message: "What do you want the directory containing source code to be named?",
			default: "lib"
		}, {
			type: "input",
			name: "mainFileName",
			message: "What do you want the main generator file to be named?",
			default: "generator.js"
		}, {
			type: "input",
			name: "templatesDirectoryName",
			message: "What do you want the templates directory to be named?",
			default: "templates"
		}, {
			type: "confirm",
			name: "testDriven",
			message: "Will this generator be test-driven?"
		}, {
			type: "list",
			name: "generatorPattern",
			message: "Which generator pattern would you like to render?",
			choices: () => {
				const choices = ["bare bones", "bridge of death"];
				if (stimpak.answers().testDriven) {
					choices.push("tests-only");
				}
				return choices;
			},
			default: "bare bones"
		})
		.then(() => {
			const mainFilePath = `${stimpak.answers().libDirectoryName}/${stimpak.answers().mainFileName}`;
			stimpak.answers({ mainFilePath });

			if (stimpak.answers().testDriven) {
				this.promptTestDrivenOptions(stimpak);
			}
		})
	}

	promptTestDrivenOptions(stimpak) {
		stimpak
		.note("Test-Driven Options:")
		.prompt({
			type: "input",
			name: "testDirectoryName",
			message: "What do you want the test directory to be named?",
			default: "test"
		}, {
			type: "input",
			name: "gulpTasksDirectoryName",
			message: "What do you want the gulp tasks directory to be named?",
			default: "tasks"
		}, {
			type: "input",
			name: "fixturesDirectoryName",
			message: "What do you want the fixtures directory to be named?",
			default: "fixtures"
		}, {
			type: "confirm",
			name: "build",
			message: "Do you want to automatically build dependencies at the end?"
		});
	}

	setGeneratorClassName(stimpak) {
		const generatorName = stimpak.answers().generatorName;
		const generatorClassName = inflect(generatorName).pascal.toString();
		const generatorInstanceName = inflect(generatorName).pascal.camel.toString();
		stimpak.answers({
			generatorClassName: generatorClassName,
			generatorInstanceName: generatorInstanceName
		});
	}

	renderTemplates(stimpak) {
		stimpak
		.merge("package.json");

		switch (stimpak.answers().generatorPattern) {
			case "bare bones":
				stimpak
				.render("**/*", `${__dirname}/templates/common`)
				.render("**/*", `${__dirname}/templates/barebones`);
				break;
			case "bridge of death":
				stimpak
				.render("**/*", `${__dirname}/templates/common`)
				.render("**/*", `${__dirname}/templates/bridgeOfDeath`);
		}

		if (stimpak.answers().testDriven) {
			stimpak.render("**/*", `${__dirname}/templates/testDriven`);
		}
	}

	buildDependencies(stimpak) {
		if (stimpak.answers().build) {
			stimpak
			.note("Building NPM Packages. Please wait...")
			.command(`npm install`, (stimpak, stdout, stderr, commandDone) => {
				commandDone();
			});
		}
	}
}
