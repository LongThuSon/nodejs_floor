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

    var totalChair
    switch (req.body.type) {
        case '1v1':
            totalChair = 2
            break;
        case '2v2c':
            totalChair = 4
            break;
        case '2v2r':
            totalChair = 4
            break;
        case '3v3':
            totalChair = 6
            break;
        case '6v6':
            totalChair = 12
            break;
        case '7v7':
            totalChair = 14
            break;
        case 'c6':
            totalChair = 6
            break;
        case 'c8':
            totalChair = 8
            break;
        case 'c14':
            totalChair = 14
            break;
        default:
            totalChair = 2
    }

    const table = new Table({
        number: req.body.number,
        type: req.body.type,
        topPositon: req.body.topPositon,
        leftPositon: req.body.leftPositon,
        keyRestaurant: req.body.keyRestaurant,
        totalChair: totalChair
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
        .exec()
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
        .exec()
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
        .exec()
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
        .exec()
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
        .exec()
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
        .exec()
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
exports.findAllKey = async (req, res) => {
    const keyRestaurant = req.query.keyRestaurant;

    Table.find({ keyRestaurant: keyRestaurant })
        .exec()
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