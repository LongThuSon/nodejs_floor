module.exports = app => {
    const customers = require("../controllers/customer.controller.js");

    var router = require("express").Router();

    // Create a new customer
    router.post("/", customers.create);

    // Retrieve all history customers
    router.get("/history", customers.findAllHistory);

    // Retrieve all service customers
    router.get("/service", customers.findAllService);

    // Retrieve a single customer with id
    router.get("/:id", customers.findOne);

    // Update a customer with id
    router.put("/:id", customers.update);

    // Retrieve all customers
    router.get("/", customers.findAll);

    app.use('/api/customers', router);
};