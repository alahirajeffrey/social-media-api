import supertest from "supertest";
import server from "../src/server";
import * as clearTable from "../src/utils/clearDb.utils";

describe("Profile Routes", () => {
  let firstUserJwt;
  let firstUser;
  let secondUser;
  let thirdUser;
  let secondUserJwt;
  let thirdUserJwt;
  let secondUserProfile;
  let thirdUserProfile;

  beforeAll(async () => {
    // clear profile and user table
    clearTable.clearTables;

    // register and login first user
    firstUser = await supertest(server)
      .post("/api/v1/auth/register")
      .send({ email: "first@email.com", password: "P@ssworded" });

    firstUserJwt = await supertest(server).post("/api/v1/auth/login").send({
      email: "first@email.com",
      password: "P@ssworded",
    });

    // register, login and create profile for second user
    secondUser = await supertest(server)
      .post("/api/v1/auth/register")
      .send({ email: "second@email.com", password: "P@ssworded" });

    secondUserJwt = await supertest(server).post("/api/v1/auth/login").send({
      email: "second@email.com",
      password: "P@ssworded",
    });

    secondUserProfile = await supertest(server)
      .post("/api/v1/profile/create-profile")
      .send({
        bio: "second user bio",
        mobileNumber: "123456789",
        profilePicUri: "testProfilePic",
        userId: secondUser._body.id,
        fullname: "second user",
        email: secondUser._body.email,
      })
      .set({ authorization: `Bearer ${secondUserJwt._body.accessToken}` });

    // register, login and create profile for third user
    thirdUser = await supertest(server)
      .post("/api/v1/auth/register")
      .send({ email: "third@email.com", password: "P@ssworded" });

    thirdUserJwt = await supertest(server).post("/api/v1/auth/login").send({
      email: "third@email.com",
      password: "P@ssworded",
    });

    thirdUserProfile = await supertest(server)
      .post("/api/v1/profile/create-profile")
      .send({
        bio: "third user bio",
        mobileNumber: "123456789",
        profilePicUri: "testProfilePic",
        userId: thirdUser._body.id,
        fullname: "third user",
        email: thirdUser._body.email,
      })
      .set({ authorization: `Bearer ${thirdUserJwt._body.accessToken}` });
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
          email: firstUser._body.email,
        })
        .set({ authorization: `Bearer ${firstUserJwt._body.accessToken}` })
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
          email: firstUser._body.email,
        })
        .set({ authorization: `Bearer ${firstUserJwt._body.accessToken}` })
        .expect(400, {
          message: "user already has a profile",
        });
    });
  });
  describe("get profile by email route test", () => {
    it("should return a profile", async () => {
      await supertest(server)
        .get("/api/v1/profile/first@email.com")
        .set({ authorization: `Bearer ${firstUserJwt._body.accessToken}` })
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });
  describe("follow a user", () => {
    it("should return a 404 if profile to be followed does not exist", async () => {
      await supertest(server)
        .patch("/api/v1/profile/follow/profile-id/follower-id")
        .set({ authorization: `Bearer ${secondUserJwt._body.accessToken}` })
        .expect(404, {
          message: "profile does not exist",
        });
    });
    it("should follow another user", async () => {
      await supertest(server)
        .patch(
          `/api/v1/profile/follow/${thirdUserProfile._body.id}/${secondUserProfile._body.id}`
        )
        .set({ authorization: `Bearer ${secondUserJwt._body.accessToken}` })
        .expect(200, {
          message: `you are now following ${thirdUserProfile._body.fullname}`,
          numberOfFollowersBefore: 0,
          numberOfFollowersAfter: 1,
        });
    });
  });
  describe("unfollow a user", () => {
    it("should unfollow a user", async () => {
      await supertest(server)
        .patch(
          `/api/v1/profile/unfollow/${secondUserProfile._body.id}/${thirdUserProfile._body.id}`
        )
        .set({ authorization: `Bearer ${secondUserJwt._body.accessToken}` })
        .expect(200, {
          message: `you are no longer following ${thirdUserProfile._body.fullname}`,
          numberOfFollowingBefore: 1,
          numberOfFollowingAfter: 0,
        });
    });
    it("should return a 404 if profile to be unfollowed does not exist", async () => {
      await supertest(server)
        .patch("/api/v1/profile/unfollow/profile-id/follower-id")
        .set({ authorization: `Bearer ${secondUserJwt._body.accessToken}` })
        .expect(404, {
          message: "profile does not exist",
        });
    });
  });
  describe("test route to get followers", () => {
    it("should return 404 if a profile does not exist", async () => {
      await supertest(server)
        .get("/api/v1/profile/profile-id")
        .set({ authorization: `Bearer ${secondUserJwt._body.accessToken}` })
        .expect(404, {
          message: "profile does not exist",
        });
    });
    it("should follow another user to enable testing of get followers route", async () => {
      await supertest(server)
        .patch(
          `/api/v1/profile/follow/${thirdUserProfile._body.id}/${secondUserProfile._body.id}`
        )
        .set({ authorization: `Bearer ${secondUserJwt._body.accessToken}` })
        .expect(200);
    });
    it("should return a list of follower profiles", async () => {
      await supertest(server)
        .get(`/api/v1/profile/followers/${thirdUserProfile._body.id}`)
        .set({ authorization: `Bearer ${thirdUserJwt._body.accessToken}` })
        .expect(200);
    });
  });
});
