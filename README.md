# UrbanCanvas 🎨

**UrbanCanvas** is an information system for tracking, reviewing, and creating curated routes for street art objects (murals, graffiti, installations). The project was created as part of the "NoSQL Systems" university course laboratory works.

## 🚀 Technology Stack
- **Database:** MongoDB (Document-oriented NoSQL DBMS)
- **Infrastructure:** Docker and Docker Compose
- **Backend (DB Scripts):** Node.js + official `mongodb` driver
- **Frontend (In Development):** Next.js (React), TailwindCSS, Leaflet (for geospatial data)

## 📁 Project Structure
The project uses 7 interconnected MongoDB collections to implement complex domain logic:
- `users` — system users (tourists, guides, admins).
- `artists` — street artists and muralists.
- `artworks` — street art objects (includes GeoJSON coordinates).
- `reviews` — user reviews and ratings.
- `events` — guided tours and street art events.
- `routes` — curated walking routes (GeoJSON LineString).
- `reports` — moderation reports (e.g., vandalism, faded paint).

## 🛠 Setup Instructions (Docker Only)

We use a fully containerized approach. No local Node.js or `node_modules` are required on your host machine.

### 1. Start the Environment
Start both the MongoDB database and the Node.js application container in the background:
```bash
docker-compose up --build -d
```
*(This will automatically install all dependencies inside the `urbancanvas-app` container).*

### 2. Initialize and Seed the Database (Lab 1)
Run the seed script inside the Docker container to create collections, add geo-indexes (`2dsphere`), and populate the database with test data:
```bash
docker exec urbancanvas-app node seed.js
```

### 3. Execute Test Queries (Lab 2)
To verify the operation of complex aggregations (including `$lookup`, `$unwind`, `$group`), advanced filtering, and CRUD operations, run this command inside the container:
```bash
docker exec urbancanvas-app node test-queries.js
```