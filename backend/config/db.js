import {neon} from '@neondatabase/serverless';

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const {PGHOST,PGDATABASE,PGUSER,PGPASSWORD} = process.env;

//creates a connection to the Neon database using the environment variables
export const sql = neon(
  `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);

//this sql function we export is used as a tagged template literal function
//to write SQL queries safely


