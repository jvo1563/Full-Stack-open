const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
  // for (let blog of helper.initialBlogs) {
  //   let blogObject = new Blog(blog);
  //   await blogObject.save();
  // }
});

describe("getting the initial blogs", () => {
  test("blogs are returned in JSON format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blogs returned have expected length", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("blogs have an id parameter", async () => {
    const response = await api.get("/api/blogs");
    const blogs = response.body;
    blogs.forEach((blog) => expect(blog.id).toBeDefined());
  });
});

describe("adding new blog", () => {
  let token = null;
  beforeAll(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("12345", 10);
    const user = await new User({
      username: "username",
      name: "bob",
      passwordHash,
    }).save();

    const userForToken = { username: "name", id: user.id };
    return (token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    }));
  });

  test("a valid blog can be added by an authorized user", async () => {
    const newBlog = {
      title: "new title",
      author: "new author",
      url: "new url",
      likes: 50,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain("new title");
  });

  test("adding a valid blog without providing a token returns 401", async () => {
    const blogsAtStart = await Blog.find({}).populate("user");
    const newBlog = {
      title: "new title",
      author: "new author",
      url: "new url",
      likes: 50,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await Blog.find({}).populate("user");
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    expect(blogsAtStart).toEqual(blogsAtEnd);
  });

  test("likes property defaults to 0 if missing", async () => {
    const newBlog = {
      title: "new title",
      author: "new author",
      url: "new url",
      // likes: 50,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    expect(response.body.likes).toBe(0);
  });

  test("adding blog without title property returns 400", async () => {
    const newBlog = {
      // title: "new title",
      author: "new author",
      url: "new url",
      likes: 50,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("adding blog without url property returns 400", async () => {
    const newBlog = {
      title: "new title",
      author: "new author",
      // url: "new url",
      likes: 50,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("adding blog without author property returns 400", async () => {
    const newBlog = {
      title: "new title",
      // author: "new author",
      url: "new url",
      likes: 50,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deleting a blog", () => {
  let token = null;
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("12345", 10);
    const user = await new User({
      username: "username",
      name: "bob",
      passwordHash,
    }).save();

    const userForToken = { username: "name", id: user.id };
    token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });
    const newBlog = {
      title: "some blog",
      author: "some author",
      url: "https://www.example.com",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    return token;
  });

  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await Blog.find({}).populate("user");
    const blogToDelete = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await Blog.find({}).populate("user");
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test("deleting a nonexistant blog returns 204", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const validNonexistingId = await helper.nonExistingId();

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toEqual(blogsAtStart);
  });
  test("fails with status code 401 if user is not provided", async () => {
    const blogsAtStart = await Blog.find({}).populate("user");
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

    const blogsAtEnd = await Blog.find({}).populate("user");
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
    expect(blogsAtStart).toEqual(blogsAtEnd);
  });
});

// describe("updating a blog", () => {
//   test("updating a valid blog", async () => {
//     const blogsAtStart = await helper.blogsInDb();
//     const blogToUpdate = blogsAtStart[0];
//     const newBlog = { ...blogToUpdate, likes: 9999999 };

//     await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(200);
//     const blogsAtEnd = await helper.blogsInDb();
//     expect(blogsAtEnd[0]).toEqual(newBlog);
//   });

//   test("updating a nonexistant blog with valid parameters returns 404", async () => {
//     const blogsAtStart = await helper.blogsInDb();
//     const validNonexistingId = await helper.nonExistingId();
//     const newBlog = { ...blogsAtStart[0], likes: 9999999 };

//     await api.put(`/api/blogs/${validNonexistingId}`).send(newBlog).expect(404);
//     const blogsAtEnd = await helper.blogsInDb();
//     expect(blogsAtEnd).toEqual(blogsAtStart);
//   });

//   test("updating a valid blog with invalid parameters returns 400", async () => {
//     const blogsAtStart = await helper.blogsInDb();
//     const blogToUpdate = blogsAtStart[0];
//     const newBlog = {
//       ...blogToUpdate,
//       likes: "this is suppose to be a number",
//     };
//     await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(400);
//     const blogsAtEnd = await helper.blogsInDb();
//     expect(blogsAtEnd).toEqual(blogsAtStart);
//   });
// });

afterAll(async () => {
  await mongoose.connection.close();
});
