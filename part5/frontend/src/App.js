import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Login from "./components/Login";
import Blogform from "./components/Blogform";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ author: "", title: "", url: "" });
  const [noticationMessage, setNotifcationMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
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

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotifcationMessage("Error: " + exception.response.data.error);
    }
  };

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const blog = await blogService.create(newBlog);
      setBlogs(blogs.concat(blog));
      setNewBlog({ author: "", title: "", url: "" });
      setNotifcationMessage(
        `Success: ${blog.title} by ${blog.author} was added`
      );
    } catch (exception) {
      setNotifcationMessage("Error: " + exception.response.data.error);
    }
  };

  const handleNewBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const blogList = () => (
    <div>
      <h2>Blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
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
      <Notification message={noticationMessage} />
      {!user && (
        <Login
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      )}
      {user && logoutButton()}
      {user && (
        <Blogform
          addBlog={addBlog}
          newBlog={newBlog}
          handleNewBlogChange={handleNewBlogChange}
        />
      )}
      {user && blogList()}
    </div>
  );
};

export default App;
