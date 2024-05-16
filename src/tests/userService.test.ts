import { expect } from "chai";
import request from "supertest";
import app from "../app";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

describe("User API", () => {
  let token: string;
  let userId: string;

  before(async () => {
    token = jwt.sign({ id: "testUserId" }, JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const usersArray = [
      {
        userName: "existingUser",
        accountNumber: "12106988832121",
        emailAddress: "existing@example.com",
        identityNumber: "9876543210",
        password: "password123",
      },
      {
        userName: "10kurniadi.wijaya1",
        accountNumber: "10210698883212",
        emailAddress: "101kurniadiahmadwijaya@gmail.com",
        identityNumber: "1012345678901",
        password: "10123456781",
      },
    ];

    const users = await User.insertMany(usersArray);
    userId = users[0]._id.toString();    
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("GET /users/filter", () => {
    it("should return unauthorized without token", async () => {
      const res = await request(app)
        .get("/api/users/filter")
        .query({ value: "john@example.com", filterType: "emailAddress" });

      expect(res.status).to.equal(401);
      expect(res.body.message).to.equal("Access Unauthorized");
    });

    it("should return user data with valid token", async () => {
      const user = new User({
        userName: "john",
        accountNumber: "123456",
        emailAddress: "john@example.com",
        identityNumber: "987654321",
        password: "password123",
      });

      await user.save();

      const res = await request(app)
        .get("/api/users/filter")
        .set("Authorization", `Bearer ${token}`)
        .query({ value: "john@example.com", filterType: "emailAddress" });

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property(
        "emailAddress",
        "john@example.com"
      );
    });

    it("should return error if no filterType and value provided", async () => {
      const res = await request(app)
        .get("/api/users/filter")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        "Filter type and value should be input"
      );
    });
  });

  describe("GET /api/users", () => {
    it("should return list of users", async () => {
      const users = [
        {
          userName: "kurniadi.wijaya",
          accountNumber: "10698883212",
          emailAddress: "kurniadiahmadwijaya@gmail.com",
          identityNumber: "1234567890",
          password: "12345678",
        },
        {
          userName: "kurniadi.wijaya1",
          accountNumber: "210698883212",
          emailAddress: "1kurniadiahmadwijaya@gmail.com",
          identityNumber: "12345678901",
          password: "123456781",
        },
      ];

      await User.insertMany(users);

      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Success");
      expect(res.body.data).to.be.an("array");
      expect(res.body.data).to.have.lengthOf(users.length);
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const userData = {
        userName: "testuser",
        accountNumber: "1234567890",
        emailAddress: "testuser@example.com",
        identityNumber: "0987654321",
        password: "testpassword",
      };

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${token}`)
        .send(userData);

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal("User created");
    });

    it("should return validation error if required fields are missing", async () => {
      const userData = {
        userName: "testuser",
      };

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${token}`)
        .send(userData);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Validation error");
      expect(res.body.details).to.be.an("array").that.is.not.empty;
      expect(res.body.details).to.deep.include.members([
        { field: "identityNumber", message: "Identity number is required" },
        { field: "emailAddress", message: "Email address is required" },
        { field: "accountNumber", message: "Account number is required" },
      ]);
    });

    it("should return error if user with same unique field exists", async () => {
      const existingUser = new User({
        userName: "existingUser",
        accountNumber: "12106988832121", 
        emailAddress: "existing@example.com",
        identityNumber: "9876543210",
        password: "password123",
      });

      await existingUser.save();

      const userData = {
        userName: "newUser",
        accountNumber: "12106988832121", 
        emailAddress: "new@example.com",
        identityNumber: "1234567890",
        password: "password123",
      };

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${token}`)
        .send(userData);

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal(
        `User with accountNumber: ${userData.accountNumber} already exists`
      );
    });
  });

  describe("PUT /api/users/{id}", () => {
    let validUserId: string;
    let invalidUserId: string;
    let existingAccountUser: User;
  
    before(async () => {
      // Create a user with an existing account number
      existingAccountUser = new User({
        userName: "existingAccountUser",
        accountNumber: "12106988832121",
        emailAddress: "existingaccount@example.com",
        identityNumber: "1111111111",
        password: "password123",
      });

      await existingAccountUser.save();
  
      const validUser = new User({
        userName: "validUser",
        accountNumber: "98765432101234",
        emailAddress: "valid@example.com",
        identityNumber: "2222222222",
        password: "password123",
      });

      const savedUser = await validUser.save();
      validUserId = savedUser._id.toString();
      invalidUserId = "invalidId";
    });
  
    it("should update user data", async () => {
      const updateData = {
        userName: "updatedUser",
        password: "updatedPassword",
      };
  
      const res = await request(app)
        .put(`/api/users/${validUserId}`)
        .send(updateData);
  
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Success");
  
      const updatedUser = await User.findById(validUserId);
      expect(updatedUser).to.exist;
      expect(updatedUser!.userName).to.equal(updateData.userName);
    });
  
    it("should return error if ID is invalid", async () => {
      const res = await request(app)
        .put(`/api/users/${invalidUserId}`)
        .send({ userName: "updatedUser" });
  
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid user ID");
    });
  });

  describe("DELETE /api/users/{id}", () => {
    let validUserId: string;
    let invalidUserId: string;

    before(async () => {
      // Create a user for testing
      const user = new User({
        userName: "userToDelete",
        accountNumber: "12345678901234",
        emailAddress: "delete@example.com",
        identityNumber: "3333333333",
        password: "password123",
      });
      const savedUser = await user.save();
      validUserId = savedUser._id.toString();
  
      // Invalid user ID
      invalidUserId = "invalidId";
    });
  
    it("should remove user", async () => {
      const res = await request(app).delete(`/api/users/${validUserId}`);
  
      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("User removed");
  
      // Check if user was actually removed
      const deletedUser = await User.findById(validUserId);
      expect(deletedUser).to.not.exist;
    });
  
    it("should return error if ID is invalid", async () => {
      const res = await request(app).delete(`/api/users/${invalidUserId}`);
  
      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal("Invalid user ID");
    });
  });
});
