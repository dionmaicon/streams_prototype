import {
    Worker,
    isMainThread,
    MessageChannel,
    workerData
} from 'worker_threads';

if (isMainThread) {
    const { port1, port2 } = new MessageChannel();
    const worker = new Worker(__filename, {
        workerData: {
            port: port2
        },
        transferList: [port2]
    });
    
    port1.on('message', msg => {
        port1.postMessage(`MAIN[${msg}]`);
    });
} else {
    const { port } = workerData;
    port.on('message', ( msg: any )=> {
        console.log('We got a message from the main thread:', msg);
    });
    
    port.postMessage('Hello, World!');
}