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
    const resultArtworks = await db.collection('artworks').insertMany([
      { title: "Відродження", artistId: artistIds[1], style: "Surrealism", location: { type: "Point", coordinates: [30.5126, 50.4501] }, year: 2014, description: "Мурал, що символізує відродження.", status: "Active", tags: ["mural", "culture"] },
      { title: "Дівчинка з гімнасткою", artistId: artistIds[0], style: "Stencil", location: { type: "Point", coordinates: [29.9272, 50.6698] }, year: 2022, description: "Графіті на зруйнованому будинку.", status: "Active", tags: ["war", "famous"] },
      { title: "Київський каштан", artistId: artistIds[2], style: "Graffiti", location: { type: "Point", coordinates: [30.4999, 50.4411] }, year: 2020, description: "Каштан яскравими балончиками.", status: "Faded", tags: ["nature", "colors"] }
    ]);
    const artworkIds = Object.values(resultArtworks.insertedIds);

    await db.collection('routes').insertMany([
      { name: "Центральні Мурали", creatorId: userIds[1], difficulty: "Easy", estimatedTimeMinutes: 120, path: { type: "LineString", coordinates: [ [30.5126, 50.4501], [30.4999, 50.4411] ] }, artworks: [artworkIds[0], artworkIds[2]] }
    ]);
  } catch(e) {} finally { await client.close(); } }
main();