module.exports = mongoose => {
    const Customer = mongoose.model(
        "customers",
        mongoose.Schema(
            {
                name: String,
                quantityBook: Number,
                idTable: { type: String, default: "" },
                phone: String,
                status: { type: Number, default: 0 },
                dateOrder: { type: Number, default: Date.now() },
                typeService: Number,
                timeOrder: String,
                isHold: { type: Boolean, default: false },
                note: { type: String, default: "" },
                keyRestaurant: String,
                state: { type: Number, default: 0 },
                statusTable: { type: Number, default: -1 },
                percent: { type: Number, default: 0 },
            },
            { timestamps: true }
        )
    );

    return Customer;
};