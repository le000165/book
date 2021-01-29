// ---------------------- Selectors ----------------------- 
const addBtn = document.querySelector('#add-btn');
const popupSection = document.querySelector('#popup');
const overlay = document.querySelector('#overlay');
const closePopup = document.querySelector('#close-popup');
const form = document.forms.addForm;
const submitBtn = document.querySelector('#submit-btn');
const booksContainer = document.querySelector('.books-container');

// book selector
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const pagesInput = document.querySelector('#pages');
const isReadInput = document.querySelector('#is-read');
let isPopup = false;



// ------------------ Books ------------------
let myLibrary = [];
// constructor 
function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    // to String
    this.info = function () {
        if (this.isRead) {
            return `${this.title}` + " by " + `${this.author}` + ", " + `${this.pages}` + " pages, it is read";
        } else {
            return `${this.title}` + " by " + `${this.author}` + ", " + `${this.pages}` + " pages, not read yet";
        }
    }
}

// adding book 
Book.prototype.addBookToLibrary = (book) => {
    // do stuff here
    myLibrary.push(book);
}

// remove by title and author name 
Book.prototype.removeBookByTitleAndAuthor = (title, author) => {
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].title == title && myLibrary[i].author == author) {
            myLibrary.splice(i, 1);
        }
    }
}

// create a book node and display
function creatBookNode(book) {
    // adding the Book to the library
    Book.prototype.addBookToLibrary(book);
    // one book container
    let bookNode = document.createElement("div");
    bookNode.classList.add('book');

    // Title node
    let bookTitleContainer = document.createElement("div");
    bookTitleContainer.classList.add('book-title');
    let titleNode = document.createElement("h1");
    titleNode.textContent = book.title;
    bookTitleContainer.appendChild(titleNode);

    // Author Node
    let authorNode = document.createElement("h2");
    authorNode.textContent = book.author;

    // Remove book button
    let removeButton = document.createElement("i");
    removeButton.classList.add('fas');
    removeButton.classList.add('fa-times');
    removeButton.classList.add('remove-book');

    // isRead Button
    let readButton = document.createElement("div");
    readButton.className = 'isRead';

    // check isRead or not
    if (book.isRead) {
        readButton.textContent = 'Read';
        readButton.classList.add('complete-book');
    } else {
        readButton.textContent = 'Not Read Yet';
    }

    // Append and loading book node
    bookNode.appendChild(removeButton);
    bookNode.appendChild(titleNode);
    bookNode.appendChild(authorNode);
    bookNode.appendChild(readButton);
    booksContainer.appendChild(bookNode);
}

// ------------------ Testing data ------------------
const theHobbit = new Book('The Habbit', 'J.R.R. Tolkien', 295, false);
Book.prototype.addBookToLibrary(theHobbit);


// display all books
for (let i = 0; i < myLibrary.length; i++) {
    creatBookNode(myLibrary[i]);
}

// ---------------------- Events ---------------------
addBtn.addEventListener('click', () => {
    if (!isPopup) open();
})

closePopup.addEventListener('click', () => {
    close();
});

submitBtn.addEventListener('click', submitBook);

booksContainer.addEventListener('click', bookButtonsHandler);


// -------------------- Functions -----------------------
// open popup
function open() {
    popupSection.style.transform = "scale(1)";
    overlay.style.opacity = 1;
    isPopup = true;
}

// close popup
function close() {
    popupSection.style.transform = "scale(0)";
    overlay.style.opacity = 0;
    isPopup = false;
}

// submiting to create a book
function submitBook(e) {
    if (titleInput.value == '' || authorInput.value == '' ||
        pagesInput.value == '') {
        return;
    } else {
        // prevent default submit
        e.preventDefault();
        let newBook = new Book(titleInput.value, authorInput.value, pagesInput.value, isReadInput.value);
        creatBookNode(newBook);
        close();
    }
}

// delete a book
function bookButtonsHandler(e) {
    const item = e.target;
    const book = item.parentElement;
    const bookTittle = book.getElementsByTagName('h1');
    const bookAuthor = book.getElementsByTagName('h2');

    // remove the book 
    if (item.classList.contains('remove-book')) {
        Book.prototype.removeBookByTitleAndAuthor(bookTittle[0].textContent, bookAuthor[0].textContent);
        book.remove();
    }

    // toggle mark read complete
    if (item.classList.contains('isRead')) {
        if (item.textContent == 'Not Read Yet') {
            item.textContent = 'Read';
        } else {
            item.textContent = 'Not Read Yet';
        }
        item.classList.toggle('complete-book');
    }
}