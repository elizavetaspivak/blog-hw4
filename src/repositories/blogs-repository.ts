import {blogsCollections} from "../db/mongo";
import {ObjectId} from "mongodb";

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
    static async getAllBlogs() {
        const blogs = await blogsCollections.find({}).toArray();

        return blogs.map((b: any) => ({
            id: b._id,
            name: b.name,
            description: b.description,
            websiteUrl: b.websiteUrl,
            createdAt: b.createdAt
        }))
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