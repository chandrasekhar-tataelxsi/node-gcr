const Pool = require('pg').Pool

const pool = new Pool({
    user : "postgres",
    password : "postgres",
    database : "testdb",
    host : "localhost",
    port : 5432
})

module.exports = pool;