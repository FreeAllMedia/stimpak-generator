module.exports = function StimpakGenerator(stimpak) {
	stimpak
		.source("**/*")
			.directory(`${__dirname}/templates`)
		.prompt({
			type: "input",
			name: "templateValueName",
			message: "What would you do with a drunken sailor?",
			default: "Tie him to the long boat 'till he's sober"
		});
}
