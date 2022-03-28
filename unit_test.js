const {expect} = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const request = require('supertest')
const Pool = require('pg-pool')
const client = require('../db')
const { object } = require('joi')

chai.should();
chai.use(chaiHttp)

describe('started the test ' , function(){

    let app

  before('Mock db connection and load app', async function () {
    
    const pool = new Pool({
      database: 'sampletest',
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
    await client.query('CREATE TEMPORARY TABLE tbmovie (LIKE tbmovie INCLUDING ALL)')
  })

  afterEach('Drop temporary tables', async function () {
    await client.query('DROP TABLE IF EXISTS pg_temp.tbmovie')
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
      //await postNote(req)

      //const { rows } = await client.query('SELECT name, description FROM tbmovie WHERE name = $1', [req.description])
      //expect(rows).lengthOf(1)
      //expect(rows[0]).to.deep.equal(req)
      chai.request(app).post('/movie').send(req).end((err,res) => {
        res.body.should.have.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.should.have.property('asset');
        res.body.should.have.property('parental_rating');
        res.body.should.have.property('description')
        done();
      })

    })

    it('Should not post if fields are not string exists', async function () {
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
        res.body.should.have.status(400)
        
        done();
      })

    })

  })

  async function postNote (req, status = 200) {
    const { body } = await request(app)
      .post('/movie')
      .send(req)
      .expect(status)
    return body
  }
})
