function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

let editMode = false;
let bookInEdition;
let cardInEdition;
let bookTitleInEdition;
let navLinkInEdition;
let authorOptionInEdition;
const myLibraryArray = [];
const libraryTitleNames = [];
const addBookButton = document.getElementById("add_new_book");
const dialog = document.querySelector("#book_form_dialog");
const editDialog = document.querySelector("#edit_dialog");
const submitEdit = document.querySelector("#edit_submit");
const form = document.querySelector("#book_form");
const closeDialogButton = document.querySelector("#close_dialog");
const submitBook = document.querySelector("#form_submit");
const libraryUI = document.querySelector(".library");
const bookList = document.querySelector(".book_list");
const authorFilterDropdown = document.querySelector("#author_list");
const minInput = document.querySelector("#min_pages");
const maxInput = document.querySelector("#max_pages");
const readFilter = document.querySelector("#read_or_not_filter");
const sortDropdown = document.querySelector("#sort_options");
const resetFiltersButton = document.querySelector("#reset_filters");

closeDialogButton.addEventListener("click", () => {
  clearForm();
  dialog.close();
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
});
// add book listener
addBookButton.addEventListener("click", () => {
  dialog.showModal();
});

// edit button listener
libraryUI.addEventListener("click", (e) => {
  const editDiv = e.target.closest(".edit_button");
  if (editDiv) {
    editDialog.showModal();
    fillEditDialog(editDiv.parentElement);
    bookInEdition = myLibraryArray.find(
      (book) => book.title === editDiv.parentElement.dataset.value
    );
    bookTitleInEdition = libraryTitleNames.find(
      (title) => title === editDiv.parentElement.dataset.value
    );
    cardInEdition = editDiv.parentElement;
    navLinkInEdition = bookList.querySelector(
      `a[href="#${cardInEdition.getAttribute("id")}"`
    );
    authorOptionInEdition = authorFilterDropdown.querySelector(
      `option[value="${bookInEdition.author}"]`
    );
  }
});

// read/unread toggle
document.addEventListener("click", (e) => {
  if (e.target.matches(".read_status")) {
    toggleReadStatus(e.target);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dialog.hasAttribute("open")) {
    clearForm();
    dialog.close();
  }
});

libraryUI.addEventListener("click", (e) => {
  if (e.target.matches(".close_button")) {
    removeBookFromLibrary(e.target.parentElement);
  }
});

// new book submit
submitBook.addEventListener("click", () => {
  const newTitle = document.getElementById("title").value;
  const newAuthor = document.getElementById("author").value;
  const newPages = document.getElementById("pages").value;
  let newRead = document.getElementById("read").checked;

  const newBook = new Book(newTitle, newAuthor, newPages, newRead);
  myLibraryArray.push(newBook);
  libraryTitleNames.push(newTitle);
  createBookCard(newBook);
  clearForm();
  dialog.close();
});

submitEdit.addEventListener("click", () => {
  editBookCard(cardInEdition);
  adjustFontSizeToFit(cardInEdition.querySelector(".book_title"));
  clearEditForm();
  editDialog.close();
});
// HTML Book Card creation
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
  addBookToLibrary(bookCard);
}

function editBookCard(card) {
  card.dataset.value = editDialog.querySelector("#edit_title").value;
  bookTitleInEdition = editDialog.querySelector("#edit_title").value;
  bookInEdition.title = editDialog.querySelector("#edit_title").value;
  bookInEdition.author = editDialog.querySelector("#edit_author").value;
  bookInEdition.pages = editDialog.querySelector("#edit_pages").value;
  bookInEdition.read = editDialog.querySelector("#edit_read").checked;
  // set edited nav link
  card.setAttribute("href", `#${bookInEdition.title.split(" ").join("")}`);
  navLinkInEdition.setAttribute("id", bookInEdition.title.split(" ").join(""));
  navLinkInEdition.textContent = bookInEdition.title;
  // set card's edited contents
  card.querySelector(".book_title").textContent = bookInEdition.title;
  card.querySelector(".book_author").textContent = bookInEdition.author;
  authorOptionInEdition.textContent = bookInEdition.author;
  card.querySelector(".book_pages").dataset.value = bookInEdition.pages;
  card.querySelector(".book_pages").textContent =
    `${bookInEdition.pages} pages`;
  card.querySelector(".read_status").dataset.value = bookInEdition.read;
  card.querySelector(".read_status").textContent = bookInEdition.title;
  bookInEdition.read
    ? (card.querySelector(".read_status").textContent = "Read")
    : (card.querySelector(".read_status").textContent = "Not read yet");
  // if any filter is set to a value other than default, check whether the edited card should display
  // TODO: maxinputvalue should not run if nothing selected
  // FIX: author change
  if (
    authorFilterDropdown.value !== bookInEdition.author ||
    Number(minInput.value) > bookInEdition.pages ||
    (Number(maxInput.value) < bookInEdition.pages &&
      Number(maxInput.value) === 0) ||
    (readFilter.value !== "default" &&
      readFilter.value !== `${bookInEdition.read}`)
  ) {
    card.style.display = "none";
  }
}

// TODO: additive filters
function addBookToLibrary(card) {
  libraryUI.appendChild(card);
  adjustFontSizeToFit(card.querySelector(".book_title"));
  addNavLink(card);
}

