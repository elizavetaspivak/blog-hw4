import {blogsCollections, postsCollections} from "../db/mongo";
import {ObjectId} from "mongodb";
import {BlogParams} from "../routes/blog-route";
import {PostParams} from "../routes/post-route";

type CreatePostData = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

type UpdatePostData = {
    name: string
    description: string
    websiteUrl: string
}

type CreatePostToBlogData = {
    title: string,
    shortDescription: string,
    content: string
}


export class BlogsRepository {
    static async getAllBlogs(sortData: BlogParams) {
        const searchNameTerm = sortData.searchNameTerm ?? null
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const blogs = await blogsCollections
            .find(searchNameTerm ? {
                name: {
                    $regex: searchNameTerm,
                    $options: "i"
                }
            } : {})
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray();

        const totalCount = await blogsCollections.countDocuments(
            searchNameTerm ? {
                name: {
                    $regex: searchNameTerm,
                    $options: "i"
                }
            } : {})

        const pagesCount = Math.ceil(totalCount / +pageSize);

        return {
            pagesCount: pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: blogs.map((b: any) => ({
                id: b._id,
                name: b.name,
                description: b.description,
                websiteUrl: b.websiteUrl,
                createdAt: b.createdAt,
                isMembership: b.isMembership
            }))
        }
    }

    static async getBlogById(id: string) {
        const blog = await blogsCollections.findOne({_id: new ObjectId(id)});

        return blog
    }

    static async getPostsByBlogId(id: string, sortData: PostParams) {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const posts = await postsCollections
            .find({blogId: id})
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray();

        const totalCount = await postsCollections.countDocuments(
            {blogId: id})

        const pagesCount = Math.ceil(totalCount / +pageSize);

        return {
            pagesCount: +pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: posts.map((p: any) => ({
                id: p._id.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogName: p.blogName,
                createdAt: p.createdAt,
                blogId: p.blogId,
            }))
        }
    }

    static async createBlog(createdData: CreatePostData) {
        const res = await blogsCollections.insertOne(createdData)

        return res.insertedId
    }

    static async createPostToBlog(createdData: CreatePostToBlogData, blogId: string) {
        const blog = await this.getBlogById(blogId);

        const post = {
            title: createdData.title,
            shortDescription: createdData.shortDescription,
            content: createdData.content,
            blogId,
            createdAt: new Date().toISOString(),
            blogName: blog.name
        }

        const res = await postsCollections.insertOne(post)

        return res.insertedId
    }

    static async updateBlog(id: string, updatedData: UpdatePostData) {
        const res = await blogsCollections.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    "name": updatedData.name,
                    "description": updatedData.description,
                    "websiteUrl": updatedData.websiteUrl
                }
            }, {upsert: true}
        )

        return !!res.matchedCount;
    }

    static async deleteBlogById(id: string) {
        const res = await blogsCollections.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount
    }
}