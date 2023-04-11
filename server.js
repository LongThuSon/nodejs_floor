const express = require("express");
const cors = require("cors");

const app = express();

const server = require('http').Server(app);

const tableRoute = require("./app/routes/table.routes.js");
const customerRoute = require("./app/routes/customer.routes.js");
const userRoute = require("./app/routes/user.routes.js");

const socketio = require("./socketio.js");

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Tasty Go application." });
});

tableRoute(app);
customerRoute(app);
userRoute(app);

const db = require("./app/models");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});

socketio(io);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});