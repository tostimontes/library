// EDITION VARIABLES
let bookInEdition;
let bookInEditionIndex;
let editMode = false;

function Book(title = "Unknown", author = "Unknown", pages = 0, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function Library() {
  this.books = [];

  this.addNewBook = (title, author, pages, read) => {
    if (editMode) {
      // TODO: editing fine, just add automatic sort to navlinks and authordropdown in updateUI
      this.removeBook(bookInEditionIndex);
    }
    const newBook = new Book(title, author, pages, read);
    this.books.push(newBook);
    updateUI(this.books);
    clearForm();
    dialog.close();
    editMode = false;
  };

  this.removeBook = (index) => {
    // TODO: if only author then restar UI with al authors
    this.books.splice(index, 1);
    updateUI(this.books);
  };
}
// GLOBAL VARIABLES
const myLibrary = new Library();

// SELECTORS

// Book addition selectors
const addBookButton = document.getElementById("add_new_book");
const submitBook = document.querySelector("#form_submit");
const dialog = document.querySelector("#book_form_dialog");
const form = document.querySelector("#book_form");
const libraryUI = document.querySelector(".library");

// Navigation selector
const bookList = document.querySelector(".book_list");

// Filter selectors
const filtersPanel = document.querySelector(".controls");
const authorFilterDropdown = document.querySelector("#author_list");
const minInput = document.querySelector("#min_pages");
const maxInput = document.querySelector("#max_pages");
const readFilter = document.querySelector("#read_or_not_filter");
const sortDropdown = document.querySelector("#sort_options");
const resetFiltersButton = document.querySelector("#reset_filters");

// Edition selectors
const editDialog = document.querySelector("#edit_dialog");
const submitEdit = document.querySelector("#edit_submit");
const closeDialogButton = document.querySelector("#close_dialog");

// LISTENERS

addBookButton.addEventListener("click", () => {
  dialog.showModal();
});

// SUBMIT BOOK listener
submitBook.addEventListener("click", () => {
  const newTitle = document.getElementById("title").value;
  const newAuthor = document.getElementById("author").value;
  const newPages = document.getElementById("pages").value;
  let newRead = document.getElementById("read").checked;

  myLibrary.addNewBook(newTitle, newAuthor, newPages, newRead);
});

// EDIT button listener
libraryUI.addEventListener("click", (e) => {
  const editDiv = e.target.closest(".edit_button");
  const cardInEdition = editDiv.parentElement;

  // fetch book reference from library and save in case there's edition
  if (editDiv) {
    editMode = true;
    bookInEdition = myLibrary.books.find(
      (book) => book.title === cardInEdition.dataset.value
    );
    bookInEditionIndex = myLibrary.books.findIndex(
      (book) => book.title === cardInEdition.dataset.value
    );

    dialog.showModal();

    // populate form with old values
    document.getElementById("title").value =
      cardInEdition.querySelector(".book_title").textContent;
    document.getElementById("author").value =
      cardInEdition.querySelector(".book_author").textContent;
    document.getElementById("pages").value =
      cardInEdition.querySelector(".book_pages").dataset.value;
    cardInEdition.querySelector(".read_status").dataset.value === "true"
      ? (document.getElementById("read").checked = true)
      : (document.getElementById("read").checked = false);
  }
});

// REMOVE button listener
libraryUI.addEventListener("click", (e) => {
  if (e.target.matches(".close_button")) {
    const indexForRemoval = myLibrary.books.findIndex(
      (book) => book.title === e.target.parentElement.dataset.value
    );
    myLibrary.removeBook(indexForRemoval);
  }
});

// FILTER listener
filtersPanel.addEventListener("change", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
    checkFilters();
  }
});

resetFiltersButton.addEventListener("click", resetFilters);

closeDialogButton.addEventListener("click", () => {
  clearForm();
  dialog.close();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dialog.hasAttribute("open")) {
    clearForm();
    dialog.close();
  }
});

// TODO: un/read toggle

// GLOBAL FUNCTIONS

