const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {MongoClient, ServerApiVersion, ObjectId, Timestamp} = require('mongodb');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@ecommercedatabase.la5qrjd.mongodb.net/?retryWrites=true&w=majority&appName=ecommerceDatabase`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const roomCollection = client.db('stayVista').collection('rooms');
    const userCollection = client.db('stayVista').collection('users');
    const bookingCollection = client.db('stayVista').collection('bookings');

    // Middlewares
    // Verify Token Middleware
    const verifyToken = async (req, res, next) => {
      const token = req.cookies?.token;
      if (!token) {
        return res.status(401).send({message: 'unauthorized access'});
      }

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          console.log(err);
          return res.status(401).send({message: 'unauthorized access'});
        }
        req.user = decoded;
        next();
      });
    };

    // Verify Admin
    const verifyAdmin = async (req, res, next) => {
      const userInfo = req?.user;
      const query = {email: userInfo.email};
      const user = await userCollection.findOne(query);

      if (!user) return res.status(401).send({message: 'unauthorized access'});
      if (user.role === 'Admin') {
        return next();
      }
      res.status(403).json({message: 'forbidden access'});
    };

    // Verify host
    const verifyHost = async (req, res, next) => {
      const userInfo = req.user;
      const query = {email: userInfo.email};
      const user = await userCollection.findOne(query);
      if (!user) return res.status(401).send({message: 'unauthorized access'});
      if (user.role === 'Host') return next();
      res.status(403).json({message: 'forbidden access'});
    };

    // auth related api
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      try {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '365d',
        });
        res
          .cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({success: true});
      } catch (error) {
        res.status(500).send({
          success: false,
          message: 'Token generation failed',
        });
      }
    });

    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({success: true});
        console.log('Logout successful');
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // Create payment intent
    app.post('/create-payment-intent', verifyToken, async (req, res) => {
      const {price} = req.body;
      if (price < 0) return;
      const totalPrice = parseFloat(price) * 100;
      const {client_secret} = await stripe.paymentIntents.create({
        amount: totalPrice,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.send({clientSecret: client_secret});
    });

    // Get Guest bookings
    app.get('/booking-guest/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = {'guest.email': email};
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    // Get Host bookings
    app.get('/booking-host/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = {'host.email': email};
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    // Booking related api, Payment History
    app.post('/booking', async (req, res) => {
      const paymentInfo = req.body;
      const result = await bookingCollection.insertOne(paymentInfo);
      res.send(result);
    });

    // Cancel a booking - delete a booking
    app.delete('/cancel-booking/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    // Update status: true after booked room
    app.patch('/update-status/:id', async (req, res) => {
      const id = req.params.id;
      const {status} = req.body;
      const query = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set: {
          booked: status,
        },
      };
      const result = await roomCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    // Admin statistics
    app.get('/admin-stat', async (req, res) => {
      const totalUsers = await userCollection.estimatedDocumentCount();
      const totalRooms = await roomCollection.estimatedDocumentCount();
      const totalBookings = await bookingCollection.estimatedDocumentCount();

      const options = {projection: {price: 1}};
      const totalSales = await bookingCollection.find({}, options).toArray();
      const totalPrice = totalSales.reduce(
        (prev, sales) => prev + sales.price,
        0
      );

      res.send({totalUsers, totalBookings, totalRooms, totalPrice});
    });

    // User related api's
    app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get('/user/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({email});
      res.send(result);
    });

    // save user
    app.put('/user', async (req, res) => {
      const user = req.body;
      const query = {email: user.email};
      // Check is exist user
      const isExistUser = await userCollection.findOne(query);
      if (isExistUser) {
        if (user.status === 'Requested') {
          // Update Status
          const updatedStatus = {$set: {status: user?.status}};
          const result = await userCollection.updateOne(query, updatedStatus);
          return res.send(result);
        } else {
          return res.send(isExistUser);
        }
      }

      const options = {upsert: true};
      const updatedDoc = {
        $set: {
          ...user,
          Timestamp: Date.now(),
        },
      };
      const result = await userCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    });

    app.patch('/user/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const status = req.body;
      const query = {email: email};
      console.log('status ->>', status);
      const updatedDoc = {
        $set: {
          status: status.status,
        },
      };
      const result = await userCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    // update user role
    app.patch(
      '/update-role/:email',
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const email = req.params.email;
        const updateRole = req.body;
        const query = {email: email};
        const updatedDoc = {
          $set: {
            role: updateRole.role,
            status: updateRole.status,
          },
        };
        const result = await userCollection.updateMany(query, updatedDoc);
        res.send(result);
      }
    );

    // Rooms related api's
    app.get('/rooms', async (req, res) => {
      const category = req.query.category;
      let query = {};
      if (category !== 'null') {
        query = {category: category};
      }
      const result = await roomCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/room/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({error: 'Invalid ObjectId format'});
      }
      const query = {_id: new ObjectId(id)};
      const result = await roomCollection.findOne(query);
      res.send(result);
    });

    app.get('/my-listings/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = {'host.email': email};
      const result = await roomCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/rooms', verifyToken, async (req, res) => {
      const roomData = req.body;
      const result = await roomCollection.insertOne(roomData);
      res.send(result);
    });

    app.delete('/room/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await roomCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ping: 1});
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from StayVista Server..');
});

app.listen(port, () => {
  console.log(`StayVista is running on port ${port}`);
});
