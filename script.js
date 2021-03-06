// ------------------------- Selectors -------------------------------
const addButton = document.querySelector('.add-btn');
const popupSection = document.querySelector('#popup');
const overlay = document.querySelector('#overlay');
const closeFormBtn = document.querySelector('#close-popup');
const addForm = document.querySelector('#add-form');
const cardList = document.querySelector('.books-container');
const body = document.getElementsByTagName('body')[0];
const header = document.getElementsByTagName('header')[0];

// ================== Book: represent a book ========================
function Book(title, author, pages, isRead) {
    this.title = this.capitalize(title);
    this.author = this.capitalize(author);
    this.pages = pages;
    this.isRead = this.setRead(isRead);


}


// capitalize each letter in a string, using for author name and title name
Book.prototype.capitalize = function (str) {
    let strArray = str.trim().split(' ');
    for (let i = 0; i < strArray.length; i++) {
        strArray[i] = strArray[i][0].toUpperCase() + strArray[i].substr(1);
    }
    return strArray.join(' ');
}

Book.prototype.setRead = function (isRead) {
    return (isRead === '0') ? false : true;
}




// ================== Storage: handles books data in local storage for now ==========
// Storage must be instantiated before using
// will cause error if calling anythying outside of Storage scope
// user can not access and change local variable of Storage unless accessing by Storage object
function BookStorage() {
    // Initializing with a default sample book
    const sample = new Book('the old man and the sea', 'Ernest Hemingway', 127, false);
    // userStorage.addBookToStorage(sample);
    this.books = [sample];
}

// reset local storage when there is any change to the books array above
BookStorage.prototype.resetStorageItem = function () {
    localStorage.setItem('books', JSON.stringify(this.books));
}


// get all books from storage
BookStorage.prototype.getBooksFromStorage = function () {
    if (localStorage.getItem('books') !== null) {
        this.books = JSON.parse(localStorage.getItem('books'));
    }
    return this.books;
}

// addBookToStorage
BookStorage.prototype.addBookToStorage = function (book) {
    this.getBooksFromStorage().push(book);
    // reset local storage with new book array
    this.resetStorageItem();
}

// removeBookInStorage
BookStorage.prototype.removeBookInStorage = function (title, author) {
    this.getBooksFromStorage().forEach((book, index) => {
        if (book.title.toLowerCase() == title.toLowerCase() &&
            book.author.toLowerCase() == author.toLowerCase()) {
            this.books.splice(index, 1);
        }
    });
    // reset local storage with new book array
    this.resetStorageItem();
}

// update reading status by title and author name
BookStorage.prototype.changeBookStatusInStorage = function (title, author) {
    this.getBooksFromStorage().forEach((b) => {
        if (b.title.toLowerCase() == title.toLowerCase() &&
            b.author.toLowerCase() == author.toLowerCase()) {
            if (b.isRead) {
                b.isRead = false;
            } else {
                b.isRead = true;
            }
        }
    });
    // reset local storage with new book array
    this.resetStorageItem();
}

// ==================== UI: handles user interface tasks ===================
// UserInterface function constructor
function UserInterface(storage) {
    // input form variables
    this.titleInput = document.querySelector('#title');
    this.authorInput = document.querySelector('#author');
    this.pagesInput = document.querySelector('#pages');
    this.storage = storage;
}
// Display all book to the webpage list
UserInterface.prototype.displayBooks = function () {
    this.storage.getBooksFromStorage().forEach(b => this.addBookToList(b));
}

// addBookToList
UserInterface.prototype.addBookToList = function (book) {
    // one book container
    const bookCard = document.createElement("div");
    bookCard.classList.add('book');

    // creating a book element
    bookCard.innerHTML = `
    <i class="far fa-trash-alt remove"></i>
    <div class="book-content-wrapper">
        <div class="book-title">
            <h3>${book.title}</h3>
        </div>
        <div class="author-wrapper">
            <span>Author: </span>
            <span class="author">${book.author}</span>
        </div>
        <div class="pages-wrapper">
            <span>Number of pages: </span>
            <span>${book.pages}<span>
        </div>
    </div>
    `;

    // isRead Button
    const readButton = document.createElement("div");
    readButton.className = 'isRead';

    // console.log(book.isRead);
    // check isRead or not
    if (book.isRead) {
        readButton.textContent = 'Read';
        readButton.classList.add('complete-book');

    } else {
        console.log(book.isRead);
        readButton.textContent = 'Not Read Yet';
    }

    bookCard.appendChild(readButton);

    // add to web page book cards holder list
    cardList.appendChild(bookCard);
}