function updateUI(library) {
  libraryUI.innerHTML = "";
  bookList.innerHTML = "";

  // Get filter settings before erasing
  const filterSettings = {
    authorFilterValue: authorFilterDropdown.value,
    minPages: minInput.value,
    maxPages: maxInput.value,
    readFilterValue: readFilter.value,
    sortingParameter: sortDropdown.value,
  };
  authorFilterDropdown.innerHTML = "";
  for (const book of library) {
    createBookCard(book);
  }

  // Set filters again
  authorFilterDropdown.value = filterSettings.authorFilterValue;
  minInput.value = filterSettings.minPages;
  maxInput.value = filterSettings.maxPages;
  readFilter.value = filterSettings.readFilterValue;
  sortDropdown.value = filterSettings.sortingParameter;
  sortAuthors();
  checkFilters();
}

function createBookCard(book) {
  const bookCard = document.createElement("div");
  bookCard.classList.add("card");
  bookCard.setAttribute("id", book.title.split(" ").join(""));
  bookCard.setAttribute("data-value", book.title);
  const removeButton = document.createElement("button");
  removeButton.classList.add("close_button");
  removeButton.setAttribute("title", "Remove book from library");
  removeButton.textContent = "X";
  const editButton = document.createElement("button");
  editButton.classList.add("edit_button");
  editButton.setAttribute("title", "Edit book info");
  editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>book-edit</title><path d="M19.39 10.74L11 19.13V22H6C4.89 22 4 21.11 4 20V4C4 2.9 4.89 2 6 2H7V9L9.5 7.5L12 9V2H18C19.1 2 20 2.89 20 4V10.3C19.78 10.42 19.57 10.56 19.39 10.74M13 19.96V22H15.04L21.17 15.88L19.13 13.83L13 19.96M22.85 13.47L21.53 12.15C21.33 11.95 21 11.95 20.81 12.15L19.83 13.13L21.87 15.17L22.85 14.19C23.05 14 23.05 13.67 22.85 13.47Z" /></svg>`;
  const bookTitle = document.createElement("h2");
  bookTitle.classList.add("book_title");
  bookTitle.textContent = book.title;
  const bookAuthor = document.createElement("h3");
  bookAuthor.classList.add("book_author");
  bookAuthor.textContent = book.author;
  if (
    !authorFilterDropdown.contains(
      authorFilterDropdown.querySelector(`option[value="${book.author}"]`)
    )
  ) {
    const authorOption = document.createElement("option");
    authorOption.textContent = book.author;
    authorOption.setAttribute("value", `${book.author}`);
    authorFilterDropdown.appendChild(authorOption);
  }
  const bookPages = document.createElement("p");
  bookPages.classList.add("book_pages");
  bookPages.setAttribute("data-value", book.pages);
  bookPages.textContent = `${book.pages} pages`;
  const bookRead = document.createElement("button");
  bookRead.classList.add("read_status");
  bookRead.setAttribute("data-value", book.read);
  bookRead.setAttribute("title", "Toggle read status");
  book.read
    ? (bookRead.textContent = "Read")
    : (bookRead.textContent = "Not read yet");
  bookCard.append(
    removeButton,
    editButton,
    bookTitle,
    bookAuthor,
    bookPages,
    bookRead
  );
  libraryUI.appendChild(bookCard);
  adjustFontSizeToFit(bookCard.querySelector(".book_title"));

  // Create nav link
  const listItem = document.createElement("li");
  const anchor = document.createElement("a");
  anchor.textContent = bookCard.children[2].textContent;
  anchor.setAttribute(
    "href",
    `#${bookCard.children[2].textContent.split(" ").join("")}`
  );
  anchor.classList.add("nav_link");
  listItem.appendChild(anchor);
  bookList.appendChild(listItem);

  // listener on save button
  // form input info to Book constructor and .push to library
  // WHENEVER A BOOK IS PUSHED ==>>> updateUI
  // erase form
}

