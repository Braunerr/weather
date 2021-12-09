const { Client } = require("pg");
const express = require("express");
const morgan = require("morgan"); // Some nice logging

const PORT = process.env.PORT || 8080;
const DB_USER = process.env.DB_USER || "edymhxqp";
const DB_HOST = process.env.DB_HOST || "abul.db.elephantsql.com";
const DB_NAME = process.env.DB_NAME || "edymhxqp";
const DB_PW = process.env.DB_PW || "JhNprfSRJ60oDMDygG_jAhyuRnIKIURb";
const DB_PORT = process.env.DB_PORT || 5432;

console.warn("Lige nu er databasenavn sat til:", DB_NAME);
console.log("Postgres database:", DB_NAME);
console.log("Postgres user:", DB_USER);

/*
 * Herunder laves web-serveren. Den indeholder din html (fra public-folderen)
 * og API'en så der er forbindelse videre til databasen fra JavaScript. Det er "to i en".
 */
const app = express();
const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PW,
    port: DB_PORT,
});
client.connect();

app.use(express.text());
app.use(express.static("public"));
app.use(morgan("combined"));

/*
 * Her defineres API'en.
 * Man laver lige så mange endpoints man har lyst til. Jeg har lavet et enkelt til
 */

app.post("/data/1", async (req, res) => {
    try {
        // Lav query
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'asia'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);
        // Giv svar tilbage til JavaScript
        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {
        // Hvis query fejler, fanges det her.
        // Send fejlbesked tilbage til JavaScript
        res.json({
            ok: false,
            message: error.message,
        });
    }
});

app.post("/data/0", async (req, res) => {
    try {
        // Lav query
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'africa'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);
        // Giv svar tilbage til JavaScript
        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {
        // Hvis query fejler, fanges det her.
        // Send fejlbesked tilbage til JavaScript
        res.json({
            ok: false,
            message: error.message,
        });
    }
});

app.post("/data/4", async (req, res) => {
    try {
        // Lav query
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'oceania'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);
        // Giv svar tilbage til JavaScript
        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {
        // Hvis query fejler, fanges det her.
        // Send fejlbesked tilbage til JavaScript
        res.json({
            ok: false,
            message: error.message,
        });
    }
});

app.post("/data/2", async (req, res) => {
    try {
        // Lav query
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'europe'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);
        // Giv svar tilbage til JavaScript
        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {
        // Hvis query fejler, fanges det her.
        // Send fejlbesked tilbage til JavaScript
        res.json({
            ok: false,
            message: error.message,
        });
    }
});

app.post("/data/3", async (req, res) => {
    try {
        // Lav query
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'north america'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);
        // Giv svar tilbage til JavaScript
        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {
        // Hvis query fejler, fanges det her.
        // Send fejlbesked tilbage til JavaScript
        res.json({
            ok: false,
            message: error.message,
        });
    }
});

app.post("/data/5", async (req, res) => {
    try {
        // Lav query
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'south america'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);
        // Giv svar tilbage til JavaScript
        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {
        // Hvis query fejler, fanges det her.
        // Send fejlbesked tilbage til JavaScript
        res.json({
            ok: false,
            message: error.message,
        });
    }
});

// Web-serveren startes.
app.listen(PORT, () => console.log(`Serveren kører på http://localhost:${PORT}`));