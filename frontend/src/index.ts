import { fromEvent, scan } from 'rxjs';

const loadFromCSV = async (event: Event ) => {
    
    // block button until the process is done
    let button = event.target as HTMLButtonElement;
    button.disabled = true;
    
    let listItems = document.querySelector('#list-csv-items');
    listItems.className = 'container-aside';
    
    let remaining = "";
    const entries: any[] = [];
    fetch('http://localhost:3000/stream-csv').then((response) => {
        if (response.ok && response.body) {
            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

            const readStream = (): Promise<void> => 
                reader.read().then(({
                    value,
                    done
                }) => {
                    
                    if (done) {
                        reader.cancel();
                        console.log(`Total read: ${entries.length}`);
                        button.disabled = false;
                        return Promise.resolve();
                    }
                    
                    remaining += value;

                    const tokens = remaining.split("#");
                    
                    remaining = "";
                    tokens.forEach(token => {
                        try {
                            const data = JSON.parse(token);
                            entries.push(data);
                            const item = document.createElement('div');
                            item.textContent = `Code: [${data.Series_reference}] - ${data.Data_value}`;
                            item.classList.add('list-item');
                            listItems.appendChild(item)

                        } catch (error) {
                            remaining += token;
                            return;
                        }
                    });

                    return readStream();
                });
            return readStream();
        } else {
            return Promise.reject(response);
        }
    });
    
}

const loadFromGenerators = async (event: Event) => {
    let button = event.target as HTMLButtonElement;
    button.disabled = true;
    let listItems = document.querySelector('#list-generator-items');
    listItems.className = 'container-aside';
    
    fetch('http://localhost:3000/stream').then((response) => {
        if (response.ok && response.body) {
            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

            const readStream = (): Promise<void> => 
                reader.read().then(({
                    value,
                    done
                }) => {
                    if (done) {
                        reader.cancel();
                        button.disabled = false;
                        return Promise.resolve();
                    }
                    
                    try {
                        const data = JSON.parse(value);
                        const item = document.createElement('div');
                        item.textContent = `Code: [${data.id}] - ${data.name}`;
                        item.classList.add('list-item');
                        listItems.appendChild(item)

                    } catch (error) {
                        console.info("Generator error:", error.message);
                        console.log("Value:", value);
                    }

                    return readStream();
                });
            return readStream();
        } else {
            return Promise.reject(response);
        }
    });
}

const loadFromMultithread = async (event: Event) => {
    let button = event.target as HTMLButtonElement;
    const inputA = document.getElementById("inputA") as HTMLInputElement;
    const inputB = document.getElementById("inputB") as HTMLInputElement;
    if (!inputA.value || !inputB.value) {
        alert("required fields");
        return;
    }
    button.disabled = true;

    let listItems = document.querySelector('#list-multithread-items');
    listItems.innerHTML = "";
    listItems.className = 'container-aside';
    const sumAllEl = document.getElementById("sumAll");
    sumAllEl.innerHTML = "loading...";
    const processed = {
        sumAllOperations: 0,
    }

    fetch(`http://localhost:3000/stream-multithread?a=${inputA.value}&b=${inputB.value}`).then((response) => {
        if (response.ok && response.body) {
            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

            const readStream = (): Promise<void> => 
                reader.read().then(({
                    value,
                    done
                }) => {
                    if (done) {
                        reader.cancel();
                        button.disabled = false;
                        return Promise.resolve();
                    }
                    
                    try {
                        const data = JSON.parse(value);
                        let operation = "";
                        
                        data?.forEach((entry: { thread: number, operation: string, value: number }) => {
                            operation = entry.operation
                            const item = document.createElement('div');
                            item.textContent = `Thread: ${entry.thread} - Operation: [${entry.operation}] - ${entry.value}`;
                            item.classList.add('list-item');
                            listItems.appendChild(item)
                        })

                        const sumAll = data?.map((entry: {value : number }) => entry.value).reduce((a: number, b:number ) => a + b , 0);
                        processed.sumAllOperations += sumAll;
                        sumAllEl.innerText = processed.sumAllOperations + "";

                    } catch (error) {
                        console.info("Generator error:", error.message);
                        console.log("Value:", value);
                    } finally {
                        button.disabled = false;
                    }

                    return readStream();
                });
            return readStream();
        } else {
            return Promise.reject(response);
        }
    });
}


const appendEventListeners = () => {
    let csvButton = document.querySelector('#csv-button');
    let generatorButton = document.querySelector('#generator-button');
    let multithreadButton = document.querySelector("#multithread-button");
    
    csvButton.addEventListener('click', loadFromCSV);
    generatorButton.addEventListener('click', loadFromGenerators);
    multithreadButton.addEventListener("click", loadFromMultithread);
}

const init = () => {
    appendEventListeners();
}

init();
