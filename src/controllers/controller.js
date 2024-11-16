const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

exports.SignUp = async(req, res) => {

    const { email, password, role } = req.body; 

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                role: role || "User",
            }
        });

        return res.status(201).json({
            message: "User created successfully",
            user: { email: newUser.email } 
        }); 
    }
    catch (error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.SignIn = async(req, res) => {
    const { email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: {email}})

        if (user) {  
            const isPasswordValid = await bcrypt.compare(password, user.password); 
            if (isPasswordValid){
                const token = jwt.sign({ sub: user.id, role: user.role }, process.env.SECRET_KEY, {
                    expiresIn: "7d",
                });

                return res.status(200).json({
                    message: "Authentication successful",
                    user: { email: user.email, role: user.role },
                    token: token,
                }); 
            } else {
                return res.status(401).json({ message: "Invalid password" });
            }
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } 

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.GetAll = async(req, res) => {

    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated!" });
        }

        if (req.user.role !== "Admin") {
            return res.status(401).json({ message: "Not Authorized!" });
        }
        const users = await prisma.user.findMany()
        res.status(200).json(users);

    }catch(error){
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error to get all users" });
    }
}