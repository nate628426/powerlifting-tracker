const express = require('express');
const mongoose = require('mongoose')
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://admin1:C8j2ESqnoEXVKlWL@cs348-test1.oaamzwv.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());

//Mongoose schema for adding data, ODM technology.
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 

const strictExerciseSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    machine: { type: String, required: true },
    exercise: { type: String, required: true },
    sets: { type: Number, required: true },
    duration: { type: Number, required: true },
    comments: { type: String, required: true }
}, { strict: true });


const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
});

app.use(express.json());

//Add or Edit data in database.
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
            // If _id is not present, insert a new document
            await collection.insertOne(data);
        }
        res.status(200).json({ status: "success, exercise processed successfully" });
        console.log("Exercise processed successfully by MongoDB Atlas");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to process exercise");
    } finally {
        await client.close();
        console.log("Connection to MongoDB Atlas closed?");
    }
});

//Mongoose ODM, add data through model and new object newExercise
const StrictExercise = mongoose.model('StrictExercise', strictExerciseSchema, 'recorded_exercises');

app.post('/api/strict-add', async (req, res) => {
    console.log("Received strict add request");
    const data = req.body;
    console.log(data);
    //create new object
    const newExercise = new StrictExercise(data);

    try {
        await client.connect();
        client.on('error', (error) => {console.error("Error connecting to MongoDB Atlas\n", error)});
        client.on('open', () => {console.log("Connected to MongoDB Atlas")});
        const collection = client.db("exercise_data").collection("recorded_exercises");
        await collection.insertOne(newExercise);
        res.status(200).json({ status: "success, exercise added successfully" });
        console.log("Exercise added successfully by MongoDB Atlas");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add exercise");
    } finally {
        await client.close();
        console.log("Connection to MongoDB Atlas closed?");
    }
});
//Search database for given input filters
app.post('/api/search', async (req, res) => {
    console.log("Received search request");
    const data = req.body;
    console.log(data);

    try {
        await client.connect();
        client.on('error', (error) => {console.error("Error connecting to MongoDB Atlas\n", error)});
        client.on('open', () => {console.log("Connected to MongoDB Atlas")});
        const collection = client.db("exercise_data").collection("recorded_exercises");
        //Collect results from collection.find()
        const searchResult = await collection.find(data).toArray();
        res.status(200).json(searchResult);
        console.log("Search completed successfully by MongoDB Atlas");
        console.log(searchResult)
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to complete search");
    } finally {
        await client.close();
        console.log("Connection to MongoDB Atlas closed?");
    }
});
//Delete specific object from MongoDB database.
app.post('/api/delete', async (req, res) => {
    console.log("Received delete request");
    const data = req.body;
    console.log(data);

    try {
        await client.connect();
        client.on('error', (error) => {console.error("Error connecting to MongoDB Atlas\n", error)});
        client.on('open', () => {console.log("Connected to MongoDB Atlas")});
        const collection = client.db("exercise_data").collection("recorded_exercises");
        await collection.deleteOne({ _id: data._id });
        res.status(200).json({ status: "success, exercise deleted successfully" });
        console.log("Exercise deleted successfully by MongoDB Atlas");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete exercise");
    } finally {
        await client.close();
        console.log("Connection to MongoDB Atlas closed?");
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

