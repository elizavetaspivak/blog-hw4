import {blogsCollections} from "../db/mongo";
import {ObjectId} from "mongodb";
import {BlogsRepository} from "../repositories/blogs-repository";

export class BlogsService {

    // static async createBlog(createdData: CreatePostData) {
    //     const res = await blogsCollections.insertOne(createdData)
    //
    //     return res.insertedId
    // }
    //
    // static async updateBlog(id: string, updatedData: UpdatePostData) {
    //     const res = await blogsCollections.updateOne({_id: new ObjectId(id)}, {
    //             $set: {
    //                 "name": updatedData.name,
    //                 "description": updatedData.description,
    //                 "websiteUrl": updatedData.websiteUrl
    //             }
    //         }, {upsert: true}
    //     )
    //
    //     return !!res.matchedCount;
    // }
    //
    // static async deleteBlogById(id: string) {
    //     const res = await blogsCollections.deleteOne({_id: new ObjectId(id)})
    //
    //     return !!res.deletedCount
    // }
}