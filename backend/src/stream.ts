import { Readable } from "stream";
import { Response } from "express";
import { asyncDelay } from "./utils/utils";
import fs from "fs";
import { parse } from 'csv-parse';


const readFromStream = async (res: Response) => {

    const headers = { ...res.getHeaders(), ... {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    }};

    res.startTime('generator', 'Generator Time');
    res.writeHead(200, headers);

    async function* generate() {
      const arrayOfObjects = [
        { id: "001", name: "Item A" },
        { id: "002", name: "Item B" },
        { id: "003", name: "Item C" },
        { id: "004", name: "Item D" },
        { id: "005", name: "Item E" },
        { id: "006", name: "Item F" },
        { id: "007", name: "Item G" },
        { id: "008", name: "Item H" },
      ];
  
      while (arrayOfObjects.length > 0) {
        yield await asyncDelay(() => arrayOfObjects.shift(), 500);
      }
    }
  
    const readable_three = Readable.from(generate());
  
    readable_three.on("data", (chunk) => {
      res.write(`${JSON.stringify(chunk)}`);
    })
  
    readable_three.on("end", () => {
      console.log("Generator Done");
      res.endTime('generator');
      // res.setMetric('generator', 5000, 'Generator Time');
      res.end();
    });
    
};

const readFromCSVStream = async (res: Response) => {
  const readStream = fs.createReadStream('./files/data.csv');

  res.writeHead(200, { ...res.getHeaders(), ... {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",}});

  const parser = parse({ columns: true });
  
 
  const readable = Readable.from(readStream.pipe(parser));

  let bufferring = "";
  readable.on("data", (chunk) => {
    const data = `${JSON.stringify(chunk)}#`;
    if (Buffer.from(data).length > 10000) {
      res.write(bufferring);
      bufferring = "";
    } else {
      bufferring += data;
    }
  })

  readable.on("end", () => {
    res.write(bufferring);
    console.log("CSV Done!");
    res.end();
  });
  
};


export {
    readFromStream,
    readFromCSVStream
}