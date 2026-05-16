const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URL || 'mongodb://admin:secretpassword@localhost:27017';
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db('urbancanvas');
    const collections = ['users', 'artists', 'artworks', 'reviews', 'events', 'routes', 'reports'];
    for (const col of collections) {
      await db.collection(col).deleteMany({});
    }
    console.log('Collections initialized.');
  } catch(e) {} finally { await client.close(); } }
main();