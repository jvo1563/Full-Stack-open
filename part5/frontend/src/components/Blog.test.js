import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  let container;
  const blog = {
    title: "how to code",
    author: "Bob",
    url: "www.youtube.com",
    likes: 0,
    user: { name: "Poster", username: "admin" },
  };

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={{ username: "admin" }} />
    ).container;
  });

  test("renders blog's title and author", () => {
    const title = screen.getByText("how to code", { exact: false });
    const author = screen.getByText("bob", { exact: false });
    const url = screen.queryByText("www.youtube.com");

    expect(title).toBeDefined();
    expect(author).toBeDefined();
    expect(url).toBeNull();
  });

  test("renders blog's url and likes when button is clicked", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("View");
    await user.click(button);

    const url = screen.getByText("www.youtube.com", { exact: false });
    const likes = screen.getByText("Likes:", { exact: false });

    expect(url).toBeDefined();
    expect(likes).toBeDefined();
  });
});
