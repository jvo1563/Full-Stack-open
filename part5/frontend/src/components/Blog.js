import { useState } from "react";

const Blog = ({ blog, updateBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleLike = (event) => {
    event.preventDefault();
    const newBlog = { ...blog, likes: blog.likes + 1 };
    console.log(newBlog);
    updateBlog(newBlog);
  };

  const blogDetails = () => (
    <div>
      <div>{blog.url}</div>
      <div>
        Likes: {blog.likes} <button onClick={handleLike}>Like</button>
      </div>
      <div>Posted by: {blog.user.name}</div>
    </div>
  );

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide" : "View"}
        </button>
      </div>
      {showDetails && blogDetails()}
    </div>
  );
};

export default Blog;

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: "solid",
  borderWidth: 1,
  marginBottom: 5,
};
