# DBD3781 E-Commerce Platform (Etzy Replica)

A distributed, MongoDB-backed e-commerce dashboard built with Node.js, Express, Mongoose, React, Vite and Tailwind CSS. Developed as part of the DBD3781 project at Belgium Campus.

---

## Repository Structure

```plaintext
DBD_Project_Replica/
├── Ecommerce-Backend/
│   ├── performance_tests/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── Ecommerce-Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

---

## 🛠 Prerequisites

- **Node.js** ≥ 18  
- **Docker & Docker Compose** (optional)  
- **MongoDB Atlas** cluster or local MongoDB instance

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/DBD_Project_Replica.git
cd DBD_Project_Replica
```

### 2. Configure environment

```bash
# copy & edit your env file
cp Ecommerce-Backend/.env.example Ecommerce-Backend/.env
```

Then open `Ecommerce-Backend/.env` and set:

```dotenv
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

### 3. Install dependencies

```bash
# Backend
cd Ecommerce-Backend
npm install

# Frontend
cd ../Ecommerce-Frontend
npm install
```

### 4. Run locally

```bash
# Terminal 1: Start backend
cd Ecommerce-Backend
npm run dev      # or `npm start`

# Terminal 2: Start frontend
cd ../Ecommerce-Frontend
npm run dev      # Vite serves on http://localhost:3000
```

- **Backend:** http://localhost:5000  
- **Frontend:** http://localhost:3000

### 5. (Optional) Docker Compose

```bash
docker compose up --build
```

---

## 🔍 API Endpoints

| Method | Path                     | Description                     |
| ------ | ------------------------ | ------------------------------- |
| GET    | `/api/products`          | List all products               |
| POST   | `/api/products/add`      | Create a new product            |
| PUT    | `/api/products/:id`      | Update product by ID            |
| DELETE | `/api/products/:id`      | Delete product by ID            |
| GET    | `/api/categories/all`    | List all categories             |
| POST   | `/api/categories/add`    | Create a new category           |
| PUT    | `/api/categories/:id`    | Update category by ID           |
| DELETE | `/api/categories/:id`    | Delete category by ID           |
| GET    | `/api/orders`            | List all orders                 |
| POST   | `/api/orders/add`        | Create a new order              |
| PUT    | `/api/orders/:id`        | Update order status/details     |
| GET    | `/api/reviews/all`       | List all reviews                |
| POST   | `/api/reviews/add`       | Create a new review             |
| DELETE | `/api/reviews/:id`       | Delete review by ID             |
| GET    | `/api/cart/:userId`      | Get or create user’s cart       |
| POST   | `/api/cart/add`          | Create/update cart for user     |
| DELETE | `/api/cart/:userId`      | Clear user’s cart               |
| POST   | `/api/users`             | Register a new user             |
| GET    | `/api/users`             | List all users                  |

---

## Testing & Stress Scripts

All scripts live in `Ecommerce-Backend/performance_tests/`:

- **readStressTest.js**  
- **createStressTest.js**  
- **updateOrderStatusStress.js**  

Run one like this:

```bash
# from Ecommerce-Backend folder
node performance_tests/updateOrderStatusStress.js
```

---

## Frontend

- **Framework:** React + TypeScript + Vite  
- **Routing:** React Router  
- **State:** Context API (for auth)  
- **Styling:** Tailwind CSS  

---

## Contributions

Calvin Nijenhuis, Kaidy Edwards, Marcus Moen, Angelité Arendse

---

## License

MIT License  

