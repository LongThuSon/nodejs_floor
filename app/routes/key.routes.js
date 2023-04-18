module.exports = app => {
    const keys = require("../controllers/key.controller.js");

    var router = require("express").Router();

    // Retrieve all type keys
    router.get("/", keys.findAll);

    // Retrieve a single key with id
    router.get("/:id", keys.findOne);

    app.use('/api/keys', router);
};