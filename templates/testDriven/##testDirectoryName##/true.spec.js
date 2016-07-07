import Stimpak from "stimpak";
import <%= generatorClassName %> from "../<%= mainFilePath %>";

describe("stimpak-<%= generatorName %> (all options true)", () => {
	let stimpak,
			differences;

	beforeEach(done => {
		stimpak = new Stimpak();

		stimpak
		.test
		.answers({
			renderTitle: true,
			content: "Hello, World!"
		})
		.use(<%= generatorClassName %>)
		.generate(error => {
			differences = stimpak.report.diffFixtures(
				`${__dirname}/fixtures/true`
			);
			done(error);
		});
	});

	it("should render files to the correct paths", () => {
		const actualPaths = differences.paths.actual;
		const expectedPaths = differences.paths.expected;

		actualPaths.should.eql(expectedPaths);
	});

	it("should render files with the correct content", () => {
		differences.content.should.eql({});
	});
});
