function Book(title = "Unknown", author = "Unknown", pages = 0, read = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// USE FOR OF >>> FOR IN

function Library() {
  this.books = [];

  Library.prototype.addNewBook = (title, author, pages, read) => {
    // listener on + button
    // open dialog
    if (editMode) {
      removeBook(bookInEditionIndex);
    }
    const newBook = new Book(title, author, pages, read);
  };

  Library.prototype.createBookCard = (form) => {
    // listener on save button
    // form input info to Book constructor and .push to library
    // WHENEVER A BOOK IS PUSHED ==>>> updateUI
    // erase form
  };

  Library.prototype.removeBook = (index) => {
    this.splice(index, 1);
    // remove nav links and the update
    // updateUI creating 1. All books, 2. All nav links, 3. All author options IF not duplicated
    // updateUI ALWAYS sets displays and checks for filters before rendering UI
  };
  // Instead of an edit function, the edit listener should toggle eedit mode, which just makes the form open with the selected book info, and after edit it goes through both remove and create book funcs
  Library.prototype.editBook = (book) => {};

  Library.prototype.updateUI = () => {
    // creates cards with for of loop and appends all to UIç
    // checkfliters() function changes displays of cards and navlinks
    // adds display none while checks filters before appending to UI
    // checks sort and reorders library array
    //
  };

  // Sort and filters should take the library array and reorganize whole UI everytime, so additivenes is easier
  // FILTER AND SORT DONT CHANGE THE LIBRARY, ONLY THE CARDARRAY CREATED FROM THE QUERYALL CARD NODELIST
  // Or maybe!!!!!! it should all go through updateUI, which should have conditionals to display or not
  // filters just respond to any event in the panel and then check all filters status before applying
  Library.prototype.filterUI;

  Library.prototype.resetFilters;
}
// GLOBAL VARIABLES
const myLibrary = new Library();

// EDITION VARIABLES
let editMode = false;
let bookInEdition;
let bookInEditionIndex;

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

submitBook.addEventListener("click", () => {
  const newTitle = document.getElementById("title").value;
  const newAuthor = document.getElementById("author").value;
  const newPages = document.getElementById("pages").value;
  let newRead = document.getElementById("read").checked;

  addNewBook(newTitle, newAuthor, newPages, newRead);
});

// EDIT button listener
libraryUI.addEventListener("click", (e) => {
  const editDiv = e.target.closest(".edit_button");
  const cardInEdition = editDiv.parentElement;
  if (editDiv) {
    editMode = true;
    bookInEdition = myLibrary.find(
      (book) => book.title === editDiv.dataset.value
    );
    bookInEditionIndex = myLibrary.findIndex(
      (book) => book.title === editDiv.dataset.value
    );
  }
  dialog.showModal();
  document.getElementById("title").value =
    card.querySelector(".book_title").textContent;
  document.getElementById("author").value =
    card.querySelector(".book_author").textContent;
  document.getElementById("pages").value =
    card.querySelector(".book_pages").dataset.value;
  card.querySelector(".read_status").dataset.value === "true"
    ? (document.getElementById("read").checked = true)
    : (document.getElementById("read").checked = false);
});
// REMOVE button listener
libraryUI.addEventListener("click", (e) => {
  if (e.target.matches(".close_button")) {
    removeBook(e.target.parentElement);
  }
});

// GLOBAL FUNCTIONS

// trigger this func at every update UI, which should be triggered with each addition, edition, removal and filter or sort change
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
    } else {
      card.style.display = "block";
    }
  }
}
