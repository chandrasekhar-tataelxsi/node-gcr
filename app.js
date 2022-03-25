import express from "express";
import bodyParser from "body-parser";
import Bootstrap  from "./bootstrap.js";
import routes from "./routes/routes.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
new Bootstrap(app);
routes(app);
