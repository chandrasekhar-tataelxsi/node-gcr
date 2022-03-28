const { Pool, Client } = require('pg')
const pool = new Pool({
    user : "postgres",
    password : "postgresql",
    database : "sampletest",
    host : "localhost",
    port : 5432
})
module.exports = pool;