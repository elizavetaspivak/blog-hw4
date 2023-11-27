import {client} from "./db/mongo";
import dotenv from 'dotenv'
import {app} from "./settings";

dotenv.config()

const port = process.env.PORT || 80

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