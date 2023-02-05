import supertest from "supertest";
import server from "../src/server";
import * as clearTable from "../src/utils/clearDb.utils";

describe("Comment Routes", () => {
  let fifthUser;
  let fifthUserProfile;
  let fifthUserJwt;
  let post;

  beforeAll(async () => {
    // clear tables before running test
    clearTable.clearTables;

    fifthUser = await supertest(server)
      .post("/api/v1/auth/register")
      .send({ email: "fifth@email.com", password: "P@ssworded" });

    fifthUserJwt = await supertest(server).post("/api/v1/auth/login").send({
      email: "fifth@email.com",
      password: "P@ssworded",
    });

    fifthUserProfile = await supertest(server)
      .post("/api/v1/profile/create-profile")
      .send({
        bio: "fifth user bio",
        mobileNumber: "123456789",
        profilePicUri: "testProfilePic",
        userId: fifthUser._body.id,
        fullname: "fifth user",
        email: fifthUser._body.email,
      })
      .set({ authorization: `Bearer ${fifthUserJwt._body.accessToken}` });

    post = await supertest(server)
      .post("/api/v1/posts/create-post")
      .set({ authorization: `Bearer ${fifthUserJwt._body.accessToken}` })
      .send({
        profileId: fifthUserProfile._body.id,
        title: "test post",
        content: "test content",
      });
  });

  describe("create a comment", () => {
    it("should return a 201", async () => {
      await supertest(server)
        .post("/api/v1/comments/create-comment")
        .send({
          postId: post._body.id,
          content: "sample comment",
        })
        .set({ authorization: `Bearer ${fifthUserJwt._body.accessToken}` })
        .expect(201)
        .expect("Content-Type", /json/);
    });
  });
  describe("get all comments under a post", () => {
    it("should return a 200 status code", async () => {
      await supertest(server)
        .get(`/api/v1/comments/${post._body.id}`)
        .set({ authorization: `Bearer ${fifthUserJwt._body.accessToken}` })
        .expect(200);
    });
  });
});
