const socket = io.connect();

const chat = document.querySelector('#chat');

chat.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.querySelector('#mail').value;
    const name = document.querySelector('#name').value;
    const lastname = document.querySelector('#lastname').value;
    const age = document.querySelector('#age').value;
    const alias = document.querySelector('#alias').value;
    const avatar = document.querySelector('#avatar').value;
    const text = document.querySelector('#message').value;

    socket.emit('new-message', { author: { id, name, lastname, age, alias, avatar }, text });

    document.querySelector('#message').value = "";
});

const showMessages = (messages) => {
    const html = messages.messages.map((m) => {
        return (`<p class="email">${m.author.id}:</p>
                <p class="mensaje">${m.text}</p>
                <img class="img-fluid" alt="avatar-del-usuario" src="${m.author.avatar}">`);
    }).join('');

    document.querySelector('#savedMessage').innerHTML = html;
};

const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAtributte: 'id' });

const schemaMessage = new normalizr.schema.Entity('message', {
    author: schemaAuthor
});

const schemaMessages = new normalizr.schema.Entity('messages', {
    messages: [schemaMessage]
});

const percent = (normalizedData, denormalizedData) => {
    const normalized = JSON.stringify(normalizedData).length;
    const denormalized = JSON.stringify(denormalizedData).length;
    const average = Math.round(normalized * 100 / denormalized);

    document.querySelector('#average').innerHTML = `Compresión: ${average}%`;
}

socket.on('messages', data => {
    const denormalizedData = normalizr.denormalize(data.result, schemaMessages, data.entities);
    percent(data, denormalizedData);
    showMessages(denormalizedData);
});