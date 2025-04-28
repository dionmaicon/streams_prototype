**README**

# Multithreaded Data Streamer

This project demonstrates a simple data streaming system using Node.js and Fetch API. The server generates data and sends it as an event stream to the client.

## Server-Side Code

The server-side code is written in TypeScript using the Express framework. It has three routes:

* `/stream`: Generates random numbers and sends them as an event stream to the client.
* `/stream-csv`: Reads a CSV file and sends its contents as an event stream to the client.
* `/stream-multithread`: Uses Web Workers to generate data in parallel.

## Client-Side Code

The client-side code is written in Vanilla JavaScript. It establishes a connection with the server and listens for incoming data events. When data arrives, it appends the new data to an HTML list on the page.

## Requirements

* Node.js 14 or higher
* TypeScript 4 or higher
* Express 4 or higher
* Webpack (optional)

## Installation

1. Clone the repository: `git clone https://github.com/dionmaicon/streams_prototype.git`

<!-- Frontend -->
2. Install frontend dependencies: `cd frontend && npm install` or `cd frontend && yarn install`
3. Start the frontend: `npm run dev`;


<!-- backend -->
4. Install backend dependencies: `cd backend && npm install` or `cd backend && yarn install`
5. Start the server: `npn run dev`
6. Open a web browser and navigate to `http://localhost:4000`


## Usage

1. Click on one of the buttons (CSV, Generator, Multithread) to stream data from the corresponding route.
2. The client will establish a WebSocket connection with the server and receive incoming data events.
3. Each time new data arrives, it will be appended to an HTML list on the page.

Note: This is a basic example of multithreading in Node.js using Web Workers, and it may not be suitable for large-scale use cases due to the complexity of Web Workers and event streams.