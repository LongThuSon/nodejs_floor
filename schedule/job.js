const db = require("../app/models");
const Customer = db.customers;

const timeOrderList = [10, 11, 12, 18, 19, 20];

module.exports = (schedule, socket) => {
    timeOrderList.forEach(ele => {
        // Late
        const evenLatejob = schedule.scheduleJob({ hour: ele, minute: 0 }, () => {
            const today = new Date();
            const startToday = today.setUTCHours(0, 0, 0);
            const endToday = today.setUTCHours(23, 59, 59);
    
            Customer.updateMany({
                $or: [{ status: 0 }, { status: 1 }],
                $and: [{
                    dateOrder: {
                        $gte: startToday,
                        $lte: endToday
                    }
                }]
            }, { $set: { status: 2 } })
                .exec()
                .then(_ => {
                    socket.emit("updateLate")
                })
                .catch(error => console.log(error))
        });
    
        const oddLateJob = schedule.scheduleJob({ hour: ele, minute: 30 }, () => {
            const today = new Date();
            const startToday = today.setUTCHours(0, 0, 0);
            const endToday = today.setUTCHours(23, 59, 59);
    
            Customer.updateMany({
                $or: [{ status: 0 }, { status: 1 }],
                $and: [{
                    dateOrder: {
                        $gte: startToday,
                        $lte: endToday
                    }
                }]
            }, { $set: { status: 2 } })
            .exec()
            .then(_ => {
                socket.emit("updateLate")
            })
            .catch(error => console.log(error))
        });
    
        // No show
        const evenNoShowJob = schedule.scheduleJob({ hour: ele, minute: 15 }, () => {
            const today = new Date();
            const startToday = today.setUTCHours(0, 0, 0);
            const endToday = today.setUTCHours(23, 59, 59);
    
            Customer.updateMany({
                $or: [{ status: 0 }, { status: 1 }, { status: 2 }],
                $and: [{
                    isHold: false,
                    dateOrder: {
                        $gte: startToday,
                        $lte: endToday
                    }
                }]
            }, { $set: { status: 5 } })
            .exec()
            .then(_ => {
                socket.emit("updateNoShow")
            })
            .catch(error => console.log(error))
        });
    
        const oddNoShowJob = schedule.scheduleJob({ hour: ele, minute: 45 }, () => {
            const today = new Date();
            const startToday = today.setUTCHours(0, 0, 0);
            const endToday = today.setUTCHours(23, 59, 59);
    
            Customer.updateMany({
                $or: [{ status: 0 }, { status: 1 }, { status: 2 }],
                $and: [{
                    isHold: false,
                    dateOrder: {
                        $gte: startToday,
                        $lte: endToday
                    }
                }]
            }, { $set: { status: 5 } })
            .exec()
            .then(_ => {
                socket.emit("updateNoShow")
            })
            .catch(error => console.log(error))
        });
    });
};