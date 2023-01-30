import supertest from "supertest";
import server from "../src/server";
import * as clearTable from "../src/utils/clearDb.utils";

describe("Profile Routes", () => {
  let jwt;
  let firstUser;
  let secondUser;

  beforeAll(async () => {
    // clear profile and user table
    clearTable.clearTables;

    // register first user
    firstUser = await supertest(server)
      .post("/api/v1/auth/register")
      .send({ email: "first@email.com", password: "P@ssworded" });

    // register second user
    secondUser = await supertest(server)
      .post("/api/v1/auth/register")
      .send({ email: "second@email.com", password: "P@ssworded" });

    jwt = await supertest(server).post("/api/v1/auth/login").send({
      email: "first@email.com",
      password: "P@ssworded",
    });
  });

  describe("create profile test", () => {
    it("should create a profile for a logged in user", async () => {
      await supertest(server)
        .post("/api/v1/profile/create-profile")
        .send({
          bio: "testBio",
          mobileNumber: "123456789",
          profilePicUri: "testProfilePic",
          userId: firstUser._body.id,
          fullname: "fullname",
        })
        .set({ authorization: `Bearer ${jwt._body.accessToken}` })
        .expect(201)
        .expect("Content-Type", /json/);
    });

    it("should return a 400 error if user already has a profile", async () => {
      await supertest(server)
        .post("/api/v1/profile/create-profile")
        .send({
          bio: "testBio",
          mobileNumber: "123456789",
          profilePicUri: "testProfilePic",
          userId: firstUser._body.id,
          fullname: "fullname",
        })
        .set({ authorization: `Bearer ${jwt._body.accessToken}` })
        .expect(400, {
          message: "user already has a profile",
        });
    });
  });
  describe("get profile by id route test", () => {
    it("should return a profile", async () => {
      await supertest(server)
        .get("/api/v1/profile/first@email.com")
        .set({ authorization: `Bearer ${jwt._body.accessToken}` })
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });
});
