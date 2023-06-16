import {validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";


export const inputModelMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(error => ({
        message: error.msg,
        field: error.param
    }))

    if (!errors.isEmpty()) {
        const err = errors.array({onlyFirstError: true})

        return res.status(400).json({
            errorsMessages: err
        });
    }

    next()
}