// open popup add form
UserInterface.prototype.openAddForm = function () {
    popupSection.style.transform = "scale(1)";
    overlay.style.opacity = 1;
    // disable add button when the form is open
    addButton.classList.toggle('disable-event');
}

// close popup add form
UserInterface.prototype.closeAddForm = function () {
    popupSection.style.transform = "scale(0)";
    overlay.style.opacity = 0;
    this.clearFields();
    // disable add button when the form is open
    addButton.classList.toggle('disable-event');
}

// addbook when submit, this function using event parameter from the event listener that calls it
UserInterface.prototype.submitBook = function (event) {
    // prevent default action of being submit
    event.preventDefault();

    //get form values
    const titleInput = document.querySelector('#title').value;
    const authorInput = document.querySelector('#author').value;
    const pagesInput = document.querySelector('#pages').value;
    const isReadInput = document.querySelector('#is-read').value;

    // Instantiate a book
    const book = new Book(titleInput, authorInput, pagesInput, isReadInput);

    // Add book to UI
    this.addBookToList(book);
    console.log(book);

    // Add book to local storage
    this.storage.addBookToStorage(book);

    // close the form after successful submit a book 
    this.closeAddForm();
    this.showAlertUI('Book Added');
}

// clearing all input form fields of UI
UserInterface.prototype.clearFields = function () {
    this.titleInput.value = '';
    this.authorInput.value = '';
    this.pagesInput.value = '';
}

// remove a book from the UI
UserInterface.prototype.removeBookUI = function (e) {
    const element = e.target;
    if (element.classList.contains('remove')) {
        const book = e.target.parentElement;
        const title = book.getElementsByTagName('h3')[0].textContent;
        const author = book.querySelector('.author').textContent;
        this.showAlertUI(`Removed ${title}`);

        // remove from local storage
        this.storage.removeBookInStorage(title, author);

        // Animation
        book.classList.add('fall');

        // remove from UI after animation
        book.addEventListener('transitionend', () => {
            book.remove();
        })
    }
}

// check completed a book for UI
UserInterface.prototype.checkCompleteBookUI = function (e) {
    const element = e.target;
    if (element.classList.contains('isRead')) {
        const book = e.target.parentElement;
        const title = book.getElementsByTagName('h3')[0].textContent;
        const author = book.querySelector('.author').textContent;

        const isReadButton = element;
        isReadButton.classList.toggle('complete-book');
        // change text
        if (isReadButton.textContent == 'Read') {
            isReadButton.textContent = 'Not Read Yet'
        } else {
            isReadButton.textContent = 'Read'
        }

        // show alert
        this.showAlertUI('Status Updated');

        // update read status in local BookStorage
        this.storage.changeBookStatusInStorage(title, author);
    }
}

// show alert
UserInterface.prototype.showAlertUI = function (message) {
    const div = document.createElement('div');
    div.className = 'alert';
    div.appendChild(document.createTextNode(message));

    body.insertBefore(div, addButton);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 1500);
}

// ------------------ Events Handler -----------------
// setup
const userStorage = new BookStorage()

//creating a book UI loading from the created storage
const ui = new UserInterface(userStorage);

// Event: Display books
document.addEventListener('DOMContentLoaded', () => ui.displayBooks());

// Event: open submit form
addButton.addEventListener('click', () => ui.openAddForm());

// Event: close submit form
closeFormBtn.addEventListener('click', () => ui.closeAddForm());

// Event: Add a Book when click submit form 
addForm.addEventListener('submit', e => ui.submitBook(e));
// Event: Remove a book
cardList.addEventListener('click', e => ui.removeBookUI(e));

// Event: Toggle check a book is completed
cardList.addEventListener('click', e => ui.checkCompleteBookUI(e));