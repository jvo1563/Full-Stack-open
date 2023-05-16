const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
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
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "new title",
      author: "new author",
      url: "new url",
      likes: 50,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain("new title");
  });

  test("adding blog without likes property", async () => {
    const newBlog = {
      title: "new title",
      author: "new author",
      url: "new url",
      // likes: 50,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    expect(response.body.likes).toBe(0);
  });

  test("adding blog without title property", async () => {
    const newBlog = {
      // title: "new title",
      author: "new author",
      url: "new url",
      likes: 50,
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("adding blog without url property", async () => {
    const newBlog = {
      title: "new title",
      author: "new author",
      // url: "new url",
      likes: 50,
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("adding blog without author property", async () => {
    const newBlog = {
      title: "new title",
      // author: "new author",
      url: "new url",
      likes: 50,
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deleting a blog", () => {
  test("deleting a valid blog with code 204", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    const ids = blogsAtEnd.map((blog) => blog.id);
    expect(ids).not.toContain(blogToDelete.id);
    expect(ids).toContain(blogsAtStart[1].id);
  });

  test("deleting a nonexistant blog returns 204", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const validNonexistingId = await helper.nonExistingId();

    await api.delete(`/api/blogs/${validNonexistingId}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toEqual(blogsAtStart);
  });
});

describe("updating a blog", () => {
  test("updating a valid blog", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const newBlog = { ...blogToUpdate, likes: 9999999 };

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(200);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0]).toEqual(newBlog);
  });

  test("updating a nonexistant blog with valid parameters returns 404", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const validNonexistingId = await helper.nonExistingId();
    const newBlog = { ...blogsAtStart[0], likes: 9999999 };

    await api.put(`/api/blogs/${validNonexistingId}`).send(newBlog).expect(404);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toEqual(blogsAtStart);
  });

  test("updating a valid blog with invalid parameters returns 400", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const newBlog = {
      ...blogToUpdate,
      likes: "this is suppose to be a number",
    };
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toEqual(blogsAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
