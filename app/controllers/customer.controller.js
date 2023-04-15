const db = require("../models");
const Table = db.tables;
const Customer = db.customers;

// Create and Save a new Customer
exports.create = (req, res, socketIo) => {
    // Validate request
    // if (!req.body.name || !req.body.quantityBook || !req.body.phone 
    //     || !req.body.typeService || !req.body.timeOrder || !req.body.keyRestaurant) {
    //     res.status(400).send({ message: "Content can not be empty!" });
    //     return;
    // }

    var typeService = 0
    if (req.body.timeOrder === '06:00PM' || req.body.timeOrder === '06:30PM' || req.body.timeOrder === '07:00PM' || req.body.timeOrder === '07:30PM' || req.body.timeOrder === '08:00PM' || req.body.timeOrder === '08:30PM') {
        typeService = 1
    }

    // Create a Customer
    const customer = new Customer({
        name: req.body.name,
        quantityBook: req.body.quantityBook,
        phone: req.body.phone,
        dateOrder: req.body.dateOrder,
        timeOrder: req.body.timeOrder,
        note: req.body.note,
        keyRestaurant: req.body.keyRestaurant,
        typeService: typeService
    });

    // Save Customer in the database
    customer
        .save(customer)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Customer."
            });
        });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
    Customer.find({})
        .exec()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        });
};

// Find a single Customer with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Customer.findById(id)
        .exec()
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Customer with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Customer with id=" + id });
        });
};

// Update a Customer by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Customer.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .exec()
        .then(data => {
            console.log(res.body)
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Customer with id=${id}. Maybe Customer was not found!`
                });
            } else {
                res.send(data)
            };
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Customer with id=" + id
            });
        });
};

// Delete a Customer with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Customer.findByIdAndRemove(id)
        .exec()
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`
                });
            } else {
                res.send({
                    message: "Customer was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Customer with id=" + id
            });
        });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
    Customer.deleteMany({})
        .exec()
        .then(data => {
            res.send({
                message: `${data.deletedCount} Customers were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Customers."
            });
        });
};

// Find all history Customers
exports.findAllHistory = (req, res) => {
    const phone = req.params.phone;

    Customer.find({ phone: phone })
        .exec()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Customers."
            });
        });
};

// Find all key restaurant Customers
exports.findAllService = async (req, res) => {
    const keyRestaurant = req.query.keyRestaurant;
    const typeService = req.query.typeService;
    const dateOrder = req.query.dateOrder;

    const date = new Date(Number(dateOrder));
    const startTime = date.setUTCHours(0, 0, 0);
    const endTime = date.setUTCHours(23, 59, 59);

    try {
        // clear all tables
        await Table.updateMany({ keyRestaurant: keyRestaurant }, { $set: { idCustomer: "" } }).exec();

        // get all customers
        const getAllCustomer = await Customer.find({
            keyRestaurant: keyRestaurant,
            typeService: typeService,
            dateOrder: {
                $gte: startTime,
                $lte: endTime
            }
        }).exec()

        console.log(getAllCustomer)

        // update tables base customers
        const mapCus = getAllCustomer.filter(cus => cus.idTable !== "" && (cus.status === 1 || cus.status === 2 || cus.status === 3))
        mapCus.forEach(cus => {
            Table.findByIdAndUpdate(cus.idTable, { idCustomer: cus._id }, { useFindAndModify: false }).exec()
            console.log('cus: ', cus)
        })

        return res.send(getAllCustomer);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Customers."
        });
    }
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
    Customer.deleteMany({})
        .exec()
        .then(data => {
            res.send({
                message: `${data.deletedCount} Customers were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all Customers."
            });
        });
};