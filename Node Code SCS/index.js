const express = require('express')
const app = express();
const pool = require('./db')

app.use(express.json())

app.post('/movie' , async (req,res) => {
    try {		
		if(validateInputData(req.body)){
          return res.status(400).send("Bad Request/Validation error");
		}		
       const {name,asset,parental_rating,description} = req.body;
       const dbResult = await pool.query("INSERT INTO movieTable (name,asset,parental_rating,description) VALUES ($1,$2,$3,$4) RETURNING *" , [name,asset,parental_rating,description])
       res.json(dbResult.rows[0])   
    } catch (error) {
		return res.status(400).send("Bad Request/Validation error");
    }
})

app.get('/movies' , async(req,res) => {
    try {
        const getAllMovies = await pool.query("SELECT * FROM movieTable;")
        res.json(getAllMovies.rows)
    } catch (error) {
        console.log(error);
    }
})

app.listen(3000,()=>{
    console.log("Server connected to port 3000")
});

function validateInputData(req){
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required().email,
        lang_code : Joi.string().min(5).max(255).required(),
        rating : Joi.string().min(1).max(3).required,
        country_code : Joi.string().min(1).max(5).required
    })
    return schema.validateInputData(req.body)