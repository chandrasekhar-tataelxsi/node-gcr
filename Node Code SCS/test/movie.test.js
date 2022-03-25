const {expect} = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const request = require('supertest')
const Pool = require('pg-pool')
const client = require('../db')
const { object } = require('joi')
const {body , validationResult} = require('express-validator')

chai.should();
chai.use(chaiHttp)

describe('started the test ' , function(){

    let app

  before('Mock db connection and load app', async function () {
    
    const pool = new Pool({
      database: 'testdb',
      user: 'postgres',
      password: 'postgres',
      port: 5432,
      max: 1, 
      idleTimeoutMillis: 0 
    })

    
    client.query = (text, values) => {
      return pool.query(text, values)
    }

    
    app = require('../index')    
  })

  beforeEach('Create temporary tables', async function () {
    await client.query('CREATE TEMPORARY TABLE mvtable (LIKE mvtable INCLUDING ALL)')
  })

  afterEach('Drop temporary tables', async function () {
    await client.query('DROP TABLE IF EXISTS pg_temp.mvtable')
  })

  describe('GET /movies' , () => {
    it('It should get all the movies' , (done) => {
      chai.request(app).get('/movies').end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      })
    })
  })
  describe('POST /movie',  () => {
    it('Should create a new movie', async  () => {
      const req = {
        
            "name": {
              "name": "Jocker",
              "lang_code": "en"
            },
            "asset": {
              "dash_url": "https://abc.com",
              "hls_url": "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
            },
            "parental_rating": {
              "country_code": "IN",
              "rating": "18"
            },
            "description": "description1"
          
      }
  
      chai.request(app).post('/movie').send(req).end((err,res) => {
        res.body.should.have.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.should.have.property('asset');
        res.body.should.have.property('parental_rating');
        res.body.should.have.property('description');
        done();
      })

    })

    it('Should not post if fields are not string exists', async function () {
      const req = {
        "name": {
            "name": 10,
            "lang_code": "en"
          },
          "asset": {
            "dash_url": "https://abc.com",
            "hls_url": "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
          },
          "parental_rating": {
            "country_code": "IN",
            "rating": "18"
          },
          "description": "description1"
      }
      
      chai.request(app).post('/movie').send(req).end((err,res) => {
        res.body.should.have.status(400);
        res.text.should.be.eq("Bad Request/Validation error");
        
        done();
      })

    })

  })

})
