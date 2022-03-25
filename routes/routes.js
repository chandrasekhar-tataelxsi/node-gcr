
import MoviesController from '../controller/movies_controller.js';
// import express  from 'express';
// const router = express.Router();


export default function routess(app) {
    const moviesController = new MoviesController();
    
    app.get("/movie/list",moviesController.getMovieList)
}