function clearForm() {
  document.querySelector("#title").value = "";
  document.querySelector("#author").value = "";
  document.querySelector("#pages").value = null;
  document.querySelector("#read").checked = false;
}
function checkFilters() {
  const cardsInDisplay = document.querySelectorAll(".card");
  const cardsArray = Array.from(cardsInDisplay);
  // Get filter values
  const authorFilterValue = authorFilterDropdown.value;
  const minPages = Number(minInput.value);
  const maxPages = Number(maxInput.value);
  const readFilterValue = readFilter.value;
  const sortingParameter = sortDropdown.value;

  // sort array first
  switch (sortingParameter) {
    case "title ascending":
      cardsArray.sort((a, b) =>
        a
          .querySelector(".book_title")
          .textContent.localeCompare(b.querySelector(".book_title").textContent)
      );
      break;
    case "title descending":
      cardsArray.sort((a, b) =>
        b
          .querySelector(".book_title")
          .textContent.localeCompare(a.querySelector(".book_title").textContent)
      );
      break;
    case "author ascending":
      cardsArray.sort((a, b) =>
        a
          .querySelector(".book_author")
          .textContent.localeCompare(
            b.querySelector(".book_author").textContent
          )
      );
      break;
    case "author descending":
      cardsArray.sort((a, b) =>
        b
          .querySelector(".book_author")
          .textContent.localeCompare(
            a.querySelector(".book_author").textContent
          )
      );
      break;
    case "pages ascending":
      cardsArray.sort(
        (a, b) =>
          a.querySelector(".book_pages").dataset.value -
          b.querySelector(".book_pages").dataset.value
      );
      break;
    case "pages descending":
      cardsArray.sort(
        (a, b) =>
          b.querySelector(".book_pages").dataset.value -
          a.querySelector(".book_pages").dataset.value
      );
      break;
    default:
      break;
  }

  // apply filters
  for (const card of cardsArray) {
    if (
      (card.querySelector(".book_author").textContent !== authorFilterValue &&
        authorFilterValue !== "All authors") ||
      (card.querySelector(".book_pages").dataset.value < minPages &&
        minPages !== 0) ||
      (card.querySelector(".book_pages").dataset.value > maxPages &&
        maxPages !== 0) ||
      (readFilterValue !== "default" &&
        readFilterValue !== card.querySelector(".read_status").dataset.value)
    ) {
      card.style.display = "none";
      bookList.querySelector(
        `a[href="#${card.getAttribute("id")}"]`
      ).parentElement.style.display = "none";
    } else {
      card.style.display = "block";
      bookList.querySelector(
        `a[href="#${card.getAttribute("id")}"]`
      ).parentElement.style.display = "block";
    }
  }
}

function resetFilters() {
  authorFilterDropdown.value = "All authors";
  minInput.value = "";
  maxInput.value = "";
  readFilter.value = "default";
  checkFilters();
}

function adjustFontSizeToFit(container) {
  let contentWidth = container.scrollWidth;
  let containerWidth = container.clientWidth;

  while (contentWidth > containerWidth && container.style.fontSize !== "0px") {
    let currentFontSize = parseFloat(
      window.getComputedStyle(container, null).getPropertyValue("font-size")
    );
    container.style.fontSize = currentFontSize - 1 + "px";
    contentWidth = container.scrollWidth;
  }
}

function sortAuthors() {
  const authorFilterOptions = authorFilterDropdown.querySelectorAll("option");
  const authorFilterOptionsArray = Array.from(authorFilterOptions);
  authorFilterOptionsArray.sort((a, b) =>
    a.innerText.localeCompare(b.innerText)
  );
  authorFilterDropdown.innerHTML = "";
  const allAuthorsOption = document.createElement("option");
  allAuthorsOption.setAttribute("data-value", "All authors");
  allAuthorsOption.textContent = "All authors";
  authorFilterDropdown.appendChild(allAuthorsOption);
  for (const option of authorFilterOptionsArray) {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("data-value", `${option.innerText}`);
    optionElement.textContent = option.innerText;
    authorFilterDropdown.appendChild(optionElement);
  }
}

// Example initialization

