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
    console.log("Query 3: Update with condition");
    await artworks.updateOne({ title: "Київський каштан" }, { $set: { status: "Restored", year: 2024 } });
    
    console.log("Query 4: Update without condition (update all)");
    await artworks.updateMany({}, { $set: { lastCheckedAt: new Date() } });
    console.log("Query 5: Delete with condition");
    await reviews.deleteMany({ rating: { $lt: 2 } });
    console.log("Query 6: Complex Aggregation (Lookup & Project)");
    const routeDetails = await routes.aggregate([
      { $lookup: { from: "artworks", localField: "artworks", foreignField: "_id", as: "artwork_details" } },
      { $project: { name: 1, difficulty: 1, "artwork_details.title": 1, "artwork_details.style": 1 } }
    ]).toArray();

    console.log("Query 7: Complex Aggregation (Lookup, Unwind, Group, AddToSet)");
    const artistStats = await artworks.aggregate([
      { $lookup: { from: "artists", localField: "artistId", foreignField: "_id", as: "artist" } },
      { $unwind: "$artist" },
      { $group: { _id: "$artist.name", totalArtworks: { $sum: 1 }, styles: { $addToSet: "$style" } } }
    ]).toArray();
  } catch(e) {} finally { await client.close(); } }
main();