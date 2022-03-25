import pg from 'pg';

const credentials = {
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "admin",
    port: 5432,
  };

var pool = null;
  

export default class DataBaseHelper {
    constructor(){
        console.log("database helper called");
         pool = this.createDBConnection();
        // console.log("pool",pool);
        // console.log("client",client);
    }
    
    createDBConnection(){
        try {
            const { Pool, Client } = pg;
            const pool = new Pool(credentials);
            return pool;
        } catch (err) {
            throw err;
        }
      
        // const now = await pool.query("SELECT NOW()");
        // console.log("now",now)
        // await pool.end();
    }
    async executeDbQuery(pgQuery) {
        try {
            console.log("query",JSON.stringify(pgQuery))
          return await pool.query(pgQuery);
        }catch(err) {
            throw err;
        }
    }

}