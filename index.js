const express = require('express')
const app = express();
const pool = require('./db')
const Joi = require('joi')
const {body , validationResult} = require('express-validator')

app.use(express.json())

app.post('/movie' , body('name').isObject(),body('name.name').isString(),body('name.lang_code').isString(),
body('asset').isObject(),body('asset.dash_url').isString(),body('asset.hls_url').isString(),
body('parental_rating').isObject(),body('parental_rating.country_code').isString(),body('parental_rating.rating').isString(),
body('description').isString() 
,async (req,res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
       
                Message: "Bad Request/Validation error"
            });
        }
      

       const {name} = req.body;
       const {asset} = req.body;
       const {parental_rating} = req.body;
       const {description} = req.body;
       const newname = await pool.query("INSERT INTO mvtable (name,asset,parental_rating,description) VALUES ($1,$2,$3,$4) RETURNING *" , [name,asset,parental_rating,description])
       res.json(newname.rows[0])
    } catch (err) {
        res.status(500).json({
            status: "SERVER_ERROR",
            Message: "Internal Server error.",
            error : "Internal Server error."
        })
        
    }
})

app.get('/movies' , async(req,res) => {
    try {
        const allMovies = await pool.query("SELECT * FROM mvtable;")
        res.json(allMovies.rows)
    } catch (err) {
        res.status(404).json({
            status : "NOT_FOUND",
            Message : "URL Resource not found."
        })
    }
})

app.get('/movies/:id' , async(req,res) => {
    try {
        const {id} = req.params;
        const Movies = await pool.query("SELECT * FROM mvtable WHERE id=($1);" , [id])
        res.json(Movies.rows[0])
    } catch (err) {
        res.status(207).json({
            "status": "MULTI_STATUS",
            "Message": "Movie not found."
        })
    }
})

app.put('/movie/:id' , async (req,res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;
       const {asset} = req.body;
       const {parental_rating} = req.body;
       const {description} = req.body;
       const newname = await pool.query("UPDATE mvtable SET name=$1,asset=$2,parental_rating=$3,description=$4 WHERE  id=$5 ;" , [name,asset,parental_rating,description,id])

       res.json("Table updated");
    } catch (err) {
        res.status(207).json({
            "status": "MULTI_STATUS",
            "Message": "Movie not found."
        })
    }
})

app.delete('/movie/:id' , async (req,res) => {
    try {
        const {id} = req.params;
        const deleteMovie = await pool.query("DELETE FROM mvtable WHERE id= $1" , [id]);
        res.json(" Movie Deleted Successfully ")
    } catch (err) {
        res.status(207).json({
            "status": "MULTI_STATUS",
            "Message": "Movie not found."
        })
    }
})

app.listen(5001,()=>{
    console.log("Server connected to port 5001")
});
