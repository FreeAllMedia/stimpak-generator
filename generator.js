export default class StimpakGenerator {
	constructor(stimpak) {
		stimpak
			.source("**/*")
				.directory(`${__dirname}/templates`)
			.prompt({
				type: "input",
				name: "generatorName",
				message: "What do you want your generator to be named?",
				default: "my-generator"
			},
			{
				type: "input",
				name: "generatorDescription",
				message: "How would you describe your generator?",
				default: "It's a new generator. I don't really have a description for it, yet."
			})
			.then((stimpak, done) => {
				stimpak.command(`cd ${stimpak.answers().generatorName};npm install`, (stimpak, stdout, stderr, commandDone) => {
					commandDone();
				});
				done();
			});
	}
}
