import { prisma } from "../../lib/prisma";

// Add your user-related business logic here
// Example: getUserProfile, updateUserProfile, etc.

const getUserProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            emailVerified: true,
            image: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return user;
}

export const UserService = {
    getUserProfile,
};
