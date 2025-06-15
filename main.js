window.onload = () => fetchData(keyedUrl);

//Globals
let url = 'https://api.spoonacular.com/recipes/complexSearch?';
const key = '796d0005eaf444deb8b5864424b15a77';
let query = 'chicken';
const keyedUrl = `${url}query=${query}&apiKey=${key}`;
let keyUrlSearch = '';
let pageCounter = 1;
let searchEnabled = false;

//Get DOM elements
const input = document.querySelector('input[type="text"]');
const search = document.querySelector('button');
const figure = document.querySelector('figure');
const section = document.querySelector('section');
const form = document.querySelector('form');
const footer = document.querySelector('footer');

input.focus();

const fetchData = (key) => {
  fetch(key)
    .then(checkStatus)
    .then(parseJSON)
    .then((res) => res.results.map((result) => placeData(result)))
    .catch((error) => errorHandler(error));
};

const checkStatus = (response) => {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};

const parseJSON = (response) => {
  return response.json();
};

const placeData = (result) => {
  let figure = document.createElement('figure');
  let href = document.createElement('a');
  let imagePlaceholder = document.createElement('img');
  let figcaption = document.createElement('figcaption');
  // href.href = `${recipe.f2f_url}`;
  // href.setAttribute('target', 'blank');
  imagePlaceholder.src = result.image;
  if (result.title.length > 50) {
    let newTitle = result.title.substring(0, 30);
    figcaption.innerHTML = newTitle;
  } else {
    figcaption.innerHTML = result.title;
  }
  href.appendChild(imagePlaceholder);
  figure.appendChild(href);
  figure.appendChild(figcaption);
  section.appendChild(figure);
};

const deleteList = () => {
  const [...figureList] = document.querySelectorAll('section figure');

  if (figureList.length > 1) {
    figureList.map((figure) => section.removeChild(figure));
  }
};

const infinite = () => {
  if (searchEnabled) {
    pageCounter++;
    let keyUrlMore = `${keyUrlSearch}&page=${pageCounter}`;
    input.focus();
    fetchData(keyUrlMore);
  }
};

const errorHandler = (error) => {
  const errContainer = document.createElement('div');
  errContainer.classList.add = 'errorClass';
  const errorText = document.createElement('h1');
  errorText.innerHTML = `There seems to be a problem <br> ${error}`;
  errContainer.appendChild(errorText);
  section.style = 'display:flex; justify-content: center; align-items: center;';
  section.appendChild(errContainer);
};

//Listeners
search.addEventListener('click', (e) => {
  e.preventDefault();
  searchEnabled = true;
  query = input.value;
  keyUrlSearch = `${url}&query=${query}&apiKey=${key}`;
  input.value = '';
  input.focus();
  pageCounter = 1;
  deleteList();
  fetchData(keyUrlSearch);
});

//Very neat code to handle infinite scrolling
document.addEventListener('DOMContentLoaded', () => {
  let options = {
    root: null,
    rootMargins: '0px',
    threshold: 0.2,
  };

  const observer = new IntersectionObserver(infinite, options);
  observer.observe(footer);
});
