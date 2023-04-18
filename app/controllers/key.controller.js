const db = require("../models");
const Key = db.keys;

// Retrieve all Keys from the database.
exports.findAll = (req, res) => {
    Key.find({})
        .exec()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving keys."
            });
        });
};

// Find a single Key with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Key.findById(id)
        .exec()
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Key with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Key with id=" + id });
        });
};