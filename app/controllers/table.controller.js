const db = require("../models");
const Table = db.tables;

// Create and Save a new Table
exports.create = (req, res) => {
    // Validate request
    // if (!req.body.type || !req.body.number) {
    //     res.status(400).send({ message: "Content table can not be empty!" });
    //     return;
    // }

    // Create a Table
    const table = new Table({
        number: req.body.number,
        type: req.body.type,
        topPositon: req.body.topPositon,
        leftPositon: req.body.leftPositon,
        keyRestaurant: req.body.keyRestaurant
    });

    // Save Table in the database
    table
        .save(table)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Table."
            });
        });
};

// Retrieve all Tables from the database.
exports.findAll = (req, res) => {
    Table.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tables."
            });
        });
};

// Find a single Table with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Table.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Table with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Table with id=" + id });
        });
};

// Update a Table by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Table.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Table with id=${id}. Maybe Table was not found!`
                });
            } else res.send({ message: "Table was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Table with id=" + id
            });
        });
};

// Delete a Table with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Table.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Table with id=${id}. Maybe Table was not found!`
                });
            } else {
                res.send({
                    message: "Table was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Table with id=" + id
            });
        });
};

// Delete all Tables from the database.
exports.deleteAll = (req, res) => {
    Table.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tables were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Tables."
            });
        });
};

// Find all type Tables
exports.findAllType = (req, res) => {
    const type = req.query.type;

    Table.find({ type: type })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Tables."
            });
        });
};

// Find all key restaurant Tables
exports.findAllKey = (req, res) => {
    const keyRestaurant = req.query.keyRestaurant;

    Table.find({ keyRestaurant: keyRestaurant })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Tables."
            });
        });
};