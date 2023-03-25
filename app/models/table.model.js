module.exports = mongoose => {
    const Table = mongoose.model(
        "tables",
        mongoose.Schema(
            {
                number: { type: Number, default: 0 },
                type: Number,
                status: { type: Number, default: 0 },
                seatChair: { type: Number, default: 0 },
                idCustomer: { type: String, default: "" },
                topPositon: { type: Number, default: 0 },
                leftPositon: { type: Number, default: 0 }
            },
            { timestamps: true }
        )
    );

    return Table;
};