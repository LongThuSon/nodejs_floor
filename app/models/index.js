const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const tables = require("./table.model.js");
const customers = require("./customer.model.js");
const users = require("./user.model.js");
const keys = require("./key.model.js");

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tables = tables(mongoose);
db.customers = customers(mongoose);
db.users = users(mongoose);
db.keys = keys(mongoose);

module.exports = db;