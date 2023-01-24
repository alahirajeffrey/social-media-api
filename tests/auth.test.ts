import supertest from "supertest";
import server from "../src/server";
import { clearUserTable } from "../src/utils/clearDb.utils";

describe("Server", () => {
  beforeAll(clearUserTable);

  describe("test user registration", () => {
    it("should return a 201 status code", async () => {
      await supertest(server)
        .post("/api/v1/auth/register")
        .send({
          email: "user@email.com",
          password: "P@ssworded",
        })
        .expect(201);
    });
    it("should return a 403 status code if user with email already exists", async () => {
      await supertest(server)
        .post("/api/v1/auth/register")
        .send({
          email: "user@email.com",
          password: "P@ssworded",
        })
        .expect(403, {
          message: "A user with that email already exists",
        });
    });
  });
  describe("test login route", () => {
    it("should return a jsonwebtoken", async () => {
      await supertest(server)
        .post("/api/v1/auth/login")
        .send({
          email: "user@email.com",
          password: "P@ssworded",
        })
        .expect(200);
    });
    it("should return a 403 error if password is incorrect", async () => {
      await supertest(server)
        .post("/api/v1/auth/login")
        .send({
          email: "user@email.com",
          password: "Passworded",
        })
        .expect(403, {
          message: "Incorrect password",
        });
    });
  });
  describe("test change password route", () => {
    it("should return a 200 status code", async () => {
      await supertest(server)
        .patch("/api/v1/auth/change-password")
        .send({
          oldPassword: "P@ssworded",
          newPassword: "P@ssworded2",
          email: "user@email.com",
        })
        .expect(200, {
          message: "Password successfully changed",
        });
    });
    it("should return a 403 error if password is incorrect", async () => {
      await supertest(server)
        .patch("/api/v1/auth/change-password")
        .send({
          oldPassword: "P@ssworded",
          newPassword: "P@ssworded2",
          email: "user@email.com",
        })
        .expect(403, {
          message: "Incorrect password",
        });
    });
  });
  // describe("test verification mail link", () => {
  //   it("should send a 200 status code", async () => {
  //     await supertest(server)
  //       .post("/api/v1/auth/send-verification-mail")
  //       .send({
  //         email: "user@email.com",
  //       })
  //       .expect(200, {
  //         message: "Verification mail sent",
  //       });
  //   });
  // });
});
