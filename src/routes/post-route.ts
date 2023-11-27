import {Router} from "express";
import {PostsRepository} from "../repositories/posts-repository";
import {BlogsRepository} from "../repositories/blogs-repository";
import {
    blogIdValidation,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from "../validators/post-validators";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {inputModelMiddleware} from "../middlewares/inputModelMiddleware/input-model-middleware";
import {RequestTypeWithParams, RequestTypeWithQuery} from "../types/common";

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export type PostParams = {
    sortBy?: string
    sortDirection?: string
    pageNumber?: number
    pageSize?: number
}


export const postRoute = Router({})

postRoute.get('/', async (req: RequestTypeWithQuery<PostParams>, res) => {
    const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
    }

    const posts = await PostsRepository.getAllPosts(sortData)

    res.send(posts)
})

postRoute.get('/:id', async (req, res) => {
    const id = req.params.id

    const foundedPost = await PostsRepository.getPostById(id)

    if (!foundedPost) {
        res.sendStatus(404)
        return
    }

    const postForClient = {
        id: foundedPost._id,
        title: foundedPost.title,
        shortDescription: foundedPost.shortDescription,
        content: foundedPost.content,
        blogId: foundedPost.blogId,
        blogName: foundedPost.blogName,
        createdAt: foundedPost.createdAt
    }

    res.send(postForClient)
})

postRoute.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputModelMiddleware, async (req, res) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const createdAt = new Date().toISOString()

    const blog = await BlogsRepository.getBlogById(blogId)

    const createdPostId = await PostsRepository.createPost({
        title,
        shortDescription,
        content,
        blogId,
        createdAt,
        blogName: blog.name
    })

    const createdPostMapper = {
        id: createdPostId,
        title, shortDescription, content, blogId, blogName: blog.name, createdAt
    }


    res.status(201).json(createdPostMapper)
})

postRoute.put('/:id', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputModelMiddleware, async (req, res) => {
    const id = req.params.id

    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId

    const post = await PostsRepository.getPostById(id)

    if (!post) {
        res.sendStatus(404)
        return;
    }

    const isUpdatePost = await PostsRepository.updatePost(id, {title, shortDescription, content, blogId})

    if (!isUpdatePost) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})

postRoute.delete('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id

    const post = await PostsRepository.getPostById(id)

    if (!post) {
        res.sendStatus(404)
        return;
    }

    await PostsRepository.deletePostById(id)

    res.sendStatus(204)
})