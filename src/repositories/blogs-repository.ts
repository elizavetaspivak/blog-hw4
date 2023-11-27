import {blogsCollections} from "../db/mongo";
import {ObjectId} from "mongodb";
import {BlogParams} from "../routes/blog-route";

type CreatePostData = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
}

type UpdatePostData = {
    name: string
    description: string
    websiteUrl: string
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
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const totalCount = await blogsCollections.countDocuments()

        const pagesCount = blogs.length / pageSize;

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageNumber,
            totalCount: totalCount,
            items: blogs.map((b: any) => ({
                id: b._id,
                name: b.name,
                description: b.description,
                websiteUrl: b.websiteUrl,
                createdAt: b.createdAt
            }))
        }
    }

    static async getBlogById(id: string) {
        const blog = await blogsCollections.findOne({_id: new ObjectId(id)});

        return blog
    }

    static async createBlog(createdData: CreatePostData) {
        const res = await blogsCollections.insertOne(createdData)

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