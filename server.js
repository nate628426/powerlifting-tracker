// ToDO: description of code, perhaps include once modifier to close connection to MongoDB Atlas more often
const express = require('express');
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin1:C8j2ESqnoEXVKlWL@cs348-test1.oaamzwv.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());

const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
}
});

app.use(express.json());

app.post('/api/exercise', async (req, res) => {
    console.log("Received POST request");
    const data = req.body;
    console.log(data);

    try {
        await client.connect();
        client.on('error', (error) => {console.error("Error connecting to MongoDB Atlas\n", error)});
        client.on('open', () => {console.log("Connected to MongoDB Atlas")});
        const collection = client.db("exercise_data").collection("recorded_exercises");
        if (data._id) {
            // If _id is present in data, edit the document with that _id
            await collection.updateOne({ _id: data._id }, { $set: data }, { upsert: true });
        } else {
            // If _id is not present, we insert a new document
            await collection.insertOne(data);
        }
        res.status(200).json({ status: "success, exercise processed successfully" });
        console.log("Exercise processed successfully by MongoDB Atlas");
        // res.status(200).send("Exercise processed successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to process exercise");
    } finally {
        //not closing properly
        await client.close();
        console.log("Connection to MongoDB Atlas closed?");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

