const should = require("chai").should();
const nock = require("nock");

const { LinkShort, Linker, baseURL } = require("../dist/index");

describe("Test LinkShort-wrapper", () => {
	describe("Test LinkShort class", () => {
		it("Create a new Linker object", (done) => {
			nock(baseURL).post("/create").reply(200, {
				short: "1234",
				token: "1234",
			});

			var lc = new LinkShort();
			lc.create("https://example.com").then((linker) => {
				linker.should.have.property("short", "1234");
				linker.should.have.property("token", "1234");
				linker.isOwner().should.be.true;
				done();
			});
		});

		it("Get Linker object from short", (done) => {
			nock(baseURL).get("/test/json").reply(200, {
				short: "1234",
				destination: "https://example.com",
			});

			var lc = new LinkShort();
			lc.getByShort("test").then((linker) => {
				linker.should.have.property("short", "1234");
				linker.should.have.property(
					"destination",
					"https://example.com"
				);
				linker.should.not.have.property("token", "1234");
				linker.isOwner().should.be.false;
				done();
			});
		});

		it("Get all Linker objects", (done) => {
			nock(baseURL).get("/links").reply(200, {
				test: "https://example.com",
				other_link: "https://example.com/test",
			});

			var lc = new LinkShort();
			lc.getAll().then((arr) => {
				arr.should.be.a("array");
				arr.should.have.lengthOf(2);
				done();
			});
		});
	});

	describe("Test Linker object", () => {
		it("Edit Linker", (done) => {
			nock(baseURL).put("/test").reply(200);
			nock(baseURL).get("/test/json").reply(200, {
				short: "test",
				destination: "https://example.com/test",
			});

			var linker = new Linker(
				"test",
				"https://example.com",
				"1234",
				baseURL
			);

			linker.edit("https://example.com/test").then(() => {
				linker.destination.should.equal("https://example.com/test");
				done();
			});
		});

		it("Delete Linker", (done) => {
			nock(baseURL).delete("/test").reply(200);

			var linker = new Linker(
				"test",
				"https://example.com",
				"1234",
				baseURL
			);

			linker.delete().then(() => {
				done();
			});
		});
	});
});
