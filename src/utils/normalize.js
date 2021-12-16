const { normalize, schema } = require('normalizr');

const schemaAuthor = new schema.Entity('author', {}, { idAtributte: 'id' });

const schemaMessage = new schema.Entity('message', {
    author: schemaAuthor
});

const schemaMessages = new schema.Entity('messages', {
    messages: [schemaMessage]
});

const normalizeMessages = (messages) => normalize({ id: 'mensajes', messages }, schemaMessages);

module.exports = {
    normalizeMessages
};