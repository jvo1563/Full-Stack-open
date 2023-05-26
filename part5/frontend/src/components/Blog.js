import { useState } from "react";

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogDetails = () => (
    <div>
      <div>{blog.url}</div>
      <div>
        Likes: {blog.likes}{" "}
        <button onClick={console.log("add a like")}>Like</button>
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
