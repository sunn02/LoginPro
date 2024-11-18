const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteUser() {
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: 3, // ID del usuario que deseas eliminar
      },
    });
    console.log('Usuario eliminado:', deletedUser);
  } catch (error) {
    console.error('Error eliminando el usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();
