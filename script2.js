/* eslint-disable max-classes-per-file */
// EDITION VARIABLES
let bookInEditionIndex;
let editMode = false;
// FILTER SETTING RECORDERS
let authorFilterValue;
let minPages;
let maxPages;
let readFilterValue;
let sortingParameter;

class Book {
  constructor(title = 'Unknown', author = 'Unknown', pages = 0, read = false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addNewBook(title, author, pages, read) {
    if (editMode) {
      this.removeBook(bookInEditionIndex);
    }
    const newBook = new Book(title, author, pages, read);
    this.books.push(newBook);
    updateUI(this.books);
    clearForm();
    dialog.close();
  }

  removeBook(index) {
    this.books.splice(index, 1);
    updateUI(this.books);
  }
}
// GLOBAL VARIABLES
const myLibrary = new Library();

// SELECTORS

// Book addition selectors
const addBookButton = document.getElementById('add_new_book');
const submitBook = document.querySelector('#form_submit');
const dialog = document.querySelector('#book_form_dialog');
const form = document.querySelector('#book_form');
const libraryUI = document.querySelector('.library');

// Navigation selector
const bookList = document.querySelector('.book_list');

// Filter selectors
const filtersPanel = document.querySelector('.controls');
const authorFilterDropdown = document.querySelector('#author_list');
const minInput = document.querySelector('#min_pages');
const maxInput = document.querySelector('#max_pages');
const readFilter = document.querySelector('#read_or_not_filter');
const sortDropdown = document.querySelector('#sort_options');
const resetFiltersButton = document.querySelector('#reset_filters');

// Edition selectors
const editDialog = document.querySelector('#edit_dialog');
const submitEdit = document.querySelector('#edit_submit');
const closeDialogButton = document.querySelector('#close_dialog');

// LISTENERS

addBookButton.addEventListener('click', () => {
  dialog.showModal();
});

// EDIT && TOGGLE READ && REMOVE buttons listeners
libraryUI.addEventListener('click', (e) => {
  let clickedOnBackground = true;
  // EDIT
  const editDiv = e.target.closest('.edit_button');
  if (editDiv !== null) {
    const cardInEdition = editDiv.parentElement;
    clickedOnBackground = false;
    openEditDialog(cardInEdition);
    // READ TOGGLE
  } else if (e.target.matches('.read_status')) {
    clickedOnBackground = false;
    openEditDialog(e.target.parentElement);
    const newTitle = document.getElementById('title').value;
    const newAuthor = document.getElementById('author').value;
    const newPages = document.getElementById('pages').value;
    let newRead;
    document.getElementById('read').checked
      ? (newRead = false)
      : (newRead = true);

    myLibrary.addNewBook(newTitle, newAuthor, newPages, newRead);
    // REMOVE
  } else if (e.target.matches('.close_button')) {
    clickedOnBackground = false;
    const indexForRemoval = myLibrary.books.findIndex(
      (book) => book.title === e.target.parentElement.dataset.value
    );
    authorFilterValue = authorFilterDropdown.value;
    editMode = true;
    myLibrary.removeBook(indexForRemoval);
  }
  if (!clickedOnBackground) {
    sortAuthors();
    checkFilters();
  }
});

// SUBMIT BOOK listener
submitBook.addEventListener('click', (e) => {
  if (!validateForm(e)) return; // Prevent further execution if form is invalid
  const newTitle = document.getElementById('title').value;
  const newAuthor = document.getElementById('author').value;
  const newPages = document.getElementById('pages').value;
  const newRead = document.getElementById('read').checked;

  myLibrary.addNewBook(newTitle, newAuthor, newPages, newRead);
  sortAuthors();
  checkFilters();
  editMode = false;
});

// FILTER listener
filtersPanel.addEventListener('change', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
    checkFilters();
  }
});

resetFiltersButton.addEventListener('click', resetFilters);

closeDialogButton.addEventListener('click', () => {
  clearForm();
  dialog.close();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dialog.hasAttribute('open')) {
    clearForm();
    dialog.close();
  }
});

// GLOBAL FUNCTIONS

function updateUI(library) {
  libraryUI.innerHTML = '';
  bookList.innerHTML = '';

  // Get filter settings before erasing
  authorFilterValue = authorFilterDropdown.value;
  minPages = minInput.value;
  maxPages = maxInput.value;
  readFilterValue = readFilter.value;
  sortingParameter = sortDropdown.value;

  authorFilterDropdown.innerHTML = '';
  for (const book of library) {
    createBookCard(book);
  }

  // Set filters again
  authorFilterDropdown.value = authorFilterValue;
  minInput.value = minPages;
  maxInput.value = maxPages;
  readFilter.value = readFilterValue;
  sortDropdown.value = sortingParameter;
}

