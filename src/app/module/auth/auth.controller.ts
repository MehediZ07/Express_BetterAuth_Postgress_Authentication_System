import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { AuthService } from "./auth.service";

const registerUser = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;

        const result = await AuthService.registerUser(payload);

        const { accessToken, refreshToken, token, ...rest } = result

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "User registered successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,
            }
        })
    }
)

const loginUser = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await AuthService.loginUser(payload);
        const { accessToken, refreshToken, token, ...rest } = result

        tokenUtils.setAccessTokenCookie(res, accessToken);
        tokenUtils.setRefreshTokenCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,

            },
        })
    }
)

const logoutUser = catchAsync(
    async (req: Request, res: Response) => {
        const sessionToken = req.cookies['better-auth.session_token'];
        
        await AuthService.logoutUser(sessionToken);

        tokenUtils.clearAccessTokenCookie(res);
        tokenUtils.clearRefreshTokenCookie(res);
        tokenUtils.clearBetterAuthSessionCookie(res);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged out successfully",
            data: null,
        });
    }
);

const refreshToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        
        const result = await AuthService.refreshAccessToken(refreshToken);

        tokenUtils.setAccessTokenCookie(res, result.accessToken);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Access token refreshed successfully",
            data: result,
        });
    }
);

export const AuthController = {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
};
