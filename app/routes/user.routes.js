module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const validator = require('../../validator.js');

    var router = require("express").Router();

    // Create a new table
    router.post("/", validator.validate.validateRegisterUser(), users.create);

    // Retrieve all type users
    router.get("/", users.findAll);

    // Retrieve a single table with id
    router.get("/:id", users.findOne);

    app.use('/api/users', router);
};