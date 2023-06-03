describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    cy.visit("");
  });

  it("Login form is shown", function () {
    cy.contains("Blogs");
    cy.contains("Log into the application");
    cy.contains("Username");
    cy.contains("Password");
  });
});
