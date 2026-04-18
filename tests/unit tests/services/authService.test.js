const Auth = require("../../../src/modules/auth/auth.service");
const prisma = require("../../../src/config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


jest.mock("../../../src/config/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  
  describe("Register", () => {
    it("should throw error if user already exists", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1 });

      await expect(
        Auth.Register({
          name: "John",
          email: "john@test.com",
          password: "123456",
        })
      ).rejects.toThrow("User already exists");
    });

    it("should create a new user and return token + user", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      bcrypt.hash.mockResolvedValue("hashedPassword");

      prisma.user.create.mockResolvedValue({
        id: "1",
        name: "John",
        email: "john@test.com",
        password: "hashedPassword",
      });

      jwt.sign.mockReturnValue("fakeToken");

      const result = await Auth.Register({
        name: "John",
        email: "john@test.com",
        password: "123456",
      });

      expect(result.token).toBe("fakeToken");
      expect(result.user).toEqual({
        id: "1",
        name: "John",
        email: "john@test.com",
      });

      expect(prisma.user.create).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(jwt.sign).toHaveBeenCalled();
    });
  });

  
  describe("Login", () => {
    it("should throw error if user not found", async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        Auth.Login({
          email: "test@test.com",
          password: "123",
        })
      ).rejects.toThrow("User not found");
    });

    it("should throw error if password is incorrect", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "1",
        email: "test@test.com",
        password: "hashedPassword",
      });

      bcrypt.compare.mockResolvedValue(false);

      await expect(
        Auth.Login({
          email: "test@test.com",
          password: "wrongpass",
        })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should return token and user on successful login", async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: "1",
        email: "test@test.com",
        password: "hashedPassword",
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("loginToken");

      const result = await Auth.Login({
        email: "test@test.com",
        password: "123456",
      });

      expect(result.token).toBe("loginToken");
      expect(result.user.email).toBe("test@test.com");

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "123456",
        "hashedPassword"
      );

      expect(jwt.sign).toHaveBeenCalled();
    });
  });
});