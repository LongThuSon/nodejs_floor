module.exports = mongoose => {
    const Customer = mongoose.model(
        "customers",
        mongoose.Schema(
            {
                name: String,
                quantityBook: Number,
                idTable: { type: String, default: "" },
                phone: Number,
                status: { type: Number, default: 0 },
                dateOrder: Date,
                typeService: Number,
                timeOrder: Number,
                isHold: { type: Boolean, default: false },
                note: { type: String, default: "" }
            },
            { timestamps: true }
        )
    );

    return Customer;
};