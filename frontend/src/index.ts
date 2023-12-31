const init = async () => {
    
    let listItems = document.querySelector('#list-items');
    
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
                        return Promise.resolve();
                    }
                    
                    const data = JSON.parse(value);
                    const item = document.createElement('div');
                    item.textContent = `Code: [${data.id}] - ${data.name}`;
                    item.classList.add('list-item');
                    listItems.appendChild(item)

                    return readStream();
                });
            return readStream();
        } else {
            return Promise.reject(response);
        }
    });
}

init();