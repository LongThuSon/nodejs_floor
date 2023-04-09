const User = require("./models/user");
const _ = require("underscore");

exports.startListener = io => {
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
        socket.on("authenticate", async (auth) => {
            const { username, password } = auth;
            // Find user
            const user = await User.findOne({ username }).exec();
            if (user === null) {
                socket.emit("error", { message: "No user found" });
            } else if (user.password !== password) {
                socket.emit("error", { message: "Wrong password" });
            } else {
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
        socket.on("getUser", () => {
            socket.emit("user", {
                id: socket.user._id,
                username: socket.user.username,
                profileImage: socket.user.profileImage,
            });
        });
        socket.on('handshake', (callback) => {
            console.info('Handshake received from: ' + socket.id);

            const reconnected = Object.values(this.users).includes(socket.id);

            if (reconnected) {
                console.info('This user has reconnected.');

                const uid = this.GetUidFromSocketID(socket.id);
                const users = Object.values(this.users);

                if (uid) {
                    console.info('Sending callback for reconnect ...');
                    callback(uid, users);
                    return;
                }
            }

            const uid = v4();
            this.users[uid] = socket.id;

            const users = Object.values(this.users);
            console.info('Sending callback ...');
            callback(uid, users);

            this.SendMessage(
                'user_connected',
                users.filter((id) => id !== socket.id),
                users
            );
        });
        socket.on("disconnect", () => {
            console.info('Disconnect received from: ' + socket.id);

            const uid = this.GetUidFromSocketID(socket.id);

            if (uid) {
                delete this.users[uid];

                const users = Object.values(this.users);

                this.SendMessage('user_disconnected', users, socket.id);
            }
        });
    });
};