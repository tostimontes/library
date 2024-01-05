function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    let readOrNot;
    this.read === true ? (readOrNot = "read") : (readOrNot = "not read yet");
    return `${this.title} by ${this.author}, ${this.pages} pages, ${readOrNot}`;
    //   toggle read func
    }
  };

// Add sorting functionality
const addBookButton = document.querySelector("#add_new_book");
addBookButton.addEventListener("click", addBookToLibrary);
const dialog = document.querySelector("#book_form_dialog");
const closeDialogButton = document.querySelector("#close_dialog");
closeDialogButton.addEventListener("click", () => {
    dialog.close();
});

const exampleBook = {
    title: "Example Title",
    author: "Author Smith",
    pages: 295,
    read: false
}

const myLibrary = [];

myLibrary.push(exampleBook);


function addBookToLibrary() {
    dialog.showModal();
    event.preventDefault();
}

// Loop through library function

// NEW BOOK button: either form or dialog with each form control or input
// Card img automatically search for google images and return first image as card background

// Remove, edit and un/read toggle buttons within cards



