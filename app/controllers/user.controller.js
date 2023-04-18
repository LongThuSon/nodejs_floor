var { validationResult } = require('express-validator');
const db = require("../models");
const User = db.users;

// Create and Save a new User
exports.create = (req, res, next) => {
    // Validate request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array())
        res.status(422).json({ errors: errors.array() });
        return;
    }

    // Create a User
    const user = new User({
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password,
        keyRestaurant: req.body.keyRestaurant,
    });

    User.find({ phone: req.body.phone, keyRestaurant: req.body.keyRestaurant })
        .exec()
        .then(data => {
            if (data.length === 0) {
                // Save User in the database
                user
                    .save(user)
                    .then(data => {
                        res.send(data);
                    })
                    .catch(next);
            } else {
                // update user in the database
                data[0].name = req.body.name;
                data[0].password = req.body.password;
                data[0].save()
            }
        })
        .catch(next)
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