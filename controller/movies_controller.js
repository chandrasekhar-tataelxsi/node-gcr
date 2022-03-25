import DataBaseHelper from "./helper/db_helper.js";
export default class MoviesController {
    constructor(){}

    async getMovieList (req,res) {
        try {
            let dataBaseHelper = new DataBaseHelper();
            let asset = {
                "dash_url": "https://abc.com",
                "hls_url": "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
                "name": 
                   [ {
                        "lang_code": "en",
                        "name": "Joker"
                    }]
                
            }
            let parental_rating = [
                {
                    "country_code": "IN",
                    "rating": "18"
                }
            ]
            let query =    `
                insert into movies (name,asset,start_date,end_date,parental_rating,description)
                VALUES ('Kids Live',${asset},${new Date()},${new Date()},${null},'The online classes are conducted for individuals as well as groups')
            `
            console.log("getMovieList api called successfully");
            let result = await dataBaseHelper.executeDbQuery(query);
            console.log("query execution response",result);
            res.send("movie api called successfully")
        } catch(err) {
            console.log("error pankaj",err);
            return res.status(500).send(err)
        }
       
    }
}