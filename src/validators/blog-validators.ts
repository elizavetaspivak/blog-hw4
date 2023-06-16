import {body} from "express-validator";
export const nameValidation = body('name').trim().isLength({min: 1, max: 15}).withMessage('Incorrect name')
export const descriptionValidation = body('description').isLength({min: 1, max: 500}).withMessage('Incorrect description')
export const websiteUrlValidation = body('websiteUrl').isLength({
    min: 1,
    max: 100
}).matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')