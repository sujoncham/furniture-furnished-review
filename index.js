const express = require('express');
const port = process.env.PORT || 5000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const orderCollection = client.db('furnitureData').collection('order');
        const userCollection = client.db('furnitureData').collection('users');
        const blogCollection = client.db('furnitureData').collection('blogs');
        const reviewsCollection = client.db('furnitureData').collection('reviews');


        app.get('/user', async(req, res)=>{
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        app.get('/user/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.get('/user/:email', async(req, res)=>{
            const email = req.params.email;
            const query = {email:email};
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.put('/user/:id', async(req, res)=>{
            const id = req.params.id;
            const updateUser = req.body;
            const filter = {_id:ObjectId(id)};
            const options = {upsert:true};
            const updatedDoc = {
                $set:{
                    name:updateUser.name,
                    email:updateUser.email,
                    fullName: updateUser.fullName,
                    description:updateUser.description,
                    skills:updateUser.skills,
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.put('/user/:email', async (req, res)=>{
            const email = req.params.email;
            const authorization = req.headers;
            console.log('first', authorization);
            const user = req.body;
            const filter = {email: email};
            const options = {upsert: true};
            const updateDoc = {
                    $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({email:email}, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
            res.send({result, token});
        })

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

        app.post('/furniture', async(req, res)=>{
            const furniture = req.body;
            const result = await furnitureCollection.insertOne(furniture);
            res.send(result);
        })

        app.get('/reviews', async(req, res)=>{
            const result = await reviewsCollection.find().toArray()
            res.send(result);
        })


        app.get('/order', async(req, res)=>{
            const result = await orderCollection.find().toArray();
            res.send(result);
        });
        
        app.post('/order', async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        app.delete('/order/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });

        app.get('/blog', async(req, res)=>{
            const result = await blogCollection.find().toArray();
            res.send(result);
        });

        app.post('/blog', async(req, res)=>{
            const blog = req.body;
            const result = await blogCollection.insertOne(blog);
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
