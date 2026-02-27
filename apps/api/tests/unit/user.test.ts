import { UserType } from "@repo/types";
import { UserController } from "@/controller/user";
import bcrypt from "bcrypt";
import test from "node:test";
import assert from "node:assert";

const password = "123";
const hashedPassword = await bcrypt.hash("123", 12);
const mockUser: UserType = {
  id: "1",
  email: "teste@teste.com",
  name: "teste",
  username: "teste",
  birthdate: new Date("2000-01-01"),
  password: hashedPassword,
  avatar_key: "",
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};

function CreateMockDatabase(user: UserType): any {
  return {
    insert: () => ({
      values: () => ({
        returning: async () => [mockUser],
      }),
    }),
    select: () => ({
      from: () => ({
        where: async () => [mockUser],
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => ({
          returning: () => [mockUser],
        }),
      }),
    }),
  };
}

test("User unit tests", async (t) => {
  await t.test("Create user", async (t) => {
    const mockDatabase = CreateMockDatabase(mockUser);
    const userController = new UserController(mockDatabase);
    const response = await userController.CreateUser({
      email: mockUser.email,
      name: mockUser.name,
      username: mockUser.username,
      birthdate: mockUser.birthdate,
      password: mockUser.password,
      avatar_key: mockUser.avatar_key,
    });

    assert.equal(response.id, mockUser.id);
    assert.equal(response.email, mockUser.email);
    assert.equal(response.name, mockUser.name);
    assert.equal(response.username, mockUser.username);
    assert.equal(response.birthdate, mockUser.birthdate);
    assert.equal(response.avatar_key, mockUser.avatar_key);
  });

  await t.test("Get user by id", async (t) => {
    const mockDatabase = CreateMockDatabase(mockUser);
    const userController = new UserController(mockDatabase);
    const response = await userController.GetUserById(mockUser.id);

    assert.equal(response.id, mockUser.id);
  });

  await t.test("Get user by name", async (t) => {
    const mockDatabase = CreateMockDatabase(mockUser);
    const userController = new UserController(mockDatabase);
    const response = await userController.GetUserByName(mockUser.name);

    assert.equal(response.name, mockUser.name);
  });

  await t.test("Get user by username", async (t) => {
    const mockDatabase = CreateMockDatabase(mockUser);
    const userController = new UserController(mockDatabase);
    const response = await userController.GetUserByUsername(mockUser.username);

    assert.equal(response.username, mockUser.username);
  });

  await t.test("Get user by email", async (t) => {
    const mockDatabase = CreateMockDatabase(mockUser);
    const userController = new UserController(mockDatabase);
    const response = await userController.GetUserByEmail(mockUser.email);

    assert.equal(response.email, mockUser.email);
  });

  await t.test("Update user", { skip: true }, async (t) => {
    const mockDatabase = CreateMockDatabase(mockUser);
    const userController = new UserController(mockDatabase);
    const data = { name: "teste2" };
    const response = await userController.UpdateUser(mockUser.id, data);

    assert.notEqual(response.name, data.name);
  });

  await t.test("Update user password", { skip: true }, async (t) => {
    const mockDatabase = CreateMockDatabase(mockUser);
    const userController = new UserController(mockDatabase);
    const newPassword = "1234";
    const response = await userController.UpdateUserPassword(
      mockUser.id,
      mockUser.password,
      newPassword,
    );

    assert.equal(response.id, mockUser.id);

    const isValid = await userController.VerifyPassword(
      mockUser.id,
      newPassword,
    );
    assert.equal(isValid, true);
  });

  await t.test("Delete password", async (t) => {
    const mockDatabase = CreateMockDatabase(mockUser);
    const userController = new UserController(mockDatabase);
    await userController.DeleteUser(mockUser.id);
  });

  await t.test("Verify password", async (t) => {
    const mockDatabase = CreateMockDatabase(mockUser);
    const userController = new UserController(mockDatabase);
    const response = await userController.VerifyPassword(mockUser.id, password);
    assert.equal(response, true);
  });
});
