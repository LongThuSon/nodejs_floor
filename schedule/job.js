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
            var eventimeOrder
            switch (ele) {
                case 10:
                    eventimeOrder = '10:00AM'
                    break
                case 11:
                    eventimeOrder = '11:00AM'
                    break
                case 12:
                    eventimeOrder = '12:00AM'
                    break
                case 18:
                    eventimeOrder = '06:00PM'
                    break
                case 19:
                    eventimeOrder = '07:00PM'
                    break
                case 20:
                    eventimeOrder = '08:00PM'
                    break
                default:
                    eventimeOrder = '10:00AM'
                    break
            };

            Customer.updateMany({
                $or: [{ status: 0 }, { status: 1 }],
                $and: [{
                    timeOrder: eventimeOrder,
                    dateOrder: {
                        $gte: startToday,
                        $lte: endToday
                    }
                }]
            }, { $set: { status: 2 } })
                .exec()
                .then(_ => {
                    socket.emit("updateLate", eventimeOrder)
                })
                .catch(error => console.log(error))
        });

        const oddLateJob = schedule.scheduleJob({ hour: ele, minute: 30 }, () => {
            const today = new Date();
            const startToday = today.setUTCHours(0, 0, 0);
            const endToday = today.setUTCHours(23, 59, 59);
            var oddtimeOrder
            switch (ele) {
                case 10:
                    eventimeOrder = '10:30AM'
                    break
                case 11:
                    eventimeOrder = '11:30AM'
                    break
                case 12:
                    eventimeOrder = '12:30AM'
                    break
                case 18:
                    eventimeOrder = '06:30PM'
                    break
                case 19:
                    eventimeOrder = '07:30PM'
                    break
                case 20:
                    eventimeOrder = '08:30PM'
                    break
                default:
                    eventimeOrder = '10:30AM'
                    break
            };

            Customer.updateMany({
                $or: [{ status: 0 }, { status: 1 }],
                $and: [{
                    timeOrder: oddtimeOrder,
                    dateOrder: {
                        $gte: startToday,
                        $lte: endToday
                    }
                }]
            }, { $set: { status: 2 } })
                .exec()
                .then(_ => {
                    socket.emit("updateLate", oddtimeOrder)
                })
                .catch(error => console.log(error))
        });

        // No show
        const evenNoShowJob = schedule.scheduleJob({ hour: ele, minute: 15 }, () => {
            const today = new Date();
            const startToday = today.setUTCHours(0, 0, 0);
            const endToday = today.setUTCHours(23, 59, 59);
            var eventimeOrder
            switch (ele) {
                case 10:
                    eventimeOrder = '10:00AM'
                    break
                case 11:
                    eventimeOrder = '11:00AM'
                    break
                case 12:
                    eventimeOrder = '12:00AM'
                    break
                case 18:
                    eventimeOrder = '06:00PM'
                    break
                case 19:
                    eventimeOrder = '07:00PM'
                    break
                case 20:
                    eventimeOrder = '08:00PM'
                    break
                default:
                    eventimeOrder = '10:00AM'
                    break
            };

            Customer.updateMany({
                $or: [{ status: 0 }, { status: 1 }, { status: 2 }],
                $and: [{
                    isHold: false,
                    timeOrder: eventimeOrder,
                    dateOrder: {
                        $gte: startToday,
                        $lte: endToday
                    }
                }]
            }, { $set: { status: 5, } })
                .exec()
                .then(_ => {
                    socket.emit("updateNoShow", eventimeOrder)
                })
                .catch(error => console.log(error))
        });

        const oddNoShowJob = schedule.scheduleJob({ hour: ele, minute: 45 }, () => {
            const today = new Date();
            const startToday = today.setUTCHours(0, 0, 0);
            const endToday = today.setUTCHours(23, 59, 59);
            var oddtimeOrder
            switch (ele) {
                case 10:
                    eventimeOrder = '10:30AM'
                    break
                case 11:
                    eventimeOrder = '11:30AM'
                    break
                case 12:
                    eventimeOrder = '12:30AM'
                    break
                case 18:
                    eventimeOrder = '06:30PM'
                    break
                case 19:
                    eventimeOrder = '07:30PM'
                    break
                case 20:
                    eventimeOrder = '08:30PM'
                    break
                default:
                    eventimeOrder = '10:30AM'
                    break
            };

            Customer.updateMany({
                $or: [{ status: 0 }, { status: 1 }, { status: 2 }],
                $and: [{
                    isHold: false,
                    timeOrder: oddtimeOrder,
                    dateOrder: {
                        $gte: startToday,
                        $lte: endToday
                    }
                }]
            }, { $set: { status: 5, } })
                .exec()
                .then(_ => {
                    socket.emit("updateNoShow", oddtimeOrder)
                })
                .catch(error => console.log(error))
        });
    });
};