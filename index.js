const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.aunb3y8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const toDoCollection = client.db("toDoDB").collection("toDo");

    app.post("/to-do", async (req, res) => {
      const toDoInfo = req.body;
      const result = await toDoCollection.insertOne(toDoInfo);
      res.send(result);
    });

    app.get("/to-do-list/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await toDoCollection.find(query).toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ToDo - ToDo is running!");
});

app.listen(port, () => {
  console.log(`ToDo  listening on port ${port}`);
});
