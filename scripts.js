// Function to fetch news articles from the API
const apiKey = 'e04dc4b9e550444689b967113ca346d8';

// Function to fetch news based on a query
async function fetchNews(query = 'latest news') {
    try {
        let response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`); //internationaal
        // let response = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`); //national
        let jsonData = await response.json();
        displayNews(jsonData.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Function to handle search
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', function () {
        const query = searchInput.value;
        fetchNews(query);
    });

    // Other initialization code here...
});

// Function to display news articles
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'news-card';

        articleElement.innerHTML = `
            <img src="${article.urlToImage}" alt="${article.title}">
            <div class="news-card-content">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="article.html?url=${encodeURIComponent(article.url)}">Read more</a>
                <button class="save-button" onclick="saveArticle('${encodeURIComponent(JSON.stringify(article))}')">Save</button>
            </div>
        `;

        newsContainer.appendChild(articleElement);
    });
}

// Function to save an article to localStorage
function saveArticle(article) {
    let savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    const parsedArticle = JSON.parse(decodeURIComponent(article));

    // Check if the article is already saved
    if (isArticleSaved(parsedArticle)) {
        alert('This article is already saved!');
        return;
    }

    savedArticles.push(parsedArticle);
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
    alert('Article saved!');
}

// Function to check if an article is already saved
function isArticleSaved(article) {
    let savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    return savedArticles.some(savedArticle => savedArticle.title === article.title);
}

// Function to fetch and display a single article
async function fetchArticle(url) {
    try {
        let response = await fetch(url);
        let jsonData = await response.json();
        displayArticle(jsonData);
    } catch (error) {
        console.error('Error fetching article:', error);
    }
}

// Function to display a single article
function displayArticle(article) {
    const newsArticle = document.getElementById('news-article');

    newsArticle.innerHTML = `
        <h1>${article.title}</h1>
        <img src="${article.urlToImage}" alt="${article.title}">
        <p>${article.content}</p>
    `;
}

// Function to display saved articles
function displaySavedArticles() {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];

    const savedArticlesContainer = document.getElementById('saved-articles-container');

    savedArticlesContainer.innerHTML = '';

    savedArticles.forEach((article, index) => {
        const articleElement = document.createElement('div');
        articleElement.className = 'saved-article';

        articleElement.innerHTML = `
            <img src="${article.urlToImage}" alt="${article.title}">
            <div class="saved-article-content">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="article.html?url=${encodeURIComponent(article.url)}">Read more</a>
                <button class="unsave-button" onclick="unsaveArticle(${index})">Unsave</button>
            </div>
        `;

        savedArticlesContainer.appendChild(articleElement);
    });
}

// Function to unsave an article
function unsaveArticle(index) {
    let savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];

    savedArticles.splice(index, 1);

    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));

    displaySavedArticles(); // Refresh the display
}

// Function to show note creation form
function showNoteForm() {
    const modal = document.getElementById('note-form-modal');
    modal.style.display = 'block';
}

// Function to close note creation form
function closeNoteForm() {
    const modal = document.getElementById('note-form-modal');
    modal.style.display = 'none';
}

// Function to save a note
function saveNote() {
    const noteTitle = document.getElementById('note-title').value;
    const noteContent = document.getElementById('note-content').value;
    const currentDate = getCurrentDate();

    const note = {
        title: noteTitle,
        content: noteContent,
        date: currentDate
    };

    let savedNotes = localStorage.getItem('savedNotes');
    savedNotes = savedNotes ? JSON.parse(savedNotes) : [];
    savedNotes.push(note);
    localStorage.setItem('savedNotes', JSON.stringify(savedNotes));

    displaySavedNotes();
    closeNoteForm();
}

// Function to get current date in DD/MM/YY format
function getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yy = String(today.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
}

// Function to display saved notes
function displaySavedNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('savedNotes')) || [];
    const savedNotesContainer = document.getElementById('saved-notes-container');

    savedNotesContainer.innerHTML = '';

    savedNotes.forEach((note, index) => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';

        noteCard.innerHTML = `
            <div class="note-card-content">
                <div class="note-date">Date: ${note.date}</div>
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <button class="edit-button" onclick="editNote(${index})">Edit</button>
                <button class="delete-button" onclick="deleteNote(${index})">Delete</button>
            </div>
        `;

        savedNotesContainer.appendChild(noteCard);
    });
}

// Function to edit a note
function editNote(index) {
    const savedNotes = JSON.parse(localStorage.getItem('savedNotes')) || [];
    const note = savedNotes[index];

    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').value = note.content;

    savedNotes.splice(index, 1); // Remove the old note

    localStorage.setItem('savedNotes', JSON.stringify(savedNotes));

    showNoteForm(); // Open the form for editing
}

// Function to delete a note
function deleteNote(index) {
    let savedNotes = JSON.parse(localStorage.getItem('savedNotes')) || [];

    savedNotes.splice(index, 1);

    localStorage.setItem('savedNotes', JSON.stringify(savedNotes));

    displaySavedNotes(); // Refresh the display
}

