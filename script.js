function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;

  };
// Add sorting functionality

const addBookButton = document.getElementById("add_new_book");
const dialog = document.querySelector("#book_form_dialog");
const form = document.querySelector("#book_form");
const closeDialogButton = document.querySelector("#close_dialog");
const submitBook = document.querySelector("#form_submit");
closeDialogButton.addEventListener("click", () => {
  dialog.close();
});


form.addEventListener('submit', function(event) {
  event.preventDefault();
});

submitBook.addEventListener("click", () => {
  const newTitle = document.getElementById("title").value;
  const newAuthor = document.getElementById("author").value;
  const newPages = document.getElementById("pages").value;
  let newRead = document.getElementById("read").checked;

  createBookCard(newTitle, newAuthor, newPages, newRead);
})
// HTML Book Card creation
function createBookCard(title, author, pages, read) {
  const newBook = new Book(title, author, pages, read);
  const bookCard = document.createElement("div");
  bookCard.classList.add("card");
  const bookTitle = document.createElement("h2");
  bookTitle.classList.add("book_title");
  bookTitle.textContent = newBook.title;
  const bookAuthor = document.createElement("h3");
  bookAuthor.classList.add("book_author");
  bookAuthor.textContent = newBook.author;
  const bookPages = document.createElement("p");
  bookPages.classList.add("book_pages");
  bookPages.textContent = newBook.pages;
  const bookRead = document.createElement("button");
  bookRead.classList.add("read_status");
  bookRead.setAttribute("value", newBook.read)
  bookRead.textContent = newBook.read;
  bookCard.append(bookTitle, bookAuthor, bookPages, bookRead)
  console.log(bookCard);
}


const exampleBook = {
    title: "Example Title",
    author: "Author Smith",
    pages: 295,
    read: false
}

const myLibrary = [];


// Loop through library function

// NEW BOOK button: either form or dialog with each form control or input
// Card img automatically search for google images and return first image as card background

// Remove, edit and un/read toggle buttons within cards



