import express from 'express';
import routes from './goals/routes.js';

const app = express();

app.use(express.json());
app.use('/', routes);
app.use((req, res) => res.status(404).send({
    code: 'invalidEndpoint',
    message: 'This endpoint does not exist'
}))
app.listen(5000);