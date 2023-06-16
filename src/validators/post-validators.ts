import {body} from "express-validator";
import {BlogsRepository} from "../repositories/blogs-repository";

export const titleValidation = body('title').trim().isLength({min: 1, max: 30}).withMessage('Incorrect title')

export const shortDescriptionValidation = body('shortDescription').isLength({
    min: 1,
    max: 100
}).withMessage('Incorrect shortDescription')

export const contentValidation = body('content').trim().isLength({
    min: 1,
    max: 1000
}).withMessage('Incorrect content')

export const blogIdValidation = body('blogId').custom(async (value) => {
    const blog = await BlogsRepository.getBlogById(value)
    if (!blog) {
        throw Error('Incorrect blogId')
    }
    return true
}).withMessage('Incorrect blogId')