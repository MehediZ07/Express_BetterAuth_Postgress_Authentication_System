import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserService } from "./user.service";

const getUserProfile = catchAsync(
    async (req: Request, res: Response) => {
        const { userId } = req.params;

        const result = await UserService.getUserProfile(userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User profile retrieved successfully",
            data: result,
        })
    }
)

export const UserController = {
    getUserProfile,
};
