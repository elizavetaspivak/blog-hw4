import {postsCollections} from "../db/mongo";
import {ObjectId} from "mongodb";
import {PostParams} from "../routes/post-route";

type PostData = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    createdAt: string
    blogName: string
}


type UpdatePostData = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export class PostsRepository {
    static async getAllPosts(sortData: PostParams) {
        const sortBy = sortData.sortBy ?? 'createdAt'
        const sortDirection = sortData.sortDirection ?? 'desc'
        const pageNumber = sortData.pageNumber ?? 1
        const pageSize = sortData.pageSize ?? 10

        const posts = await postsCollections
            .find({})
            .sort(sortBy, sortDirection)
            .skip((+pageNumber - 1) * +pageSize)
            .limit(+pageSize)
            .toArray();

        const totalCount = await postsCollections.countDocuments()

        const pagesCount = Math.ceil(totalCount / +pageSize);

        return {
            pagesCount: +pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: +totalCount,
            items: posts.map((p: any) => ({
                id: p._id,
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogName: p.blogName,
                createdAt: p.createdAt,
                blogId: p.blogId,
            }))
        }
    }

    static async getPostById(id: string) {
        const post = await postsCollections.findOne({_id: new ObjectId(id)});

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogName: post.blogName,
            createdAt: post.createdAt,
            blogId: post.blogId,
        }
    }

    static async createPost(postData: PostData) {
        const res = await postsCollections.insertOne(postData)

        return res.insertedId
    }

    static async updatePost(id: string, postData: UpdatePostData) {
        const res = await postsCollections.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    title: postData.title,
                    shortDescription: postData.shortDescription,
                    content: postData.content,
                    blogId: postData.blogId
                }
            }, {upsert: true}
        )

        return !!res.matchedCount;
    }

    static async deletePostById(id: string) {
        const res = await postsCollections.deleteOne({_id: new ObjectId(id)})

        return !!res.deletedCount
    }
}