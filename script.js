// ------------------------- Selectors -------------------------------
const addButton = document.querySelector('.add-btn');
const popupSection = document.querySelector('#popup');
const overlay = document.querySelector('#overlay');
const closeFormBtn = document.querySelector('#close-popup');
const addForm = document.querySelector('#add-form');
const cardList = document.querySelector('.books-container');
const body = document.getElementsByTagName('body')[0];
const header = document.getElementsByTagName('header')[0];
const darkModeButton = document.querySelector('.switch');



// ------------------ Book: represent a book---------------------------
function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}
// -------Storage: handles books data in local storage for now ---------
// getBooksFromStorage
function getBooksFromStorage() {
    let books;
    if (localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
}

// addBookToStorage
function addBookToStorage(book) {
    const books = getBooksFromStorage();
    books.push(book);
    // reset local storage with new book array
    localStorage.setItem('books', JSON.stringify(books));
}

// removeBookInStorage
function removeBookInStorage(title, author) {
    const books = getBooksFromStorage();

    books.forEach((book, index) => {
        if (book.title == title && book.author == author) {
            books.splice(index, 1);
        }
    });

    // reset local storage with new book array
    localStorage.setItem('books', JSON.stringify(books));
}

// removeBookInStorage
function changeBookStatusInStorage(title, author) {
    const books = getBooksFromStorage();

    books.forEach((book) => {
        if (book.title == title && book.author == author) {
            if (book.isRead) {
                book.isRead = false;
            } else {
                book.isRead = true;
            }
        }
    });

    // reset local storage with new book array
    localStorage.setItem('books', JSON.stringify(books));
}

// ------------------ UI: handles user interface tasks -----------------
// Display all book to the webpage list
function displayBooks() {
    // pretending books data from local storage
    const books = getBooksFromStorage();
    books.forEach(b => addBookToList(b));
}

// addBookToList
function addBookToList(book) {
    // one book container
    const bookCard = document.createElement("div");
    bookCard.classList.add('book');

    // creating a book element
    bookCard.innerHTML = `
    <i class="fas fa-times remove"></i>
    <div class="book-title">
        <h2>${book.title}</h2>
    </div>
    <h3>${book.author}</h3>
    `;

    // isRead Button
    const readButton = document.createElement("div");
    readButton.className = 'isRead';

    // check isRead or not
    if (book.isRead) {
        readButton.textContent = 'Read';
        readButton.classList.add('complete-book');
    } else {
        readButton.textContent = 'Not Read Yet';
    }

    bookCard.appendChild(readButton);

    // add to web page book cards holder list
    cardList.appendChild(bookCard);
}

// open popup add form
function openAddForm() {
    popupSection.style.transform = "scale(1)";
    overlay.style.opacity = 1;

    // disable add button when the form is open
    addButton.classList.toggle('disable-event');
    darkModeButton.classList.toggle('disable-event');
}

// close popup add form
function closeAddForm() {
    popupSection.style.transform = "scale(0)";
    overlay.style.opacity = 0;
    clearFields();
    // disable add button when the form is open
    addButton.classList.toggle('disable-event');
    darkModeButton.classList.toggle('disable-event');
}

// addbook when submit
function submitBook(e) {
    // prevent default action of being submit
    e.preventDefault();

    //get form values
    const titleInput = document.querySelector('#title').value;
    const authorInput = document.querySelector('#author').value;
    const pagesInput = document.querySelector('#pages').value;
    const isReadInput = document.querySelector('#is-read').value;

    // Instantiate a book
    const book = new Book(titleInput, authorInput, pagesInput, isReadInput);

    // Add book to UI
    addBookToList(book);

    // Add book to local storage
    addBookToStorage(book);

    // close the form after successful submit a book 
    closeAddForm();
    showAlertUI('Book Added');
}

function clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#pages').value = '';
}



// remove a book from the UI
function removeBookUI(e) {
    const element = e.target;
    if (element.classList.contains('remove')) {
        const book = e.target.parentElement;
        const title = book.getElementsByTagName('h2')[0].textContent;
        const author = book.getElementsByTagName('h3')[0].textContent;
        showAlertUI(`Removed ${title}`);

        // remove from local storage
        removeBookInStorage(title, author);

        // Animation
        book.classList.add('fall');

        // remove from UI after animation
        book.addEventListener('transitionend', () => {
            book.remove();
        })
    }
}

// check completed a book for UI
function checkCompleteBookUI(e) {
    const element = e.target;
    if (element.classList.contains('isRead')) {
        const book = e.target.parentElement;
        const title = book.getElementsByTagName('h2')[0].textContent;
        const author = book.getElementsByTagName('h3')[0].textContent;

        const isReadButton = element;
        isReadButton.classList.toggle('complete-book');
        // change text
        if (isReadButton.textContent == 'Read') {
            isReadButton.textContent = 'Not Read Yet'
        } else {
            isReadButton.textContent = 'Read'
        }

        // update read status in local storage
        changeBookStatusInStorage(title, author);
    }
}

// show alert
function showAlertUI(message) {
    const div = document.createElement('div');
    div.className = 'alert';
    div.appendChild(document.createTextNode(message));

    body.insertBefore(div, addButton);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
}

// toggle dark mode
function darkModeUI(e) {
    // change to dark mode
    darkModeButton.classList.toggle('switch-dark-mode');
    body.classList.toggle('dark-screen');
    header.classList.toggle('header-dark-mode');
    addButton.classList.toggle('add-btn-dark-mode');
    const books = document.querySelectorAll('.book');
    if (books.length > 0) {
        books.forEach(b => {
            b.classList.toggle('book-dark-mode')
        })
    }

}


// ------------------ Events Handler -----------------

// Event: Display books
document.addEventListener('DOMContentLoaded', displayBooks)

// Event: open submit form
addButton.addEventListener('click', openAddForm);

// Event: close submit form
closeFormBtn.addEventListener('click', closeAddForm);

// Event: Add a Book when click submit form 
addForm.addEventListener('submit', submitBook);
// Event: Remove a book
cardList.addEventListener('click', removeBookUI);

// Event: Toggle check a book is completed
cardList.addEventListener('click', checkCompleteBookUI);

// Event: Toggle Dark mode
darkModeButton.addEventListener('click', darkModeUI);