function removeBookFromLibrary(card) {
  const indexForRemoval = myLibraryArray.findIndex(
    (book) => book.title === card.dataset.value
  );
  authorFilterDropdown.removeChild(
    authorFilterDropdown.querySelector(
      `option[value="${myLibraryArray[indexForRemoval].author}"]`
    )
  );
  myLibraryArray.splice(indexForRemoval, 1);
  libraryTitleNames.splice(indexForRemoval, 1);
  libraryUI.removeChild(card);
  removeNavLink(card);
}

function addNavLink(card) {
  const listItem = document.createElement("li");
  const anchor = document.createElement("a");
  anchor.textContent = card.children[2].textContent;
  anchor.setAttribute(
    "href",
    `#${card.children[2].textContent.split(" ").join("")}`
  );
  anchor.classList.add("nav_link");
  listItem.appendChild(anchor);
  bookList.appendChild(listItem);
}

function removeNavLink(card) {
  const linkToRemove = bookList.querySelector(
    `a[href="#${card.getAttribute("id")}"`
  );

  if (linkToRemove) {
    linkToRemove.parentElement.remove();
  }
}

function toggleReadStatus(button) {
  const readStatusInMyLibrary = myLibraryArray.find(
    (book) => book.title === `${button.parentElement.dataset.value}`
  );
  if (button.dataset.value === "true") {
    button.dataset.value = "false";
    readStatusInMyLibrary.read = false;
    button.textContent = "Not read yet";
  } else {
    button.dataset.value = "true";
    button.textContent = "Read";
    readStatusInMyLibrary.read = true;
  }
}

function fillEditDialog(card) {
  editDialog.querySelector("#edit_title").value =
    card.querySelector(".book_title").textContent;
  editDialog.querySelector("#edit_author").value =
    card.querySelector(".book_author").textContent;
  editDialog.querySelector("#edit_pages").value =
    card.querySelector(".book_pages").dataset.value;
  card.querySelector(".read_status").dataset.value === "true"
    ? (editDialog.querySelector("#edit_read").checked = true)
    : (editDialog.querySelector("#edit_read").checked = false);
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

// filter listeners
authorFilterDropdown.addEventListener("change", (e) => {
  const cardsInDisplay = document.querySelectorAll(".card");
  const selectedAuthor = e.target.value;
  cardsInDisplay.forEach((card) => {
    if (selectedAuthor === "All authors") {
      card.style.display = "block";
      return;
    }
    card.style.display = "block";
    if (card.querySelector(".book_author").textContent !== selectedAuthor) {
      card.style.display = "none";
    }
  });
});

minInput.addEventListener("input", () => {
  const cardsInDisplay = document.querySelectorAll(".card");
  const minPages = Number(minInput.value);
  cardsInDisplay.forEach((card) => {
    card.style.display = "block";
    if (card.querySelector(".book_pages").dataset.value < minPages) {
      card.style.display = "none";
    }
  });
});

maxInput.addEventListener("input", () => {
  if (maxInput.value === "") {
    return;
  }
  const cardsInDisplay = document.querySelectorAll(".card");
  const maxPages = Number(maxInput.value);
  cardsInDisplay.forEach((card) => {
    card.style.display = "block";
    if (card.querySelector(".book_pages").dataset.value > maxPages) {
      card.style.display = "none";
    }
  });
});

readFilter.addEventListener("change", (e) => {
  const chosenStatus = e.target.value;
  const cardsInDisplay = document.querySelectorAll(".card");
  cardsInDisplay.forEach((card) => {
    card.style.display = "block";
    if (chosenStatus === "default") {
      return;
    }
    if (card.querySelector(".read_status").dataset.value !== chosenStatus) {
      card.style.display = "none";
    }
  });
});

sortDropdown.addEventListener("change", (e) => {
  const chosenSortingOption = e.target.value;
  const cardsInDisplay = document.querySelectorAll(".card");
  const cardsArray = Array.from(cardsInDisplay);
  switch (chosenSortingOption) {
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
  }
  libraryUI.innerHTML = "";
  cardsArray.forEach((card) => {
    libraryUI.appendChild(card);
  });
});

resetFiltersButton.addEventListener("click", () => {
  authorFilterDropdown.value = "All authors";
  minInput.value = "";
  maxInput.value = "";
  readFilter.value = "default";
  sortDropdown.value = "default";
  const cardsInDisplay = document.querySelectorAll(".card");
  cardsInDisplay.forEach((card) => {
    card.style.display = "block";
  });
});

// TODO: update UI (filtered content and sorted order) according to filters in place when cards info changes: page changes, title, read status
// TODO: search bar ****

function clearForm() {
  document.querySelector("#title").value = "";
  document.querySelector("#author").value = "";
  document.querySelector("#pages").value = null;
  document.querySelector("#read").checked = false;
}

function clearEditForm() {
  document.querySelector("#edit_title").value = "";
  document.querySelector("#edit_author").value = "";
  document.querySelector("#edit_pages").value = null;
  document.querySelector("#edit_read").checked = false;
}

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
  array.forEach((book) => {
    const newBook = new Book(book.title, book.author, book.pages, book.read);
    myLibraryArray.push(newBook);
    libraryTitleNames.push(newBook.title);
    createBookCard(newBook);
    clearForm();
    dialog.close();
  });
}

initializeExampleUI(exampleArray);
