import express from 'express';
import cors from 'cors';
import { read } from 'fs';
import { readFromStream } from './stream';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is up!');
});

app.get('/stream', (req, res) => {
    readFromStream(res);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