const validateForm = (e) => {
  let isValid = true;
  const {
    title: titleInput,
    author: authorInput,
    pages: pagesInput,
  } = form.elements;

  // Title validation
  if (
    titleInput.validity.valueMissing ||
    titleInput.validity.tooShort ||
    titleInput.validity.tooLong
  ) {
    titleInput.setCustomValidity(
      `The text must be between 3 and 35 characters long, your text is ${titleInput.value.length}`
    );
    isValid = false;
  } else {
    titleInput.setCustomValidity('');
  }
  titleInput.reportValidity();

  // Author validation
  if (
    authorInput.validity.valueMissing ||
    authorInput.validity.tooShort ||
    authorInput.validity.tooLong
  ) {
    authorInput.setCustomValidity(
      `The text must be between 3 and 35 characters long, your text is ${authorInput.value.length}`
    );
    isValid = false;
  } else {
    authorInput.setCustomValidity('');
  }
  authorInput.reportValidity();

  if (pagesInput.validity.rangeUnderflow) {
    pagesInput.setCustomValidity('Number of pages must be at least 1');
    pagesInput.reportValidity();
    isValid = false;
  }
  pagesInput.setCustomValidity('');

  if (!isValid) {
    e.preventDefault();
  }
  return isValid;
};

function createBookCard(book) {
  const bookCard = document.createElement('div');
  bookCard.classList.add('card');
  bookCard.setAttribute('id', book.title.split(' ').join(''));
  bookCard.setAttribute('data-value', book.title);
  const removeButton = document.createElement('button');
  removeButton.classList.add('close_button');
  removeButton.setAttribute('title', 'Remove book from library');
  removeButton.textContent = 'X';
  const editButton = document.createElement('button');
  editButton.classList.add('edit_button');
  editButton.setAttribute('title', 'Edit book info');
  editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>book-edit</title><path d="M19.39 10.74L11 19.13V22H6C4.89 22 4 21.11 4 20V4C4 2.9 4.89 2 6 2H7V9L9.5 7.5L12 9V2H18C19.1 2 20 2.89 20 4V10.3C19.78 10.42 19.57 10.56 19.39 10.74M13 19.96V22H15.04L21.17 15.88L19.13 13.83L13 19.96M22.85 13.47L21.53 12.15C21.33 11.95 21 11.95 20.81 12.15L19.83 13.13L21.87 15.17L22.85 14.19C23.05 14 23.05 13.67 22.85 13.47Z" /></svg>`;
  const bookTitle = document.createElement('h2');
  bookTitle.classList.add('book_title');
  bookTitle.textContent = book.title;
  const bookAuthor = document.createElement('h3');
  bookAuthor.classList.add('book_author');
  bookAuthor.textContent = book.author;
  if (
    !authorFilterDropdown.contains(
      authorFilterDropdown.querySelector(`option[value="${book.author}"]`)
    )
  ) {
    const authorOption = document.createElement('option');
    authorOption.textContent = book.author;
    authorOption.setAttribute('value', `${book.author}`);
    authorFilterDropdown.appendChild(authorOption);
  }
  const bookPages = document.createElement('p');
  bookPages.classList.add('book_pages');
  bookPages.setAttribute('data-value', book.pages);
  bookPages.textContent = `${book.pages} pages`;
  const bookRead = document.createElement('button');
  bookRead.classList.add('read_status');
  bookRead.setAttribute('data-value', book.read);
  bookRead.setAttribute('title', 'Toggle read status');
  book.read
    ? (bookRead.textContent = 'Read')
    : (bookRead.textContent = 'Not read yet');
  bookCard.append(
    removeButton,
    editButton,
    bookTitle,
    bookAuthor,
    bookPages,
    bookRead
  );
  libraryUI.appendChild(bookCard);
  adjustFontSizeToFit(bookCard.querySelector('.book_title'));

  // Create nav link
  const listItem = document.createElement('li');
  const anchor = document.createElement('a');
  anchor.textContent = bookCard.children[2].textContent;
  anchor.setAttribute(
    'href',
    `#${bookCard.children[2].textContent.split(' ').join('')}`
  );
  anchor.classList.add('nav_link');
  listItem.appendChild(anchor);
  bookList.appendChild(listItem);
}

