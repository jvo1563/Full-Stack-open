describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    cy.visit("");
  });

  it("Login form is shown", function () {
    cy.contains("Blogs");
    cy.contains("Log into the application");
  });

  describe("Login", function () {
    beforeEach(function () {
      const user = {
        name: "admin",
        username: "root",
        password: "password",
      };
      cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    });
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("password");
      cy.get("#login-button").click();
      cy.contains("admin is logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.get("#error-message")
        .should("contain", "Error: invalid username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");

      cy.get("html").should("not.contain", "admin logged in");
    });

    describe("When logged in", function () {
      beforeEach(function () {
        cy.login({ username: "root", password: "password" });
      });

      it("A blog can be created", function () {
        cy.contains("Add Blog").click();
        cy.get("#title-input").type("How to code 101");
        cy.get("#author-input").type("Bob Smith");
        cy.get("#url-input").type("www.youtube.com");
        cy.get("#add-blog-button").click();
        cy.get("#success-message")
          .should("contain", "Success: How to code 101 by Bob Smith was added")
          .and("have.css", "color", "rgb(0, 128, 0)");
        cy.contains("How to code 101 Bob Smith");
      });
    });
  });
});