const exampleArray = [
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    pages: 430,
    read: false,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    pages: 281,
    read: true,
  },
  { title: "1984", author: "George Orwell", pages: 328, read: false },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    pages: 180,
    read: true,
  },
  { title: "Moby-Dick", author: "Herman Melville", pages: 720, read: false },
  { title: "Jane Eyre", author: "Charlotte Brontë", pages: 500, read: true },
  {
    title: "Wuthering Heights",
    author: "Emily Brontë",
    pages: 400,
    read: false,
  },
  {
    title: "Great Expectations",
    author: "Charles Dickens",
    pages: 544,
    read: true,
  },
  {
    title: "Little Women",
    author: "Louisa May Alcott",
    pages: 759,
    read: false,
  },
  { title: "Brave New World", author: "Aldous Huxley", pages: 288, read: true },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    pages: 234,
    read: false,
  },
  {
    title: "The Adventures of Huckleberry Finn",
    author: "Mark Twain",
    pages: 366,
    read: true,
  },
  {
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    pages: 430,
    read: true,
  },
  { title: "War and Peace", author: "Leo Tolstoy", pages: 1225, read: false },
  { title: "Anna Karenina", author: "Leo Tolstoy", pages: 864, read: false },
  {
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    pages: 824,
    read: true,
  },
  { title: "The Idiot", author: "Fyodor Dostoevsky", pages: 656, read: true },
  {
    title: "Don Quixote",
    author: "Miguel de Cervantes",
    pages: 992,
    read: false,
  },
  {
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    pages: 417,
    read: true,
  },
  {
    title: "Love in the Time of Cholera",
    author: "Gabriel García Márquez",
    pages: 348,
    read: false,
  },
  { title: "Invisible Man", author: "Ralph Ellison", pages: 581, read: true },
  { title: "Ulysses", author: "James Joyce", pages: 730, read: false },
  { title: "Dubliners", author: "James Joyce", pages: 224, read: true },
  {
    title: "A Portrait of the Artist as a Young Man",
    author: "James Joyce",
    pages: 299,
    read: false,
  },
  {
    title: "Madame Bovary",
    author: "Gustave Flaubert",
    pages: 329,
    read: true,
  },
  { title: "Lolita", author: "Vladimir Nabokov", pages: 336, read: false },
  { title: "Pnin", author: "Vladimir Nabokov", pages: 208, read: true },
  { title: "Pale Fire", author: "Vladimir Nabokov", pages: 315, read: false },
  { title: "Middlemarch", author: "George Eliot", pages: 904, read: true },
  { title: "Rebecca", author: "Daphne du Maurier", pages: 448, read: false },
  { title: "Frankenstein", author: "Mary Shelley", pages: 280, read: true },
  { title: "Dracula", author: "Bram Stoker", pages: 418, read: false },
  {
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    pages: 254,
    read: true,
  },
  {
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
    pages: 544,
    read: false,
  },
  { title: "Oliver Twist", author: "Charles Dickens", pages: 554, read: true },
  {
    title: "David Copperfield",
    author: "Charles Dickens",
    pages: 882,
    read: false,
  },
  { title: "Bleak House", author: "Charles Dickens", pages: 1017, read: true },
  { title: "Hard Times", author: "Charles Dickens", pages: 352, read: false },
  { title: "The Stranger", author: "Albert Camus", pages: 123, read: true },
  { title: "The Plague", author: "Albert Camus", pages: 308, read: false },
  { title: "The Fall", author: "Albert Camus", pages: 147, read: true },
  { title: "Fahrenheit 451", author: "Ray Bradbury", pages: 158, read: false },
  {
    title: "The Martian Chronicles",
    author: "Ray Bradbury",
    pages: 222,
    read: true,
  },
  { title: "Dune", author: "Frank Herbert", pages: 688, read: false },
];

function initializeExampleUI(array) {
  for (const book of array) {
    myLibrary.addNewBook(book.title, book.author, book.pages, book.read);
  }
}

initializeExampleUI(exampleArray);
