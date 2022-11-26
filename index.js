const express = require('express');
// const packageName = require('packageName')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nrfxvyb.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
  try {
    const productCollection = client.db('wamp-db').collection('allProducts')
    const allUsers = client.db('wamp-db').collection('allUsers')
    const allBookings = client.db('wamp-db').collection('allBookings')
    const advertisements = client.db('wamp-db').collection('advertisements')
    const blogs = client.db('wamp-db').collection('blog')

app.get('/isavailable', async(req, res )=> {

})



    app.get('/my-orders', async (req, res) => {
      let query = {}
      const email = req.query.email
      if (email) {
        query = {
          email: email
        }
      }
      const myorders = await allBookings.find(query).toArray()
      res.send(myorders)
    })

    
    // app.get('/allproducts/:id', async (req, res) => {
    //   let query = {}
    //   const _id = req.query._id
      
    //     query = {
    //       _id: ObjectId(_id)
    //     }
    
    //   const orderedProduct = await productCollection.find(query).toArray()
    //   res.send(orderedProduct)
    // })

    app.put('/allproducts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)}
      const update = req.body;
      const option = {upsert: true};
      const edited = {
        $set: {
          available: update.available
        }
      }
      const result = await productCollection.updateOne(filter, edited, option);
      res.send(result)
    })


    app.put('/allusers/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: ObjectId(id)}
      const update = req.body;
      const option = {upsert: true};
      const edited = {
        $set: {
          isVerifiedSeller: update.isverified
        }
      }
      const result = await allUsers.updateOne(filter, edited, option);
      console.log(result);
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
    app.get('/allusers', async (req, res) => {
      let query = {}
      
     
        query = {

          role: 'user'
            
        }
      
      const myproducts = await allUsers.find(query).toArray()
      res.send(myproducts)
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
      console.log(id);
      const query = {
        category_id: id
      }

      const service = await productCollection.find(query).toArray()

      res.send(service)
    })


    app.get('/mybookings', async (req, res) => {
      const date = req.query.email
      console.log(date)
      const query = {}
      const options = await appointmentOptionsCollection.find(query).toArray()
      res.send()
    })

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




  } finally {

  }
} run().catch(err => console.error(err));


app.get('/', (req, res) => {
  res.send('wamp server is running')
})



app.listen(port, () => {
  console.log(`wamp server is running on${port}`)
})