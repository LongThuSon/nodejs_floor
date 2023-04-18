module.exports = mongoose => {
    const Key = mongoose.model(
        "keys",
        mongoose.Schema(
            {},
            { timestamps: true }
        )
    );

    return Key;
};