function openEditDialog(card) {
  authorFilterValue = authorFilterDropdown.value;

  editMode = true;
  bookInEdition = myLibrary.books.find(
    (book) => book.title === card.dataset.value
  );
  bookInEditionIndex = myLibrary.books.findIndex(
    (book) => book.title === card.dataset.value
  );

  dialog.showModal();

  // populate form with old values
  document.getElementById('title').value =
    card.querySelector('.book_title').textContent;
  document.getElementById('author').value =
    card.querySelector('.book_author').textContent;
  document.getElementById('pages').value =
    card.querySelector('.book_pages').dataset.value;
  card.querySelector('.read_status').dataset.value === 'true'
    ? (document.getElementById('read').checked = true)
    : (document.getElementById('read').checked = false);
}

function clearForm() {
  document.querySelector('#title').value = '';
  document.querySelector('#author').value = '';
  document.querySelector('#pages').value = null;
  document.querySelector('#read').checked = false;
}
function checkFilters() {
  const cardsInDisplay = document.querySelectorAll('.card');
  const cardsArray = Array.from(cardsInDisplay);
  // Get filter values
  const authorFilterValue = authorFilterDropdown.value;
  const minPages = Number(minInput.value);
  const maxPages = Number(maxInput.value);
  const readFilterValue = readFilter.value;
  const sortingParameter = sortDropdown.value;

  // sort array first
  switch (sortingParameter) {
    case 'title ascending':
      cardsArray.sort((a, b) =>
        a
          .querySelector('.book_title')
          .textContent.localeCompare(b.querySelector('.book_title').textContent)
      );
      break;
    case 'title descending':
      cardsArray.sort((a, b) =>
        b
          .querySelector('.book_title')
          .textContent.localeCompare(a.querySelector('.book_title').textContent)
      );
      break;
    case 'author ascending':
      cardsArray.sort((a, b) =>
        a
          .querySelector('.book_author')
          .textContent.localeCompare(
            b.querySelector('.book_author').textContent
          )
      );
      break;
    case 'author descending':
      cardsArray.sort((a, b) =>
        b
          .querySelector('.book_author')
          .textContent.localeCompare(
            a.querySelector('.book_author').textContent
          )
      );
      break;
    case 'pages ascending':
      cardsArray.sort(
        (a, b) =>
          a.querySelector('.book_pages').dataset.value -
          b.querySelector('.book_pages').dataset.value
      );
      break;
    case 'pages descending':
      cardsArray.sort(
        (a, b) =>
          b.querySelector('.book_pages').dataset.value -
          a.querySelector('.book_pages').dataset.value
      );
      break;
    default:
      break;
  }
  libraryUI.innerHTML = '';
  cardsArray.forEach((card) => {
    libraryUI.appendChild(card);
  });

  // apply filters
  for (const card of cardsArray) {
    if (
      (card.querySelector('.book_author').textContent !== authorFilterValue &&
        authorFilterValue !== 'All authors') ||
      (card.querySelector('.book_pages').dataset.value < minPages &&
        minPages !== 0) ||
      (card.querySelector('.book_pages').dataset.value > maxPages &&
        maxPages !== 0) ||
      (readFilterValue !== 'default' &&
        readFilterValue !== card.querySelector('.read_status').dataset.value)
    ) {
      card.style.display = 'none';
      bookList.querySelector(
        `a[href="#${card.getAttribute('id')}"]`
      ).parentElement.style.display = 'none';
    } else {
      card.style.display = 'block';
      bookList.querySelector(
        `a[href="#${card.getAttribute('id')}"]`
      ).parentElement.style.display = 'block';
    }
  }
}

function resetFilters() {
  authorFilterDropdown.value = 'All authors';
  minInput.value = '';
  maxInput.value = '';
  readFilter.value = 'default';
  sortDropdown.value = 'default';
  checkFilters();
}

function adjustFontSizeToFit(container) {
  let contentWidth = container.scrollWidth;
  const containerWidth = container.clientWidth;

  while (contentWidth > containerWidth && container.style.fontSize !== '0px') {
    const currentFontSize = parseFloat(
      window.getComputedStyle(container, null).getPropertyValue('font-size')
    );
    container.style.fontSize = `${currentFontSize - 1}px`;
    contentWidth = container.scrollWidth;
  }
}

function sortAuthors() {
  const authorFilterOptions = authorFilterDropdown.querySelectorAll('option');
  const authorFilterOptionsArray = Array.from(authorFilterOptions);
  authorFilterOptionsArray.sort((a, b) =>
    a.innerText.localeCompare(b.innerText)
  );
  authorFilterDropdown.innerHTML = '';
  const allAuthorsOption = document.createElement('option');
  allAuthorsOption.setAttribute('data-value', 'All authors');
  allAuthorsOption.textContent = 'All authors';
  authorFilterDropdown.appendChild(allAuthorsOption);
  for (const option of authorFilterOptionsArray) {
    const optionElement = document.createElement('option');
    optionElement.setAttribute('data-value', `${option.innerText}`);
    optionElement.textContent = option.innerText;
    authorFilterDropdown.appendChild(optionElement);
  }
  if (authorFilterValue !== undefined && authorFilterValue !== '') {
    authorFilterDropdown.value = authorFilterValue;
  }
}

