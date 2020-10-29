import "core-js/stable";
import "regenerator-runtime/runtime";
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import models, { connectDb } from './models';
import routes from './routes';
import { initDatabase } from "./db/db_connection";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  req.context = {
    models,
    user: await models.User.findByLogin('Mariano Lopez'),
  };
  next();
});

app.use('/movies', routes.movies);

initDatabase().then((connection) => {
  if (!(connection instanceof Error)) {
    const port = process.env.PORT || 8080;
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`),
    );
  } else {
    console.log(`Ocurrió un error al conectar con la base de datos`);
  }

})

