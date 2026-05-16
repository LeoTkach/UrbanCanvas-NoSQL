const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URL || 'mongodb://admin:secretpassword@localhost:27017';
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db('urbancanvas');
    const artworks = db.collection('artworks');
    const routes = db.collection('routes');
    const events = db.collection('events');
    const reviews = db.collection('reviews');

    console.log("Query 1: Single condition filter");
    const paidEvents = await events.find({ price: { $gt: 0 } }).toArray();
    
    console.log("Query 2: Multi-condition filter");
    const selectedArtworks = await artworks.find({ style: { $in: ["Surrealism", "Stencil"] } }).toArray();
  } catch(e) {} finally { await client.close(); } }
main();