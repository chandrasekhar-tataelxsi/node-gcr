const express = require('express');
const app = express();
const pool = require('./connection');
const Joi = require('joi');
const { all } = require('proxy-addr');

app.use(express.json())

const port = 8010;

app.listen(port, () => {
    console.log('listening for request : ' + port);
});

//GET Method (Multiple Data)
app.get('/movies' , async(req,res) => {
    console.log('GET Method - Multiple Data');
    try {
        const result = await pool.query("SELECT * FROM tbmovie;")
        res.json(result.rows)
    } catch (err) {
        console.error(err);
    }
})

//POST Method
app.post('/movie' , async (req,res) => {
    console.log('POST Method');
    try {
        const {error} = validate(req.body);
        if(error){
            return res.status(400).send(error.details[0].message);
        }
        const {name} = req.body;
        const {asset} = req.body;
        const {parental_rating} = req.body;
        const {description} = req.body;
        const newdata = await pool.query("INSERT INTO tbmovie (name,asset,parental_rating,description) VALUES ($1,$2,$3,$4) RETURNING *" , [name,asset,parental_rating,description]);
        res.json(newdata.rows[0]);
    } catch (err) {
        console.error(err);
    }
})

//GET Method (Single Data)
app.get('/movies/:id' , async(req,res) => {
    console.log('GET Method - Single Data');
    try {
        const {id} = req.params;
        const result = await pool.query("SELECT * FROM tbmovie WHERE prid=($1);" , [id])
        res.json(result.rows[0])
    } catch (err) {
        console.error(err);
    }
})

//PUT Method
app.put('/movie/:id' , async (req,res) => {
    console.log('PUT Method');
    try {
        const {id} = req.params;
        const {name} = req.body;
        const {asset} = req.body;
        const {parental_rating} = req.body;
        const {description} = req.body;
        const updatedata = await pool.query("UPDATE tbmovie SET name=$1,asset=$2,parental_rating=$3,description=$4 WHERE  prid=$5 ;" , [name,asset,parental_rating,description,id])
        res.json("Data updated");
    } catch (err) {
        console.error(err);
    }
})

//DELETE Method
app.delete('/movie/:id' , async (req,res) => {
    console.log('DELETE Method');
    try {
        const {id} = req.params;
        const deletedata = await pool.query("DELETE FROM tbmovie WHERE prid= $1" , [id]);
        res.json("Data Deleted")
    } catch (err) {
        console.error(err)
    }
})

//Function Validate
function validate(req){
    console.log('Validation');
    const schema = Joi.object({
        name: Joi.array().items(Joi.string().min(2).max(10).required()),
        asset : Joi.array().items(Joi.string().min(2).max(255).required()),
        parental_rating : Joi.array().items(Joi.string().min(2).max(10).required()),
        description : Joi.string().min(5).max(255).required()
    })
    return schema.validate(req.body)
}