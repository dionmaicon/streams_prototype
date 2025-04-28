import serverTiming from "server-timing"
import express from 'express';
import cors from 'cors';
import { readFromCSVStream, readFromStream } from './stream';
import toRunThreadCallable from "./threads_call_piscina";

const app = express();
const port = 3000;

app.use(serverTiming());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is up!');
});

app.get('/stream', (req, res) => {
    readFromStream(res);
});

app.get('/stream-csv', (req, res) => {
    readFromCSVStream(res);
});

app.get("/stream-multithread", (req, res) => {
    toRunThreadCallable(req, res);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
