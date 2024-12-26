const jwt = require("jsonwebtoken");
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const session = require('express-session');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { generateCSRFToken } = require('../helpers/csrfHandler');
const window = new JSDOM('').window;
const purify = DOMPurify(window);

exports.SignUp = async(req, res) => {

    try{
        const email = purify.sanitize(req.body.email);
        const password = purify.sanitize(req.body.password);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                role: 'User',
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
    const email = purify.sanitize(req.body.email);
    const password = purify.sanitize(req.body.password);


    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: {email}})

        if (user) {  
            const isPasswordValid = await bcrypt.compare(password, user.password); 
            if (isPasswordValid){

                const token = jwt.sign(
                    { sub: user.id, role: user.role }, process.env.JWT_SECRET, {
                        expiresIn: "7d", }
                    );

                req.session.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    };

                    generateCSRFToken(req, res);

                return res.status(200).json({
                    message: "Authentication successful",
                    token: token,
                    user: req.session.user
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

exports.LogOut = async(req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
                return res.status(500).json({ message: 'Error al cerrar sesión' });
        } else {
            res.clearCookie('connect.sid'); 
            res.status(200).json({ message: 'Sesión cerrada correctamente' });
        }
    });
}

exports.Authenticaded = async(req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.status(200).json({
        message: "Welcome to your profile!",
        user: req.session.user,
    })
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