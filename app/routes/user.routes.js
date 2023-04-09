module.exports = app => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    // Create a new table
    router.post("/", users.create);

    // Retrieve all type users
    router.get("/", users.findAll);

    // // Retrieve all key restaurant users
    // router.get("/key", users.findAllKey);

    // Retrieve a single table with id
    router.get("/:id", users.findOne);

    // // Update a table with id
    // router.put("/:id", users.update);

    // // Delete a table with id
    // router.delete("/:id", users.delete);

    // // Delete all users
    // router.delete("/", users.deleteAll);

    // // Retrieve all users
    // router.get("/", users.findAll);

    app.use('/api/users', router);
};