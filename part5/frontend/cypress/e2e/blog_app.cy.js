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
  });
});
