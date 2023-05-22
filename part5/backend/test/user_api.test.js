const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
  for (let user of helper.initialUsers) {
    let userObject = new User(user);
    await userObject.save();
  }
});

describe("Creating a new user", () => {
  test("Creating a valid user", async () => {
    const newUser = {
      username: "newuser",
      name: "bob newman",
      password: "123",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);
    const usernames = usersAtEnd.map((n) => n.username);
    expect(usernames).toContain("newuser");
  });
  test("Creating an invalid user with short password", async () => {
    const newUser = {
      username: "newuser",
      name: "bob newman",
      password: "1",
    };
    const usersAtStart = await helper.usersInDb();
    await api.post("/api/users").send(newUser).expect(400);
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  test("Creating an invalid user with short username", async () => {
    const newUser = {
      username: "n",
      name: "bob newman",
      password: "123",
    };
    const usersAtStart = await helper.usersInDb();
    await api.post("/api/users").send(newUser).expect(400);
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  test("Creating an invalid user with missing parameters", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser1 = {
      name: "bob newman",
      password: "123",
    };
    const newUser2 = {
      username: "newuser",
      password: "123",
    };
    const newUser3 = {
      username: "newuser",
      name: "bob newman",
    };
    await api.post("/api/users").send(newUser1).expect(400);
    await api.post("/api/users").send(newUser2).expect(400);
    await api.post("/api/users").send(newUser3).expect(400);
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
