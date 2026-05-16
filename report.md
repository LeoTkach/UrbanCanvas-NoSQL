# Звіт з виконання лабораторних робіт №1-2
**Тема:** Робота з MongoDB (створення БД, колекцій, CRUD, агрегації)
**Проект:** UrbanCanvas (Система обліку об'єктів стріт-арту)

## 1. Концепція та ER-діаграма (Структура колекцій)
База даних `urbancanvas` спроектована для роботи з 7 пов'язаними колекціями. Зв'язки реалізуються через зберігання `ObjectId` у вигляді посилань (Reference) або масивів посилань.

* **users** - користувачі системи (туристи, гіди).
* **artists** - художники-муралісти (пов'язані з artworks).
* **artworks** - об'єкти мистецтва. Містять геопросторові дані `location` у форматі GeoJSON Point.
* **reviews** - відгуки. Пов'язані з `users` та `artworks`.
* **events** - екскурсії. Містять посилання на гіда та масив включених `artworks`.
* **routes** - кураторські маршрути. Містять масив точок `path` (GeoJSON LineString) та масив `artworks`.
* **reports** - скарги на вандалізм (зв'язок з `artworks`).

---

## 2. Код створення БД, індексів та додавання документів (Create)
*Скрипт `seed.js` автоматично підключається до БД, очищує її, створює гео-індекси та наповнює колекції.*

```javascript
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
    
    // Створення індексів (вкл. геопросторові 2dsphere)
    await db.collection('artworks').createIndex({ "location": "2dsphere" });
    await db.collection('routes').createIndex({ "path": "2dsphere" });
    
    // Додавання користувачів (CRUD: Create)
    const resultUsers = await db.collection('users').insertMany([
      { username: "art_lover99", email: "lover@mail.com", role: "tourist", joinedAt: new Date() },
      { username: "kyiv_guide", email: "guide@mail.com", role: "guide", joinedAt: new Date() }
    ]);
    const userIds = Object.values(resultUsers.insertedIds);

    // Додавання художників (CRUD: Create)
    const resultArtists = await db.collection('artists').insertMany([
      { name: "Banksy", country: "UK", style: "Stencil", bio: "Anonymous England-based street artist." },
      { name: "Interesni Kazki", country: "Ukraine", style: "Surrealism", bio: "Ukrainian duo famous for bright murals." }
    ]);
    const artistIds = Object.values(resultArtists.insertedIds);

    // Додавання муралів (CRUD: Create)
    const resultArtworks = await db.collection('artworks').insertMany([
      { 
        title: "Відродження", 
        artistId: artistIds[1], 
        style: "Surrealism", 
        location: { type: "Point", coordinates: [30.5126, 50.4501] }, 
        year: 2014, 
        status: "Active" 
      }
    ]);
  } catch(err) { console.error(err); } finally { await client.close(); }
}
main();
```

---

## 3. Запити до бази даних (Read, Update, Delete, Aggregation)
*Реалізовані у скрипті `test-queries.js`. Демонструють всі вимоги методичних вказівок.*

### 3.1. Вибірка за однією та декількома умовами (Read)
```javascript
// Вибірка платних екскурсій ($gt - greater than)
const paidEvents = await events.find({ price: { $gt: 0 } }).toArray();

// Вибірка муралів конкретних стилів ($in)
const selectedArtworks = await artworks.find({ style: { $in: ["Surrealism", "Stencil"] } }).toArray();
```

### 3.2. Оновлення даних (Update)
```javascript
// Оновлення за умовою
await artworks.updateOne(
  { title: "Київський каштан" }, 
  { $set: { status: "Restored", year: 2024 } }
);

// Оновлення без умови (всіх документів у колекції)
await artworks.updateMany(
  {}, 
  { $set: { lastCheckedAt: new Date() } }
);
```

### 3.3. Видалення даних (Delete)
```javascript
// Видалення спам-відгуків за умовою рейтингу
await reviews.deleteMany({ rating: { $lt: 2 } });
```

### 3.4. Складні агрегації (Поєднання колекцій)
```javascript
// Агрегація 1: Отримання маршрутів із "підтягуванням" деталей муралів ($lookup)
const routeDetails = await routes.aggregate([
  { 
    $lookup: { 
      from: "artworks", 
      localField: "artworks", 
      foreignField: "_id", 
      as: "artwork_details" 
    } 
  },
  { 
    $project: { 
      name: 1, 
      difficulty: 1, 
      "artwork_details.title": 1, 
      "artwork_details.style": 1 
    } 
  }
]).toArray();

// Агрегація 2: Статистика художників ($lookup, $unwind, $group, $addToSet)
const artistStats = await artworks.aggregate([
  { $lookup: { from: "artists", localField: "artistId", foreignField: "_id", as: "artist" } },
  { $unwind: "$artist" },
  { 
    $group: { 
      _id: "$artist.name", 
      totalArtworks: { $sum: 1 }, 
      styles: { $addToSet: "$style" } 
    } 
  }
]).toArray();
```

---
*До звіту додаються скріншоти виконання цих запитів у терміналі (або MongoDB Compass).*
