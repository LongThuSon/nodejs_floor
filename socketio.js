const db = require("./app/models");
const User = db.users;
const Customer = db.customers;
const _ = require("underscore");
const schedule = require('node-schedule');

module.exports = io => {
    // Delete socket to the namespace, befor authentication
    _.each(io.nsps, function (nsp) {
        nsp.on("connect", function (socket) {
            if (!socket.auth) {
                console.log("removing socket from", nsp.name);
                delete nsp.connected[socket.id];
            }
        });
    });

    io.on("connection", (socket) => {
        socket.auth = false;
        socket.on("authenticate", async auth => {
            const { phone, password, keyRestaurant } = auth;
            // Find user
            const user = await User.findOne({ phone: phone, keyRestaurant: keyRestaurant }).exec();
            if (user === null) {
                console.log(`authenticate: user === null: phone: ${phone}`);
                socket.emit("error", { message: "No user found" });
            } else if (user.password !== password) {
                console.log("authenticate: Wrong password");
                socket.emit("error", { message: "Wrong password" });
            } else {
                console.log("authenticate: true");
                socket.auth = true;
                socket.user = user;
            }
        });
        setTimeout(() => {
            // If the authentication failed, disconnect socket
            if (!socket.auth) {
                console.log("Unauthorized: Disconnecting socket ", socket.id);
                return socket.disconnect("unauthorized");
            }
            // If authentication succeeded, restore socket to the namespace
            _.each(io.nsps, function (nsp) {
                if (_.findWhere(nsp.sockets, { id: socket.id })) {
                    nsp.connected[socket.id] = socket;
                }
            });
            return socket.emit("authorized");
        }, 1000);
        console.log("🔥 Socket connected: ", socket.id);
        socket.on("getUser", callback => {
            callback(socket.user)
        });
        socket.on('userInUse', id => {
            var now = 0;
            const deadline = 6000;
            const job = schedule.scheduleJob('*/2 * * * *', () => { // run every 2 minutes
                Customer.findById(id).exec()
                    .then(res => {
                        var currentPercent = res?.percent ?? 0
                        if (now < deadline) {
                            now = now + 1000
                            if (currentPercent < 80) {
                                Customer.findByIdAndUpdate(id, { percent: currentPercent + 20 }, { useFindAndModify: false }).exec()
                                .then(_ => {
                                    const payload = {
                                        id: id,
                                        data: { percent: currentPercent + 20 },
                                    }
                                    socket.emit("updatePercent", payload)
                                })
                                .catch(error => console.log(error))
                            } else if (currentPercent === 80) {
                                Customer.findByIdAndUpdate(id, { statusTable: 3, percent: 100 }, { useFindAndModify: false }).exec()
                                .then(_ => {
                                    const payload = {
                                        id: id,
                                        data: { 
                                            percent: 100,
                                            statusTable: 3,
                                        },
                                    }
                                    socket.emit("updatePercent", payload)
                                    job.cancel()
                                })
                                .catch(error => console.log(error))
                            }
                        } else {
                            job.cancel()
                        }
                    })
            });
        });
        socket.on("handleClash", payload => {
            const keyRestaurant = payload.keyRestaurant;
            const typeService = payload.typeService;
            const dateOrder = payload.dateOrder;
            const idTable = payload.idTable;

            const date = new Date(Number(dateOrder));
            const startTime = date.setUTCHours(0, 0, 0, 0);
            const endTime = date.setUTCHours(23, 59, 59, 999);

            Customer
                .updateMany({
                    keyRestaurant: keyRestaurant,
                    typeService: typeService,
                    dateOrder: {
                        $gte: startTime,
                        $lte: endTime
                    },
                    idTable: idTable,
                }, { $set: { statusTable: 4, } })
                .exec()
                .then(_ => {
                    socket.emit('updateClash', idTable)
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Update crash customer error"
                    });
                });
        });
        socket.on("disconnect", () => {
            console.info('Disconnect received from: ' + socket.id);

            // const uid = this.GetUidFromSocketID(socket.id);

            // if (uid) {
            //     delete this.users[uid];

            //     const users = Object.values(this.users);

            //     this.SendMessage('user_disconnected', users, socket.id);
            // }
        });
    });
};