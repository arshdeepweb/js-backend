import 'dotenv/config';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema.js'; // Ensure the schema import is correct

// Create a MySQL2 connection instance
const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL, // Ensure DATABASE_URL is correct
});

// Initialize Drizzle with MySQL2 connection and specify mode
export const db = drizzle(connection, { schema, mode: "default" }); // or "planetscale" if using PlanetScale
