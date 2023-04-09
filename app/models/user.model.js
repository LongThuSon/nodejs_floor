module.exports = mongoose => {
    const User = mongoose.model(
        "users",
        mongoose.Schema(
            {
                name: String,
                phone: String,
                password: String,
                keyRestaurant: String,
            },
            { timestamps: true }
        )
    );

    return User;
};