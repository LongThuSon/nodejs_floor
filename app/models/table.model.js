module.exports = mongoose => {
    const Table = mongoose.model(
        "tables",
        mongoose.Schema(
            {
                number: Number,
                type: String,
                totalChair: Number,
                idCustomer: String,
                isBlock: Boolean,
                topPositon: { type: Number, default: 0 },
                leftPositon: { type: Number, default: 0 },
                keyRestaurant: String,
            },
            { timestamps: true }
        )
    );

    return Table;
};