module.exports = app => {
    const tables = require("../controllers/table.controller.js");

    var router = require("express").Router();

    // Create a new table
    router.post("/", tables.create);

    // Retrieve all tables
    router.get("/", tables.findAll);

    // Retrieve all published tables
    router.get("/type", tables.findAllType);

    // Retrieve a single table with id
    router.get("/:id", tables.findOne);

    // Update a table with id
    router.put("/:id", tables.update);

    // Delete a table with id
    router.delete("/:id", tables.delete);

    // Delete all tables
    router.delete("/", tables.deleteAll);

    app.use('/api/tables', router);
};