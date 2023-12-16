/// <reference types="Cypress" />
describe("", () => {
  it("", () => {
    // Define an empty object to store product data
    const productData = {};

    cy.visit("https://www.saucedemo.com");

    cy.get("#username").type("standard_user");
    cy.get("#password").type("secret_sauce");
    cy.get(".product_sort_container").should("be.visible");

    // Sorting product names in ascending order
    cy.get(".product_sort_container").click();
    cy.get("option[value='az']").click();

    cy.get(".inventory_item_name")
      .invoke("text")
      .then((productNames) => {
        const actualProductNames = productNames
          .split("\n")
          .map((name) => name.trim());
        const sortedProductNames = [...actualProductNames].sort((a, b) =>
          a.localeCompare(b)
        );
        expect(actualProductNames).to.deep.equal(sortedProductNames);
      });

    // Sorting product prices in descending order
    cy.get(".product_sort_container").click();
    cy.get("option[value='hilo']").click();

    cy.get(".inventory_item_price")
      .invoke("text")
      .then((productPrices) => {
        const actualProductPrices = productPrices
          .split("\n")
          .map((price) => parseFloat(price.trim()));
        const sortedProductPrices = [...actualProductPrices].sort(
          (a, b) => b - a
        );
        expect(actualProductPrices).to.deep.equal(sortedProductPrices);
      });

    // Iterating through each product and storing data in the productData object
    cy.get(".inventory_list")
      .find(".inventory_item_name")
      .each((product) => {
        const productName = product.find(".inventory_item_name").text().trim();
        const productPrice = parseFloat(
          product.find(".inventory_item_price").text().trim()
        );

        // Add the product data to the object
        productData[productName] = productPrice;
      })
      .then(() => {
        // Write the product data to a JSON file
        cy.writeFile("productData.json", productData);
      });

    cy.get(".btn btn_primary btn_small btn_inventory ").each(($button) => {
      // Perform actions on each button
      cy.wrap($button).click();

      cy.get("shopping_cart_badge").should("be.visible").contains(6);

      // Read the product data from the JSON file
      cy.readFile("productData.json").then((productData) => {
        // Validate item names, prices, and descriptions in the cart
        Object.keys(productData).forEach((productName) => {
          const productPrice = productData[productName];

          // Validate item name
          cy.get(".inventory_item_name").should("contain", productName);

          // Validate item price
          cy.get(".inventory_item_price").contains(productPrice);

          // You might need to adjust the selectors for descriptions based on your HTML structure
          // Validate item description
          cy.get(".inventory-item-description").should(
            "contain",
            `Description for ${productName}`
          );
        });
      });

      cy.get("#checkout").click();
      cy.get("#first-name").type("pranay");
      cy.get("#last-name").type("g");
      cy.get("#postal-code").type("394933");
      cy.get("#continue").click();
      cy.readFile("productData.json").then((productData) => {
        // Calculate the total price with fixed tax
        const taxRate = 10.4; // 10%
        let totalPrice = 129.49;

        // Iterate through each product in the cart
        Object.keys(productData).forEach((productName) => {
          const productPrice = productData[productName];

          // Validate item name, price, and description (if needed)
          cy.get(".inventory-item-name").should("contain", productName);
          cy.get(".inventory-item-price").contains(productPrice);
          // Add additional validations for description if needed

          // Add the product price to the total
          totalPrice += productPrice;
        });

        // Calculate the total price with tax
        const totalPriceWithTax = totalPrice * (1 + taxRate);

        // Validate the total price in the cart
        cy.get(".cart-total-price").contains(totalPriceWithTax.toFixed(2));
      });
      cy.get("#finish").click();
      cy.get(".complete-header").should(
        "have.text",
        "Thank you for your order!"
      );

      cy.get("#react-burger-menu-btn").click();
      cy.get(".logout_sidebar_link").click();
    });
  });
});
