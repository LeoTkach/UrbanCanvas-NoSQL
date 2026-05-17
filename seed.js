const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URL || 'mongodb://admin:secretpassword@localhost:27017';
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db('urbancanvas');
    const collections = ['users', 'artists', 'artworks', 'reviews', 'events', 'routes', 'reports', 'stories'];
    for (const col of collections) {
      try {
        await db.collection(col).drop();
      } catch (e) {
        // Ignore drop errors if collection doesn't exist
      }
    }

    // Create collections with $jsonSchema validation
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['username', 'email', 'role'],
          properties: {
            username: { bsonType: 'string', description: 'must be a string and is required' },
            email: { bsonType: 'string', description: 'must be a string and is required' },
            role: { enum: ['tourist', 'guide', 'admin'], description: 'can only be one of the enum values and is required' }
          }
        }
      }
    });

    await db.createCollection('artworks', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title', 'style'],
          properties: {
            title: { bsonType: 'string', description: 'must be a string and is required' },
            style: { bsonType: 'string', description: 'must be a string and is required' },
            location: {
              bsonType: 'object',
              required: ['type', 'coordinates'],
              properties: {
                type: { enum: ['Point'] },
                coordinates: { bsonType: 'array', minItems: 2, maxItems: 2 }
              }
            }
          }
        }
      }
    });

    // Indexes
    await db.collection('artworks').createIndex({ location: '2dsphere' });
    await db.collection('routes').createIndex({ path: '2dsphere' });
    await db.collection('artworks').createIndex({ style: 1 });

    const resultUsers = await db.collection('users').insertMany([
      { username: 'art_lover99',     email: 'lover@mail.com', role: 'tourist', joinedAt: new Date() },
      { username: 'kyiv_guide',      email: 'guide@mail.com', role: 'guide',   joinedAt: new Date() },
      { username: 'admin_moderator', email: 'admin@mail.com', role: 'admin',   joinedAt: new Date() },
      { username: 'phantom_spotter', email: 'phantom@mail.com', role: 'tourist', joinedAt: new Date() },
    ]);
    const userIds = Object.values(resultUsers.insertedIds);

    const resultArtists = await db.collection('artists').insertMany([
      { name: 'Banksy',           country: 'UK',         style: 'Stencil',    bio: 'Anonymous England-based street artist.' },
      { name: 'Interesni Kazki',  country: 'Ukraine',    style: 'Surrealism', bio: 'Ukrainian duo famous for large murals.' },
      { name: 'Shum',             country: 'Ukraine',    style: 'Graffiti',   bio: 'Local graffiti legend of Kyiv.' },
      { name: 'Waone',            country: 'Ukraine',    style: 'Surrealism', bio: 'Half of Interesni Kazki collective.' },
      { name: 'Guido van Helten', country: 'Australia',  style: 'Realism',   bio: 'Hyper-realistic portrait muralist.' },
      { name: 'Hama Woods',       country: 'Ukraine',    style: 'Abstract',   bio: 'Kyiv-based abstract and typographic artist.' },
      { name: 'Reom',             country: 'Ukraine',    style: 'Graffiti',   bio: 'Old-school Kyiv graffiti veteran.' },
    ]);
    const artistIds = Object.values(resultArtists.insertedIds);

    const resultArtworks = await db.collection('artworks').insertMany([
      {
        title: 'Відродження', artistId: artistIds[1], style: 'Surrealism',
        location: { type: 'Point', coordinates: [30.5126, 50.4501] },
        year: 2014, status: 'Active', tags: ['mural', 'culture', 'revolution'],
        description: 'Мурал, що символізує відродження нації після Майдану.',
        story: 'З\'явився у лютому 2014-го, прямо під час революції. Художники малювали його три доби без зупинки, поки вирувала площа. Кажуть, снайпери бачили їх із даху, але не зупиняли.',
        commentsCount: 14,
      },
      {
        title: 'Дівчинка з гімнасткою', artistId: artistIds[0], style: 'Stencil',
        location: { type: 'Point', coordinates: [29.9272, 50.6698] },
        year: 2022, status: 'Active', tags: ['war', 'famous', 'stencil'],
        description: 'Трафаретне графіті на зруйнованій стіні в Гостомелі.',
        story: 'З\'явився через кілька тижнів після звільнення Гостомеля. Місцеві жителі спочатку думали, що це місцевий художник. Пізніше в мережі з\'явилось відео — стрижень і чорна рукавиця.',
        commentsCount: 31,
      },
      {
        title: 'Київський каштан', artistId: artistIds[2], style: 'Graffiti',
        location: { type: 'Point', coordinates: [30.4999, 50.4411] },
        year: 2020, status: 'Faded', tags: ['nature', 'colors', 'local'],
        description: 'Каштанові ілюстрації, розпорошені яскравими балончиками.',
        story: null,
        commentsCount: 3,
      },
      {
        title: 'Механічний Кіт', artistId: artistIds[3], style: 'Surrealism',
        location: { type: 'Point', coordinates: [30.5232, 50.4600] },
        year: 2019, status: 'Active', tags: ['surreal', 'animal', 'industrial'],
        description: 'Гігантська кішка-машина на стіні заводу на Подолі.',
        story: 'Завод закрили у 2018-му. Власник дав дозвіл "розмалювати усе що знайдеш". Waone пробув там 11 днів.',
        commentsCount: 8,
      },
      {
        title: 'Тіні Революції', artistId: null, style: 'Surrealism',
        location: { type: 'Point', coordinates: [30.5150, 50.4470] },
        year: 2015, status: 'Active', tags: ['history', 'dark', 'memorial'],
        description: 'Тіні людей, назавжди залишились на цегляній стіні.',
        story: 'Автор невідомий. Роботу виявили через рік після появи — ніхто не бачив як її малювали. Деякі вважають, що це зробив хтось із учасників Майдану, хто пізніше загинув.',
        commentsCount: 22,
      },
      {
        title: 'Ghost Signal', artistId: artistIds[2], style: 'Graffiti',
        location: { type: 'Point', coordinates: [30.5010, 50.4380] },
        year: 2021, status: 'Active', tags: ['throwup', 'digital', 'decay'],
        description: 'Throw-up з деградованим сигналом — алюзія на цифровий розпад.',
        story: null,
        commentsCount: 5,
      },
      {
        title: 'Ветеран', artistId: artistIds[4], style: 'Realism',
        location: { type: 'Point', coordinates: [30.5300, 50.4550] },
        year: 2023, status: 'Active', tags: ['portrait', 'war', 'memorial'],
        description: 'Фотореалістичний портрет захисника на фасаді житлового будинку.',
        story: 'Намальований на замовлення родини загиблого. Будинок стоїть навпроти школи — щоб діти пам\'ятали.',
        commentsCount: 47,
      },
      {
        title: 'Entropy Loop', artistId: artistIds[5], style: 'Abstract',
        location: { type: 'Point', coordinates: [30.5080, 50.4490] },
        year: 2022, status: 'Active', tags: ['abstract', 'typography', 'loop'],
        description: 'Абстрактна стрічка Мебіуса із типографічними елементами.',
        story: null,
        commentsCount: 6,
      },
      {
        title: 'Dead Channel', artistId: artistIds[6], style: 'Graffiti',
        location: { type: 'Point', coordinates: [30.4880, 50.4420] },
        year: 2018, status: 'Faded', tags: ['wildstyle', 'classic', 'color'],
        description: 'Класичний вайлдстайл у брутальній колірній гамі.',
        story: null,
        commentsCount: 2,
      },
      {
        title: 'Rust Protokol', artistId: null, style: 'Graffiti',
        location: { type: 'Point', coordinates: [30.5190, 50.4440] },
        year: 2023, status: 'Active', tags: ['industrial', 'rust', 'texture'],
        description: 'Промислова текстура іржі, відтворена балончиком.',
        story: 'З\'явилось одного ранку на заводській стіні. Охоронець каже — нічого не чув. Камери показали лише силует у балаклаві.',
        commentsCount: 11,
      },
      {
        title: 'Квантовий Сон', artistId: artistIds[1], style: 'Surrealism',
        location: { type: 'Point', coordinates: [30.5045, 50.4520] },
        year: 2017, status: 'Active', tags: ['surreal', 'science', 'dreamlike'],
        description: 'Сюрреалістичний персонаж у стані квантової невизначеності.',
        story: null,
        commentsCount: 9,
      },
      {
        title: 'Monolith', artistId: artistIds[5], style: 'Abstract',
        location: { type: 'Point', coordinates: [30.5220, 50.4480] },
        year: 2024, status: 'Active', tags: ['abstract', 'geometric', 'massive'],
        description: '5-поверховий абстрактний моноліт із трикутними формами.',
        story: 'Найбільша абстрактна робота в місті. Займає весь торець будинку. Малювали 3 тижні з підйомником.',
        commentsCount: 18,
      },
      {
        title: 'Peeling Memory', artistId: artistIds[0], style: 'Stencil',
        location: { type: 'Point', coordinates: [30.5060, 50.4395] },
        year: 2022, status: 'Removed', tags: ['stencil', 'layers', 'memory'],
        description: 'Шари трафаретів, що зображують уривки пам\'яті крізь час.',
        story: 'Зафарбували комунальники через три дні після появи. Встигли сфотографувати лише двоє перехожих.',
        commentsCount: 7,
      },
      {
        title: 'Territorial Pissings', artistId: artistIds[6], style: 'Graffiti',
        location: { type: 'Point', coordinates: [30.4920, 50.4460] },
        year: 2016, status: 'Faded', tags: ['tag', 'bombing', 'old-school'],
        description: 'Маркування території — монументальний тег на заводській трубі.',
        story: null,
        commentsCount: 1,
      },
      {
        title: 'Fractured Nation', artistId: null, style: 'Surrealism',
        location: { type: 'Point', coordinates: [30.5170, 50.4510] },
        year: 2022, status: 'Active', tags: ['surreal', 'ukraine', 'resistance'],
        description: 'Карта країни, що тріскається, але тримається корінням.',
        story: 'Автор не підписався. Залишив лише координати і дату на звороті будинку: 24.02.2022.',
        commentsCount: 38,
      },
      {
        title: 'Signal Lost', artistId: artistIds[5], style: 'Abstract',
        location: { type: 'Point', coordinates: [30.5000, 50.4430] },
        year: 2021, status: 'Active', tags: ['static', 'noise', 'underpass'],
        description: 'Рябь статичного шуму і розрядженого сигналу на 4 стінах переходу.',
        story: null,
        commentsCount: 4,
      },
    ]);
    const artworkIds = Object.values(resultArtworks.insertedIds);

    await db.collection('stories').insertMany([
      { artworkId: artworkIds[0], userId: userIds[3], text: 'Бачив як малювали другу ніч — художники не спали, до них приносили їжу незнайомці.', date: new Date('2024-03-01') },
      { artworkId: artworkIds[1], userId: userIds[1], text: 'Місцева бабуся розповіла — спочатку подумала що вандали, а потім заплакала.', date: new Date('2024-02-14') },
      { artworkId: artworkIds[4], userId: userIds[0], text: 'Прийшов о 3 ночі з ліхтарем. Щось у цьому місці є — наче дивляться на тебе.', date: new Date('2024-01-20') },
    ]);

    await db.collection('reviews').insertMany([
      { artworkId: artworkIds[0], userId: userIds[0], rating: 5, comment: 'Неймовірно!',             date: new Date() },
      { artworkId: artworkIds[0], userId: userIds[1], rating: 4, comment: 'Гарно.',                   date: new Date() },
      { artworkId: artworkIds[1], userId: userIds[0], rating: 5, comment: 'Дуже сильна робота.',      date: new Date() },
      { artworkId: artworkIds[3], userId: userIds[2], rating: 4, comment: 'Незвичайна концепція.',    date: new Date() },
      { artworkId: artworkIds[6], userId: userIds[1], rating: 5, comment: 'Фотографія, а не мурал!', date: new Date() },
    ]);

    await db.collection('routes').insertMany([
      {
        name: 'Центральні Мурали', creatorId: userIds[1], difficulty: 'Easy', estimatedTimeMinutes: 120,
        path: { type: 'LineString', coordinates: [[30.5126, 50.4501], [30.5150, 50.4470], [30.4999, 50.4411]] },
        artworks: [artworkIds[0], artworkIds[4], artworkIds[2]],
      },
      {
        name: 'Промисловий Маршрут', creatorId: userIds[0], difficulty: 'Hard', estimatedTimeMinutes: 200,
        path: { type: 'LineString', coordinates: [[30.4880, 50.4420], [30.4920, 50.4460], [30.5010, 50.4380]] },
        artworks: [artworkIds[8], artworkIds[13], artworkIds[5]],
      },
    ]);

    await db.collection('events').insertMany([
      { name: 'Kyiv Mural Tour 2024', guideId: userIds[1], date: new Date('2024-06-01T10:00:00Z'), maxParticipants: 20, price: 300, artworksIncluded: [artworkIds[0], artworkIds[2]] },
      { name: 'Underground Bombing Night', guideId: userIds[0], date: new Date('2024-08-15T22:00:00Z'), maxParticipants: 8, price: 0, artworksIncluded: [artworkIds[5], artworkIds[8]] },
    ]);

    await db.collection('reports').insertMany([
      { artworkId: artworkIds[2], reportedBy: userIds[0], issueType: 'Vandalism', description: 'Хтось намалював тег поверх муралу.', status: 'Pending', reportedAt: new Date() },
      { artworkId: artworkIds[12], reportedBy: userIds[1], issueType: 'Removed', description: 'Стіну зафарбували під час ремонту.', status: 'Confirmed', reportedAt: new Date() },
    ]);

    console.log(`Seed complete. ${artworkIds.length} artworks, ${resultArtists.insertedIds} artists.`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();