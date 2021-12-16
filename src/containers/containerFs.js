const fs = require('fs');

class ContainerFs {
    constructor(file) {
        this.file = file;
    }

    async getAll() {
        try {
            const content = await fs.promises.readFile(`${this.file}`, 'utf-8');
            const list = JSON.parse(content);
            return list;
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    async save(element) {
        try {
            const content = await fs.promises.readFile(`${this.file}`, 'utf-8')

            let elements = [];

            if (content === "") {
                element.id = String(1);
                elements.push(element);
            } else {
                const list = JSON.parse(content);

                element.id = String(list.length + 1);
                list.push(element);
                elements = list;
            }

            const listString = JSON.stringify(elements, null, 2);
            await fs.promises.writeFile(`${this.file}`, listString);
            return elements;
        } catch (error) {
            console.error('Error: ', error);
        }
    }
}

module.exports = ContainerFs;