const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./index.js");

chai.use(chaiHttp);
const expect = chai.expect;

describe("GET /test", () => {
  it("should return an array of objects", (done) => {
    chai
      .request(app)
      .get("/test")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf(5);
        done();
      });
  });

  it("should have valid objects with 'id', 'name', and 'gender' properties", (done) => {
    chai
      .request(app)
      .get("/test")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");

        res.body.forEach((item) => {
          expect(item).to.have.property("id").that.is.a("number");
          expect(item).to.have.property("name").that.is.a("string");
          expect(item).to.have.property("gender").that.is.a("string");
        });

        done();
      });
  });
});
