import {Router} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {
    descriptionValidation,
    nameValidation,
    websiteUrlValidation
} from "../validators/blog-validators";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {inputModelMiddleware} from "../middlewares/inputModelMiddleware/input-model-middleware";
import {
    RequestType,
    RequestTypeWithBody,
    RequestTypeWithBodyAndParams,
    RequestTypeWithParams,
    ResponseType
} from "../types/common";

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

export const blogRoute = Router({})

blogRoute.get('/', async (req: RequestType, res: ResponseType<BlogType[]>) => {
    const bloggers = await BlogsRepository.getAllBlogs()
    res.status(200).json(bloggers)
})

blogRoute.get('/:id', async (req: RequestTypeWithParams<{ id: string }>, res: ResponseType<BlogType>) => {
    const id = req.params.id

    const blog = await BlogsRepository.getBlogById(id)

    if (!blog) {
        return res.sendStatus(404)
    }

    const blogForClient = {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt
    }

    res.send(blogForClient)
})

blogRoute.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputModelMiddleware, async (req: RequestTypeWithBody<{
    name: string,
    description: string,
    websiteUrl: string
}>, res: ResponseType<BlogType>) => {
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl
    const createdAt = new Date().toISOString()

    const createdBlogId = await BlogsRepository.createBlog({name, description, websiteUrl, createdAt})

    const createdBlogMapper = {
        id: createdBlogId,
        name, description, websiteUrl, createdAt
    }

    res.status(201).json(createdBlogMapper)
})

blogRoute.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputModelMiddleware, async (req: RequestTypeWithBodyAndParams<{
    id: string
}, {
    name: string,
    description: string,
    websiteUrl: string
}>, res: ResponseType<{}>) => {
    const id = req.params.id

    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    const blog = await BlogsRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(404)
        return;
    }

    const isBlogUpdated = await BlogsRepository.updateBlog(id, {name, description, websiteUrl})

    if (!isBlogUpdated) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})

blogRoute.delete('/:id', authMiddleware, async (req: RequestTypeWithParams<{ id: string }>, res: ResponseType<{}>) => {
    const id = req.params.id

    const blog = await BlogsRepository.getBlogById(id)

    if (!blog) {
        res.sendStatus(404)
        return;
    }

    await BlogsRepository.deleteBlogById(id)

    res.sendStatus(204)
})