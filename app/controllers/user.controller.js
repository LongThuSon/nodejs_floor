const db = require("../models");
const User = db.users;

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    // if (!req.body.name || !req.body.phone || !req.body.password || !req.body.keyRestaurant) {
    //     res.status(400).send({ message: "Content user can not be empty!" });
    //     return;
    // }

    // Create a User
    const user = new User({
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password,
        keyRestaurant: req.body.keyRestaurant,
    });

    // Save User in the database
    user
        .save(user)
        .exec()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    User.find({})
        .exec()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .exec()
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found User with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving User with id=" + id });
        });
};