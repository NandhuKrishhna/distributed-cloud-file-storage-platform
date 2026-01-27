import UserModel from "../models/user.model.js";

export const seedUser = async () => {
    try {
        console.log("[ Checking for initial user... ]")
        const existingUser = await UserModel.findOne({ email: process.env.INITIAL_USER_EMAIL });
        if (existingUser) {
            console.log("[ Initial user already exists. Skipping... ]");
            return;
        }

        const newUser = new UserModel({
            name: "Nandhu Krishna",
            email: process.env.INITIAL_USER_EMAIL,
            password: process.env.INITIAL_USER_PASSWORD
        });

        await newUser.save();
        console.log("[ Initial user created successfully ]");
    } catch (error) {
        console.log("[ Error seeding user ]");
        console.log(error);
    }
};
