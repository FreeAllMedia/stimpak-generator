import packageJson from "./package.json";
import StimpakReadme from "stimpak-readme";

export default class StimpakGenerator {
	constructor(stimpak) {
		stimpak.use(StimpakReadme);

		this.setTemplateSource(stimpak);
		this.showLogo(stimpak);
		this.askForBasicInformation(stimpak);
		this.buildPackages(stimpak);
	}

	setTemplateSource(stimpak) {
		stimpak
			.source("**/*")
				.directory(`${__dirname}/templates`);
	}

	showLogo(stimpak) {
		stimpak
			.logo(`Generator v${packageJson.version}`);
	}

	askForBasicInformation(stimpak) {
		stimpak
			.note("Basic Information:")
			.prompt(
				this.generatorNamePrompt,
				this.generatorDescriptionPrompt
			);
	}

	buildPackages(stimpak) {
		stimpak
			.then((stimpak, done) => {
				stimpak.command(`cd stimpak-${stimpak.answers().generatorName};npm install`, (stimpak, stdout, stderr, commandDone) => {
					commandDone();
				});
				done();
			})
	}

	/**
	 * PROMPTS
	 */

	get generatorNamePrompt() {
		return {
			type: "input",
			name: "generatorName",
			message: "What do you want your generator to be named?",
			default: "my-generator"
		};
	}

	get generatorDescriptionPrompt() {
		return {
			type: "input",
			name: "generatorDescription",
			message: "How would you describe your generator?",
			default: "It's a new generator. I don't really have a description for it, yet."
		};
	}
}
