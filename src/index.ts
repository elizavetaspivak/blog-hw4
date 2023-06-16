import express from "express";
import {deleteAllDataRoute} from "./routes/delete-all-data-route";
import {blogRoute} from "./routes/blog-route";
import {postRoute} from "./routes/post-route";
import {client} from "./db/mongo";

const app = express()
const port = 3000

app.use(express.json())

app.use('/testing/all-data', deleteAllDataRoute)
app.use('/blogs', blogRoute)
app.use('/posts', postRoute)

app.listen(port, async () => {
    try {
        await client.connect();
        console.log(`Client connected to DB`)
        console.log(`Example app listening on port ${port}`)
    } catch (err) {
        console.log(`${err}`)
        await client.close()
    }
})