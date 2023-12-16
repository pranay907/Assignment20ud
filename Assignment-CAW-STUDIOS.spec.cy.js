/// <reference types="Cypress" />
import { contains } from "cypress/types/jquery";
import UserData from "..//fixtures/UserData.json";
describe("Assigment on Automation for CAW Studios", () => {
  it("Test-1", () => {
    // Visit the page or navigate to the form where you want to insert data
    cy.visit("https://testpages.herokuapp.com/styled/tag/dynamic-table.html");

    cy.get("summary").click();
    // Convert the JSON array to a string
    const jsonString = JSON.stringify(UserData);
    // Type the JSON data string into the input field
    cy.get("#jsondata")
      .clear()

      .type(jsonString, { parseSpecialCharSequences: false });
    cy.get("#refreshtable").click();
    cy.get("table>tr").each(($row, index, $rows) => {
      cy.wrap($row);
      cy.log($row.text()).expect(contains.text(), jsonString, {
        parseSpecialCharSequences: false,
      });
    });
  });
});
