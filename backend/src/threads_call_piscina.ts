'use strict';

import { Request, Response } from "express";
import { Readable } from "stream";

import Piscina from 'piscina';
import { resolve } from 'path';
import { asyncDelay } from "./utils/utils";
// Get OS number o Threads
import os from "node:os";

const THREAD_COUNT = os.cpus().length;

const piscina = new Piscina({
    filename: resolve(__dirname, './workers/callable.js'),
    minThreads: THREAD_COUNT,
    maxThreads: THREAD_COUNT
});

const toRunThreadCallable = async ( req: Request, res: Response) => {
    const { a = 0, b = 0 } = req.query;

    const headers = {
        ...res.getHeaders(), ... {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        }
    };

    res.startTime('piscina', 'piscina time');
    res.writeHead(200, headers);

    async function* run(a: number, b: number) {
        const sumResults = [] as Promise<unknown>[];
        const multiplyResults = [] as Promise<unknown>[];
        for (let i = 0; i < THREAD_COUNT; i++) {
            if (i % 2 === 0) {
                sumResults.push(
                    asyncDelay(async () => {
                        return { thread: i, operation: "sum", value: await piscina.run({ a, b }, { name: 'add' })}
                    }, 1000));
            } else {
                multiplyResults.push(
                    asyncDelay( async () => {
                        return { thread: i, operation: "multiply", value: await piscina.run({ a, b }, { name: 'multiply' })}
                    }, 2500));
            }
        }

        yield Promise.all(sumResults).then((results) => {
            return results
        });

        yield Promise.all(multiplyResults).then(results => {
            return results
        })
    }

    const readable_three = Readable.from(run(Number(a), Number(b)));

    readable_three.on("data", (chunk) => {
        console.log(chunk)
        res.write(`${JSON.stringify(chunk)}`);
    })

    readable_three.on("end", () => {
        console.log("Thread Done");
        res.end();
    });
}

export default toRunThreadCallable