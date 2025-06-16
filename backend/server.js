import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";


import userRoutes from "./routes/userRoutes.js"; // Import user routes
import { sql } from "./config/db.js";

// Load environment variables from .env file
dotenv.config(); // Load environment variables from .env file



const app = express();
const PORT = process.env.PORT;

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors({
  origin: 'http://localhost:3000',
}));// Middleware to enable CORS
app.use(helmet()); // Security middleware to set various HTTP headers
app.use(morgan("dev")); // Logging middleware to log HTTP requests in the console


app.use("/api/users",userRoutes); // Use user routes for /api/users endpoint

async function initDB(){
  try {
    await sql`CREATE TABLE IF NOT EXISTS customers (
      customer_name VARCHAR(255) PRIMARY KEY
    )`;

    console.log("Customers table initialized");

    await sql`CREATE TABLE IF NOT EXISTS models (
      model_name VARCHAR(255) PRIMARY KEY
    )`;

    console.log("Models table initialized");
    await sql`CREATE TABLE IF NOT EXISTS storages (
      storage_name VARCHAR(255) PRIMARY KEY
    )`;

    console.log("Storages table initialized");
    await sql`CREATE TABLE IF NOT EXISTS boardTypes (
      boardtype_name VARCHAR(255) PRIMARY KEY
    )`;

    console.log("BoardTypes table initialized");

    await sql`CREATE TABLE IF NOT EXISTS profilers (
      profiler_name VARCHAR(255) PRIMARY KEY
    )`;

    console.log("Profilers table initialized");

    await sql`CREATE TABLE IF NOT EXISTS reflowtable (
  profiler_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  model_name VARCHAR(255) NOT NULL,
  storage_name VARCHAR(255) NOT NULL,
  boardtype_name VARCHAR(255) NOT NULL,
  no_of_times_used INTEGER NOT NULL DEFAULT 1 
    CHECK (no_of_times_used BETWEEN 1 AND 6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (profiler_name, customer_name, model_name, storage_name, boardtype_name),
  FOREIGN KEY (profiler_name) REFERENCES profilers(profiler_name),
  FOREIGN KEY (customer_name) REFERENCES customers(customer_name),
  FOREIGN KEY (model_name) REFERENCES models(model_name),
  FOREIGN KEY (storage_name) REFERENCES storages(storage_name),
  FOREIGN KEY (boardtype_name) REFERENCES boardTypes(boardtype_name)
)`;

    console.log("ReflowTable table initialized");

    await sql `CREATE TABLE IF NOT EXISTS history (
        profiler_name VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,  
        model_name VARCHAR(255) NOT NULL,
        storage_name VARCHAR(255) NOT NULL,
        boardtype_name VARCHAR(255) NOT NULL,
        no_of_times_used INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (profiler_name, customer_name, model_name, storage_name, boardtype_name,no_of_times_used, created_at),
        FOREIGN KEY (profiler_name) REFERENCES profilers(profiler_name),
        FOREIGN KEY (customer_name) REFERENCES customers(customer_name),
        FOREIGN KEY (model_name) REFERENCES models(model_name),
        FOREIGN KEY (storage_name) REFERENCES storages(storage_name),
        FOREIGN KEY (boardtype_name) REFERENCES boardTypes(boardtype_name)
    )`;

    console.log("History table initialized");

  } catch (error) {
    console.log("Error in initializing database:", error);
  }
} 

initDB().then(() =>{

 console.log("Database initialized successfully");
// Start the server after initializing the database

  app.listen(PORT, () => {
//    console.log("Database connected");
  console.log("Server started on port", PORT);
});

})
