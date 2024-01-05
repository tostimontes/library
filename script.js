function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}
// Add sorting functionality

const myLibrary = [];
const libraryTitleNames = [];
const addBookButton = document.getElementById("add_new_book");
const dialog = document.querySelector("#book_form_dialog");
const form = document.querySelector("#book_form");
const closeDialogButton = document.querySelector("#close_dialog");
const submitBook = document.querySelector("#form_submit");
const libraryUI = document.querySelector(".library");
const bookList = document.querySelector(".book_list");
closeDialogButton.addEventListener("click", () => {
  dialog.close();
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
});

addBookButton.addEventListener("click", () => {
  dialog.showModal();
});

submitBook.addEventListener("click", () => {
  const newTitle = document.getElementById("title").value;
  const newAuthor = document.getElementById("author").value;
  const newPages = document.getElementById("pages").value;
  let newRead = document.getElementById("read").checked;

  const newBook = new Book(newTitle, newAuthor, newPages, newRead);
  myLibrary.push(newBook);
  libraryTitleNames.push(newTitle);
  createBookCard(newBook);
  clearForm();
  dialog.close();
});
// HTML Book Card creation
function createBookCard(book) {
  const bookCard = document.createElement("div");
  bookCard.classList.add("card");
  bookCard.setAttribute("id", book.title.split(" ").join(""));
  const removeButton = document.createElement("button");
  removeButton.classList.add("close_button");
  removeButton.setAttribute("title", "Remove book from library")
  removeButton.textContent = "X";
  const bookTitle = document.createElement("h2");
  bookTitle.classList.add("book_title");
  bookTitle.textContent = book.title;
  const bookAuthor = document.createElement("h3");
  bookAuthor.classList.add("book_author");
  bookAuthor.textContent = book.author;
  const bookPages = document.createElement("p");
  bookPages.classList.add("book_pages");
  bookPages.textContent = `${book.pages} pages`;
  const bookRead = document.createElement("button");
  bookRead.classList.add("read_status");
  bookRead.setAttribute("value", book.read);
  book.read
    ? (bookRead.textContent = "Read")
    : (bookRead.textContent = "Not read yet");
  bookCard.append(removeButton, bookTitle, bookAuthor, bookPages, bookRead);
  updateLibraryUI(bookCard);
}

function updateLibraryUI(card) {
  libraryUI.appendChild(card);
  updateNavLinks();
}

function updateNavLinks() {
  myLibrary.forEach((book) => {
    const listItem = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.textContent = book.title;
    anchor.setAttribute("href", `#${book.title.split(" ").join("")}`);
    anchor.classList.add("nav_link");
    listItem.appendChild(anchor);
    bookList.appendChild(listItem);
  });
}
// TODO: make myLibrary array update (or create a new filtered one), when filtered and update the navLinks accordingly
// TODO: event listener for remove button -- should also change mylibrary array: PUT LISTENER IN .library WHICH DELEGATES TO ANY REMOVE BUTTON
// TODO: event listener for toggle un/read
// TODO: filters (a. #pages, b. author(create list dynamically), c. read status)
// TODO: search bar ****
// TODO: edit button that pops dialog with same information, should rewrite object in library

function clearForm() {
  document.querySelector("#title").value = "";
  document.querySelector("#author").value = "";
  document.querySelector("#pages").value = null;
  document.querySelector("#read").checked = false;
}

const exampleBook = {
  title: "Example Title",
  author: "Author Smith",
  pages: 295,
  read: false,
};


// Card img automatically search for google images and return first image as card background

// Remove, edit and un/read toggle buttons within cards