// Check if we are on the article page and load the article
if (window.location.pathname.includes('article.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const articleUrl = urlParams.get('url');
    if (articleUrl) {
        fetchArticle(articleUrl);
    }
} else if (window.location.pathname.includes('saved-articles.html')) {
    displaySavedArticles();
} else if (window.location.pathname.includes('saved-notes.html')) {
    displaySavedNotes();
} else {
    fetchNews();
}

function navClick(navName) {
    if (navName == "world") {
        document.getElementById("world").style.color = "rgb(0, 140, 255)";
        document.getElementById("politics").style.color = "white";
        document.getElementById("business").style.color = "white";
        document.getElementById("technology").style.color = "white";
        document.getElementById("sports").style.color = "white";
        document.getElementById("entertainment").style.color = "white";
    }
    if (navName == "politics") {
        document.getElementById("politics").style.color = "rgb(0, 140, 255)";
        document.getElementById("world").style.color = "white";
        document.getElementById("business").style.color = "white";
        document.getElementById("technology").style.color = "white";
        document.getElementById("sports").style.color = "white";
        document.getElementById("entertainment").style.color = "white";
    }
    if (navName == "business") {
        document.getElementById("business").style.color = "rgb(0, 140, 255)";
        document.getElementById("politics").style.color = "white";
        document.getElementById("world").style.color = "white";
        document.getElementById("technology").style.color = "white";
        document.getElementById("sports").style.color = "white";
        document.getElementById("entertainment").style.color = "white";
    }
    if (navName == "technology") {
        document.getElementById("technology").style.color = "rgb(0, 140, 255)";
        document.getElementById("politics").style.color = "white";
        document.getElementById("world").style.color = "white";
        document.getElementById("business").style.color = "white";
        document.getElementById("sports").style.color = "white";
        document.getElementById("entertainment").style.color = "white";
    }
    if (navName == "sports") {
        document.getElementById("sports").style.color = "rgb(0, 140, 255)";
        document.getElementById("politics").style.color = "white";
        document.getElementById("business").style.color = "white";
        document.getElementById("technology").style.color = "white";
        document.getElementById("world").style.color = "white";
        document.getElementById("entertainment").style.color = "white";
    }
    if (navName == "entertainment") {
        document.getElementById("entertainment").style.color = "rgb(0, 140, 255)";
        document.getElementById("politics").style.color = "white";
        document.getElementById("business").style.color = "white";
        document.getElementById("technology").style.color = "white";
        document.getElementById("sports").style.color = "white";
        document.getElementById("world").style.color = "white";
    }

    fetchNews(navName)
}

function asideClick(asideName) {
    if (asideName == "world") {
        document.getElementById("world").style.color = "rgb(0, 140, 255)";
        document.getElementById("politics").style.color = "white";
        document.getElementById("business").style.color = "white";
        document.getElementById("technology").style.color = "white";
        document.getElementById("sports").style.color = "white";
        document.getElementById("entertainment").style.color = "white";
    }
    if (asideName == "politics") {
        document.getElementById("politics").style.color = "rgb(0, 140, 255)";
        document.getElementById("world").style.color = "white";
        document.getElementById("business").style.color = "white";
        document.getElementById("technology").style.color = "white";
        document.getElementById("sports").style.color = "white";
        document.getElementById("entertainment").style.color = "white";
    }
    if (asideName == "business") {
        document.getElementById("business").style.color = "rgb(0, 140, 255)";
        document.getElementById("politics").style.color = "white";
        document.getElementById("world").style.color = "white";
        document.getElementById("technology").style.color = "white";
        document.getElementById("sports").style.color = "white";
        document.getElementById("entertainment").style.color = "white";
    }
    if (asideName == "technology") {
        document.getElementById("technology").style.color = "rgb(0, 140, 255)";
        document.getElementById("politics").style.color = "white";
        document.getElementById("world").style.color = "white";
        document.getElementById("business").style.color = "white";
        document.getElementById("sports").style.color = "white";
        document.getElementById("entertainment").style.color = "white";
    }
    if (asideName == "sports") {
        document.getElementById("sports").style.color = "rgb(0, 140, 255)";
        document.getElementById("politics").style.color = "white";
        document.getElementById("business").style.color = "white";
        document.getElementById("technology").style.color = "white";
        document.getElementById("world").style.color = "white";
        document.getElementById("entertainment").style.color = "white";
    }
    if (asideName == "entertainment") {
        document.getElementById("entertainment").style.color = "rgb(0, 140, 255)";
        document.getElementById("politics").style.color = "white";
        document.getElementById("business").style.color = "white";
        document.getElementById("technology").style.color = "white";
        document.getElementById("sports").style.color = "white";
        document.getElementById("world").style.color = "white";
    }

    fetchNews(asideName)
}

