function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function () {
        let readOrNot;
        this.read === true ? readOrNot = 'read': readOrNot = 'not read yet'; 
        return `${this.title} by ${this.author}, ${this.pages} pages, ${readOrNot}`
    }
}

const brainEnergy = new Book("Brain Energy", "Chris Palmer", 345, false);

console.log(brainEnergy.info());

console.log(brainEnergy);