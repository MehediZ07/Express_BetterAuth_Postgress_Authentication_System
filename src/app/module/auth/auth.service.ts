import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { tokenUtils } from "../../utils/token";

interface IRegisterUserPayload {
    name: string;
    email: string;
    password: string;
}

const registerUser = async (payload: IRegisterUserPayload) => {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        }
    })

    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Failed to register user");
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    return {
        ...data,
        accessToken,
        refreshToken,
    }
}

interface ILoginUserPayload {
    email: string;
    password: string;
}

const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password,
        }
    })

    if (data.user.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "User is blocked");
    }

    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "User is deleted");
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified,
    });

    return {
        ...data,
        accessToken,
        refreshToken,
    };
}

const logoutUser = async (sessionToken: string) => {
    if (!sessionToken) {
        throw new AppError(status.BAD_REQUEST, "Session token is required");
    }

    // Delete session from database
    await prisma.session.deleteMany({
        where: {
            token: sessionToken,
        }
    });

    return { message: "Logged out successfully" };
}

const refreshAccessToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new AppError(status.UNAUTHORIZED, "Refresh token is required");
    }

    // Verify refresh token
    const verifiedToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);

    if (!verifiedToken.success) {
        throw new AppError(status.UNAUTHORIZED, "Invalid or expired refresh token");
    }

    const userId = verifiedToken.data?.userId;

    // Get user from database
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    if (user.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "User is blocked");
    }

    if (user.isDeleted || user.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "User is deleted");
    }

    // Generate new access token
    const newAccessToken = tokenUtils.getAccessToken({
        userId: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: user.emailVerified,
    });

    return {
        accessToken: newAccessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    };
}

export const AuthService = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
};
