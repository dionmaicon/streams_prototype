import { Readable } from "stream";
import { Response } from "express";
import { asyncDelay } from "./utils";

const readFromStream = async (res: Response) => {

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });

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
        yield await asyncDelay(() => arrayOfObjects.shift(), 1000);
      }
    }
  
    const readable_three = Readable.from(generate());
  
    readable_three.on("data", (chunk) => {
      res.write(`${JSON.stringify(chunk)}`);
    })
  
    readable_three.on("end", () => {
      console.log("Done");
      res.end();
    });
    
};


export {
    readFromStream
}