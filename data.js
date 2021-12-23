const { Client } = require("pg");
const express = require("express");
const morgan = require("morgan");

const PORT = process.env.PORT || 8080;
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PW = process.env.DB_PW;
const DB_PORT = process.env.DB_PORT || 5432;

// Herunder laves web-serveren
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

// Her defineres API'en.

// Africa
app.post("/data/Africa", async (req, res) => {
    try {
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'africa'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);

        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {

        res.json({
            ok: false,
            message: error.message,
        });
    }
});

// Asia
app.post("/data/Asia", async (req, res) => {
    try {
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'asia'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);

        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {

        res.json({
            ok: false,
            message: error.message,
        });
    }
});

// Europe
app.post("/data/Europe", async (req, res) => {
    try {
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'europe'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);
        
        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {
        
        res.json({
            ok: false,
            message: error.message,
        });
    }
});

//North America
app.post("/data/North America", async (req, res) => {
    try {
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'north america'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);
        
        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {
        
        res.json({
            ok: false,
            message: error.message,
        });
    }
});

// Oceania
app.post("/data/Oceania", async (req, res) => {
    try {
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'oceania'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);

        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {
        
        res.json({
            ok: false,
            message: error.message,
        });
    }
});

// South America
app.post("/data/South America", async (req, res) => {
    try {
        const query = 
        `SELECT disaster_type, year, count(disaster_type)
        FROM weather 
        WHERE continent ILIKE 'south america'  
        group by disaster_type, year
        ORDER BY disaster_type ASC, year ASC`;
        queryData = await client.query(query);
        
        res.json({
            ok: true,
            data: queryData.rows,
        });
    } catch (error) {
        
        res.json({
            ok: false,
            message: error.message,
        });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Serveren kører på http://localhost:${PORT}`));