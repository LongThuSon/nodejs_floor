const db = require("./app/models");
const User = db.users;
const _ = require("underscore");

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
            const user = await User.findOne({ phone: phone }).exec();
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