// Example initialization

const exampleArray = [
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    pages: 430,
    read: false,
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    pages: 281,
    read: true,
  },
  { title: '1984', author: 'George Orwell', pages: 328, read: false },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    pages: 180,
    read: true,
  },
  { title: 'Moby-Dick', author: 'Herman Melville', pages: 720, read: false },
  { title: 'Jane Eyre', author: 'Charlotte Brontë', pages: 500, read: true },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    pages: 400,
    read: false,
  },
  {
    title: 'Great Expectations',
    author: 'Charles Dickens',
    pages: 544,
    read: true,
  },
  {
    title: 'Little Women',
    author: 'Louisa May Alcott',
    pages: 759,
    read: false,
  },
  { title: 'Brave New World', author: 'Aldous Huxley', pages: 288, read: true },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    pages: 234,
    read: false,
  },
  {
    title: 'The Adventures of Huckleberry Finn',
    author: 'Mark Twain',
    pages: 366,
    read: true,
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoevsky',
    pages: 430,
    read: true,
  },
  { title: 'War and Peace', author: 'Leo Tolstoy', pages: 1225, read: false },
  { title: 'Anna Karenina', author: 'Leo Tolstoy', pages: 864, read: false },
  {
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    pages: 824,
    read: true,
  },
  { title: 'The Idiot', author: 'Fyodor Dostoevsky', pages: 656, read: true },
  {
    title: 'Don Quixote',
    author: 'Miguel de Cervantes',
    pages: 992,
    read: false,
  },
  {
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel García Márquez',
    pages: 417,
    read: true,
  },
  {
    title: 'Love in the Time of Cholera',
    author: 'Gabriel García Márquez',
    pages: 348,
    read: false,
  },
  { title: 'Invisible Man', author: 'Ralph Ellison', pages: 581, read: true },
  { title: 'Ulysses', author: 'James Joyce', pages: 730, read: false },
  { title: 'Dubliners', author: 'James Joyce', pages: 224, read: true },
  {
    title: 'A Portrait of the Artist as a Young Man',
    author: 'James Joyce',
    pages: 299,
    read: false,
  },
  {
    title: 'Madame Bovary',
    author: 'Gustave Flaubert',
    pages: 329,
    read: true,
  },
  { title: 'Lolita', author: 'Vladimir Nabokov', pages: 336, read: false },
  { title: 'Pnin', author: 'Vladimir Nabokov', pages: 208, read: true },
  { title: 'Pale Fire', author: 'Vladimir Nabokov', pages: 315, read: false },
  { title: 'Middlemarch', author: 'George Eliot', pages: 904, read: true },
  { title: 'Rebecca', author: 'Daphne du Maurier', pages: 448, read: false },
  { title: 'Frankenstein', author: 'Mary Shelley', pages: 280, read: true },
  { title: 'Dracula', author: 'Bram Stoker', pages: 418, read: false },
  {
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    pages: 254,
    read: true,
  },
  {
    title: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    pages: 544,
    read: false,
  },
  { title: 'Oliver Twist', author: 'Charles Dickens', pages: 554, read: true },
  {
    title: 'David Copperfield',
    author: 'Charles Dickens',
    pages: 882,
    read: false,
  },
  { title: 'Bleak House', author: 'Charles Dickens', pages: 1017, read: true },
  { title: 'Hard Times', author: 'Charles Dickens', pages: 352, read: false },
  { title: 'The Stranger', author: 'Albert Camus', pages: 123, read: true },
  { title: 'The Plague', author: 'Albert Camus', pages: 308, read: false },
  { title: 'The Fall', author: 'Albert Camus', pages: 147, read: true },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', pages: 158, read: false },
  {
    title: 'The Martian Chronicles',
    author: 'Ray Bradbury',
    pages: 222,
    read: true,
  },
  { title: 'Dune', author: 'Frank Herbert', pages: 688, read: false },
];

function initializeExampleUI(array) {
  for (const book of array) {
    myLibrary.addNewBook(book.title, book.author, book.pages, book.read);
  }
  sortAuthors();
  checkFilters();
}

initializeExampleUI(exampleArray);
