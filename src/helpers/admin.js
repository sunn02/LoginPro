const bcrypt = require('bcrypt');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const email = 'admin@example.com'; 
        const password = 'admin123'; 

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.user.create({
            data: {
                email: purify.sanitize(email), 
                password: hashedPassword,
                role: 'Admin', 
            }
        });

        console.log('Admin creado exitosamente:', newAdmin);
    } catch (error) {
        console.error('Error al crear el Admin:', error);
    } finally {
        await prisma.$disconnect(); 
    }
}

createAdmin();

