const express = require('express');
// const packageName = require('packageName')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nrfxvyb.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next){
 
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message:'auth header not found'})
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
    if(err){
      res.status(403).send({message: 'jwt verification can not done'})
    }
    req.decoded = decoded;
    next();
  })
}


async function run() {
  try {
    const productCollection = client.db('wamp-db').collection('allProducts')
    const allUsers = client.db('wamp-db').collection('allUsers')
    const allBookings = client.db('wamp-db').collection('allBookings')
    const advertisements = client.db('wamp-db').collection('advertisements')
    const blogs = client.db('wamp-db').collection('blog')

app.get('/isavailable', async(req, res )=> {

})

    app.get('/jwt', async(req, res)=>{
      const email = req.query.email;
      const query = {email: email}
      const user = await allUsers.findOne(query)
      if(user){
        const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '1d'})
        return res.send({accessToken: token})
      }
      
      res.status(403).send({message: "user email not found"})
    })


    app.get('/my-orders',verifyJWT, async (req, res) => {
     
      const email = req.query.email
      const decodedEmail = req.decoded.email
      if (email !== decodedEmail) {
        return res.status(403).send({message: 'decoded email not found'})
        
      }
      const query = {email: email}
      const myorders = await allBookings.find(query).toArray()
      res.send(myorders)
    })


    app.get('/available', async (req, res) => {
     
      const productId = req.query.id
      // const decodedEmail = req.decoded.email
      // if (email !== decodedEmail) {
      //   return res.status(403).send({message: 'decoded email not found'})
        
      // }
      const query = {product_id: productId}
      const bookedProduct = await allBookings.find(query).toArray()
      // console.log(bookedProduct);
      res.send(bookedProduct)
    })

    
  

    app.put('/allproducts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)}
      const update = req.body;
      console.log(update);
      const option = {upsert: true};
      const edited = {
        $set: {
          available: update.available
        }
      }
      const result = await productCollection.updateOne(filter, edited, option);
      res.send(result)
    })

    
    app.get('/allproducts/:id', async (req, res) => {
      const id = req.query.id;
      const query = {_id: ObjectId(id)}
      
      console.log(update);
      
      const result = await productCollection.find(query).toArray();
      res.send(result)
    })


    app.put('/allusers/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)}
      const update = req.body;
      console.log(update);
      const option = {upsert: true};
      const edited = {
        $set: {
          isVerifiedSeller: update.isVerifiedSeller
        }
      }
      const result = await allUsers.updateOne(filter, edited, option);
      // console.log(result);
      res.send(result)
    })


    app.get('/my-products', async (req, res) => {
      let query = {}
      const email = req.query.email
      if (email) {
        query = {

          sellerEmail: email
            
        }
      }
      const myproducts = await productCollection.find(query).toArray()
      res.send(myproducts)
    })


    app.get('/allsellers', async (req, res) => {
      let query = {}
      
     
        query = {

          role: 'seller'
            
        }
      
      const myproducts = await allUsers.find(query).toArray()
      res.send(myproducts)
    })


    app.get('/verifiedseller', async (req, res) => {
      let query = {}
      const email = req.query.email
     
        query = {email: email}
      
      const verifiedSeller = await allUsers.find(query).toArray()
      res.send(verifiedSeller)
    })



    app.get('/allusers', async (req, res) => {
      let query = {}
      
     
        query = {

          role: 'user'
            
        }
      
      const myproducts = await allUsers.find(query).toArray()
      res.send(myproducts)
    })


    app.get('/product', async (req, res) => {
      let query = {}
      const id = req.query.id
     
        query = {

          _id: ObjectId(id)
            
        }
      
      const myproduct = await productCollection.find(query)
      res.send(myproduct)
    })



    app.get('/orders', async (req, res) => {

      let query = {};

      const cursor = allBookings.find(query);
      const orders = await cursor.toArray();

      res.send(orders)
    })



    app.get('/blog', async (req, res) => {

      let query = {};

      const cursor = blogs.find(query);
      const orders = await cursor.toArray();

      res.send(orders)
    })


    app.get('/category', async (req, res) => {
      const query = {}
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products)

    });


    app.post('/insertuser', (req, res) => {
      const insertUser = req.body;
      const result = allUsers.insertOne(insertUser);
      res.send(result)
    })




    app.post('/insertproduct', (req, res) => {
      const insertProduct = req.body;
      const result = productCollection.insertOne(insertProduct);
      res.send(result)
    })

    app.post('/advertise', (req, res) => {
      const insertProduct = req.body;
      const result = advertisements.insertOne(insertProduct);
      res.send(result)
    })

    app.get('/advertise', async (req, res) => {

      let query = {};

      const cursor = advertisements.find(query);
      const products = await cursor.toArray();

      res.send(products)
    })




    app.post('/allbookings', (req, res) => {
      const bookingInfo = req.body;
      const result = allBookings.insertOne(bookingInfo);
      res.send(result)
    })



    app.get('/category/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        category_id: id
      }

      const service = await productCollection.find(query).toArray()

      res.send(service)
    })


    // app.get('/mybookings', async (req, res) => {
    //   const date = req.query.email
    //   console.log(date)
    //   const query = {}
    //   const options = await appointmentOptionsCollection.find(query).toArray()
    //   res.send()
    // })


    app.delete('/sellers/:id', async(req, res)=> {
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const result = await allUsers.deleteOne(query);
      console.log(result);
    res.send(result)
    })



    app.delete('/users/:id', async(req, res)=> {
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const result = await allUsers.deleteOne(query);
      console.log(result);
    res.send(result)
    })

    app.get('/users/seller/:email', async(req, res)=> {
      const email = req.params.email
      const query = {email}
      const user = await allUsers.findOne(query);
      // console.log(user);
    res.send({isSeller: user?.role === 'seller'})
    })




  } finally {

  }
} run().catch(err => console.error(err));


app.get('/', (req, res) => {
  res.send('wamp server is running')
})



app.listen(port, () => {
  console.log(`wamp server is running on${port}`)
})