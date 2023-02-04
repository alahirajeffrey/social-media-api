import supertest from "supertest";
import server from "../src/server";
import * as clearTable from "../src/utils/clearDb.utils";

describe("Post Routes", () => {
  let fourthUserJwt;
  let fourthUser;
  let fourthUserProfile;

  beforeAll(async () => {
    // clear tables before running test
    clearTable.clearTables;

    // register and login first user
    fourthUser = await supertest(server)
      .post("/api/v1/auth/register")
      .send({ email: "fourth@email.com", password: "P@ssworded" });

    fourthUserJwt = await supertest(server).post("/api/v1/auth/login").send({
      email: "fourth@email.com",
      password: "P@ssworded",
    });

    fourthUserProfile = await supertest(server)
      .post("/api/v1/profile/create-profile")
      .send({
        bio: "fourth user bio",
        mobileNumber: "123456789",
        profilePicUri: "testProfilePic",
        userId: fourthUser._body.id,
        fullname: "fourth user",
        email: fourthUser._body.email,
      })
      .set({ authorization: `Bearer ${fourthUserJwt._body.accessToken}` });
  });

  afterAll(async () => {
    // clear tables after running tests
    clearTable.clearTables;
  });

  describe("create post route", () => {
    it("should create a post for a user", async () => {
      await supertest(server)
        .post("/api/v1/posts/create-post")
        .send({
          profileId: fourthUserProfile._body.id,
          title: "test post",
          content: "test content",
        })
        .set({ authorization: `Bearer ${fourthUserJwt._body.accessToken}` })
        .expect("Content-Type", /json/)
        .expect(201);
    });
    it("should return a 500 error if there is no request body", async () => {
      await supertest(server)
        .post("/api/v1/posts/create-post")
        .send({})
        .expect(500)
        .set({ authorization: `Bearer ${fourthUserJwt._body.accessToken}` });
    });
  });
  describe("get all posts belonging to a user", () => {
    it("should return a 200", async () => {
      await supertest(server)
        .get(`/api/v1/posts/profile-posts/${fourthUserProfile._body.id}`)
        .set({ authorization: `Bearer ${fourthUserJwt._body.accessToken}` })
        .expect(200);
    });
  });
  describe("get post by id", () => {
    it("should return a 404 if post does not exist", async () => {
      await supertest(server)
        .get("/api/v1/posts/postId")
        .set({ authorization: `Bearer ${fourthUserJwt._body.accessToken}` })
        .expect(404, {
          message: "post not found",
        });
    });
  });
});
