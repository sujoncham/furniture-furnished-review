const express = require('express');
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// furniture
// klfqUuWuLgP0xSwM
// https://furniture-furnished-review.web.app/
// https://github.com/sujoncham/furniture-furnished-review-server
// https://github.com/sujoncham/furniture-furnished-review-client



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xmgn4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const furnitureCollection = client.db('furnitureData').collection('furniture');
        const profileCollection = client.db('furnitureData').collection('profile');
        const orderCollection = client.db('furnitureData').collection('order');

        app.get('/furniture', async(req, res)=>{
            const result = await furnitureCollection.find().toArray();
            res.send(result);
        });

        app.get('/furniture/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await furnitureCollection.findOne(query);
            res.send(result);
        });

        //update stock info
        app.put('/profile/:id', async (req, res)=>{
            const id = req.params.id;
            const profileUpdate = req.body;
            const filterStock = {_id:ObjectId(id)};
            const optStock = {upsert:true};
            const stockDoc = {
                $set: {
                    userName:profileUpdate.userName,
                    fullName:profileUpdate.fullName,
                    email:profileUpdate.email,
                    description:profileUpdate.description,
                    skills:profileUpdate.skills,
                }
            };
            const result = await profileCollection.updateOne(filterStock, stockDoc, optStock);
            res.send(result);
        });

        app.post('/furniture', async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        

    }
    finally{

    }

}

run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send("Client side is connected");
});





app.listen(port, ()=>{
    console.log('My server is ', port);
})
