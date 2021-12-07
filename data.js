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
app.post("/data", async (req, res) => {
    try {
        // Lav query
        const query = `SELECT continent, sum(deaths) as deaths, sum(damages) as damages FROM weather group by continent ORDER BY continent asc`;
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

app.post("/type", async (req, res) => {
    try {
        // Lav query
        const query = `SELECT continent, disaster_type, count(disaster_type) as count FROM weather group by continent, disaster_type ORDER BY continent asc, disaster_type asc`;
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

app.post("/asia", async (req, res) => {
    try {
        // Lav query
        const query = `SELECT disaster_type, continent, year, COUNT(disaster_type)FROM weather WHERE continent ILIKE 'asia' and year > 1969 GROUP BY disaster_type, year, continent ORDER BY year ASC`;
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

app.post("/africa", async (req, res) => {
    try {
        // Lav query
        const query = `SELECT disaster_type, continent, year, COUNT(disaster_type)FROM weather WHERE continent ILIKE 'africa' and year > 1969 GROUP BY disaster_type, year, continent ORDER BY year ASC`;
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

app.post("/oceania", async (req, res) => {
    try {
        // Lav query
        const query = `SELECT disaster_type, continent, year, COUNT(disaster_type)FROM weather WHERE continent ILIKE 'oceania' and year > 1969 GROUP BY disaster_type, year, continent ORDER BY year ASC`;
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

app.post("/europe", async (req, res) => {
    try {
        // Lav query
        const query = `SELECT disaster_type, continent, year, COUNT(disaster_type)FROM weather WHERE continent ILIKE 'europe' and year > 1969 GROUP BY disaster_type, year, continent ORDER BY year ASC`;
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

app.post("/north_america", async (req, res) => {
    try {
        // Lav query
        const query = `SELECT disaster_type, continent, year, COUNT(disaster_type)FROM weather WHERE continent ILIKE 'north america' and year > 1969 GROUP BY disaster_type, year, continent ORDER BY year ASC`;
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

app.post("/south_america", async (req, res) => {
    try {
        // Lav query
        const query = `SELECT disaster_type, continent, year, COUNT(disaster_type)FROM weather WHERE continent ILIKE 'south america' and year > 1969 GROUP BY disaster_type, year, continent ORDER BY year ASC`;
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