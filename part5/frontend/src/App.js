import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [noticationMessage, setNotifcationMessage] = useState(null);
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      // Check to see if token is expired
      if (loginService.verifyUser(user)) {
        setUser(user);
        blogService.setToken(user.token);
      } else {
        window.localStorage.removeItem("user");
        window.location.reload(true);
      }
    }
  }, []);

  // Clear notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifcationMessage(null);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [noticationMessage]);

  const handleLogin = async (loginObject) => {
    try {
      const user = await loginService.login(loginObject);
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
    } catch (exception) {
      setNotifcationMessage("Error: " + exception.response.data.error);
    }
  };

  const addBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject);
      setBlogs(blogs.concat(blog));
      setNotifcationMessage(
        `Success: ${blog.title} by ${blog.author} was added`
      );
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      setNotifcationMessage("Error: " + exception.response.data.error);
    }
  };

  const updateBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.put(blogObject);
      const newBlogs = blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      );
      setBlogs(newBlogs);
    } catch (exception) {
      setNotifcationMessage("Error: " + exception.response.data.error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const blogToDelete = blogs.find((blog) => blog.id === id);
      await blogService.remove(id);
      const newBlogs = blogs.filter((blog) => blog.id !== id);
      setBlogs(newBlogs);
      setNotifcationMessage(
        `Success: Removed blog ${blogToDelete.title} by ${blogToDelete.author}`
      );
    } catch (exception) {
      setNotifcationMessage("Error: " + exception.response.data.error);
    }
  };

  const blogList = () => (
    <div>
      <h2>Blog List</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          user={user}
        />
      ))}
    </div>
  );

  const logoutButton = () => (
    <div>
      {user.name} is logged in{" "}
      <button
        onClick={() => {
          window.localStorage.removeItem("user");
          setUser(null);
          window.location.reload(true);
        }}
      >
        Logout
      </button>
    </div>
  );

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={noticationMessage} />
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && logoutButton()}
      {user && (
        <Togglable buttonLabel="Add Blog" ref={blogFormRef}>
          <BlogForm addBlog={addBlog} />
        </Togglable>
      )}
      {user && blogList()}
    </div>
  );
};

export default App;
