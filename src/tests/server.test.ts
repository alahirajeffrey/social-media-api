import supertest from "supertest";
import server from "../server";

describe("Server", () => {
  describe("test server response", () => {
    it("should return a 200 status code", async () => {
      await supertest(server).get("/").expect(200);
    });
    it("should return a json respnse", async () => {
      await supertest(server).get("/").expect("Content-Type", /json/);
    });
  });
});
