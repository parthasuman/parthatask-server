const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzjgfye.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const addTaskCollection = client.db("parthaTask").collection("addTasks");
    const allTaskCollection = client.db("parthaTask").collection("allTasks");

    app.get("/addTasks", async (req, res) => {
      const query = {};
      const cursor = addTaskCollection.find(query);
      const addTasks = await cursor.toArray();
      res.send(addTasks);
    });

    app.post("/addTasks", async (req, res) => {
      const addTask = req.body;
      const result = await addTaskCollection.insertOne(addTask);
      res.send(result);
    });

    app.get("/allTasks", async (req, res) => {
      const query = {};
      const cursor = allTaskCollection.find(query);
      const allTasks = await cursor.toArray();
      res.send(allTasks);
    });

    app.post("/allTasks", async (req, res) => {
      const allTask = req.body;
      const result = await allTaskCollection.insertOne(allTask);
      res.send(result);
    });

    app.patch("/allTasks/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: status,
        },
      };
      const result = await allTaskCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.delete("/allTasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allTaskCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/ads/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      // console.log("trying to delete", id);
      const result = await allTaskCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/ads/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          advertised: true,
        },
      };
      const result = await allTaskCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // app.get("/allTasks", async (req, res) => {
    //   const allTasks = await allTaskCollection
    //     .find({ advertised: true })
    //     .toArray();
    //   res.send(allTasks);
    // });

    app.get("/ads", async (req, res) => {
      const ads = await allTaskCollection.find({ advertised: true }).toArray();
      res.send(ads);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("partha task server is running");
});

app.listen(port, () => console.log(`Partha task running on ${port}`));
