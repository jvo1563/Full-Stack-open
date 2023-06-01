import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    title: "how to code",
    author: "Bob",
    url: "www.youtube.com",
    likes: 0,
    user: { name: "Poster", username: "admin" },
  };

  test("renders blog's title and author", () => {
    render(<Blog blog={blog} user={{ username: "admin" }} />);
    const title = screen.getByText("how to code", { exact: false });
    const author = screen.getByText("bob", { exact: false });
    const url = screen.queryByText("www.youtube.com");

    expect(title).toBeDefined();
    expect(author).toBeDefined();
    expect(url).toBeNull();
  });

  test("renders blog's url and likes when button is clicked", async () => {
    render(<Blog blog={blog} user={{ username: "admin" }} />);
    const user = userEvent.setup();
    const button = screen.getByText("View");
    await user.click(button);

    const url = screen.getByText("www.youtube.com", { exact: false });
    const likes = screen.getByText("Likes:", { exact: false });

    expect(url).toBeDefined();
    expect(likes).toBeDefined();
  });

  test("clicking like button twice", async () => {
    const likeHandler = jest.fn();
    render(
      <Blog blog={blog} user={{ username: "admin" }} updateBlog={likeHandler} />
    );

    const user = userEvent.setup();

    const viewButton = screen.getByText("View");
    await user.click(viewButton);

    const likeButton = screen.getByText("Like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(likeHandler.mock.calls).toHaveLength(2);
  });
});
