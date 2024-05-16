import { expect } from "chai";
import request from "supertest";
import app from "../app";
import authService from "../services/authService";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import User from "../models/User";

describe("Auth API", () => {
  let validUser: any;

  before(async () => {
    validUser = new User({
      userName: "kurniadi.wijaya",
      accountNumber: "10698883212",
      emailAddress: "kurniadiahmadwijaya@gmail.com",
      identityNumber: "1234567890",
      password: "password123",
    });

    await validUser.save();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/login", () => {
    it("should return success with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: validUser.emailAddress,
          password: "password123",
        });

      expect(res.status).to.equal(200);
      expect(res.body.statusCode).to.equal(200);
      expect(res.body.message).to.equal("Success");
      expect(res.body.data).to.exist;
      expect(res.body.data.user).to.have.property("_id", validUser._id.toString());
      expect(res.body.data.user).to.have.property("userName", validUser.userName);
      expect(res.body.data.user).to.have.property("accountNumber", validUser.accountNumber);
      expect(res.body.data.user).to.have.property("emailAddress", validUser.emailAddress);
      expect(res.body.data.user).to.have.property("identityNumber", validUser.identityNumber);
      expect(res.body.data.token).to.exist;

      const decodedToken = jwt.verify(res.body.data.token, JWT_SECRET as string);
      expect(decodedToken).to.have.property("id", validUser._id.toString());
    });

    it("should return error with invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: validUser.emailAddress,
          password: "wrongPassword",
        });

      expect(res.status).to.equal(400);
      expect(res.body.statusCode).to.equal(400);
      expect(res.body.message).to.equal("Invalid username or password");
      expect(res.body.data).to.not.exist;
    });
  });
});
