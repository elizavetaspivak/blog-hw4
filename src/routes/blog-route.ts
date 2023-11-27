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


export type PaginatorType<I> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: I[]
}

export const blogRoute = Router({})

export type BlogParams = {
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: string
    pageNumber?: number
    pageSize?: number
}

blogRoute.get('/', async (req: RequestTypeWithParams<BlogParams>, res: ResponseType<PaginatorType<BlogType>>) => {
    const sortData = {
        searchNameTerm: req.params.searchNameTerm,
        sortBy: req.params.sortBy,
        sortDirection: req.params.sortDirection,
        pageNumber: req.params.pageNumber,
        pageSize: req.params.pageSize,
    }

    const bloggers = await BlogsRepository.getAllBlogs(sortData)
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
    const isMembership = false

    const createdBlogId = await BlogsRepository.createBlog({name, description, websiteUrl, createdAt, isMembership})

    const createdBlogMapper = {
        id: createdBlogId,
        name, description, websiteUrl, createdAt, isMembership
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