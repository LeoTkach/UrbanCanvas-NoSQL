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
    await db.collection('artworks').createIndex({ "location": "2dsphere" });
    await db.collection('routes').createIndex({ "path": "2dsphere" });
    await db.collection('artworks').createIndex({ "style": 1 });
    const resultUsers = await db.collection('users').insertMany([
      { username: "art_lover99", email: "lover@mail.com", role: "tourist", joinedAt: new Date() },
      { username: "kyiv_guide", email: "guide@mail.com", role: "guide", joinedAt: new Date() },
      { username: "admin_moderator", email: "admin@mail.com", role: "admin", joinedAt: new Date() }
    ]);
    const userIds = Object.values(resultUsers.insertedIds);

    const resultArtists = await db.collection('artists').insertMany([
      { name: "Banksy", country: "UK", style: "Stencil", bio: "Anonymous England-based street artist." },
      { name: "Interesni Kazki", country: "Ukraine", style: "Surrealism", bio: "Ukrainian duo famous for bright murals." },
      { name: "Shum", country: "Ukraine", style: "Graffiti", bio: "Local graffiti legend." }
    ]);
    const artistIds = Object.values(resultArtists.insertedIds);
  } catch(e) {} finally { await client.close(); } }
main();