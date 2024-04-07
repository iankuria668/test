
// Your code here
let url ='http://localhost:3000/films'

document.addEventListener('DOMContentLoaded',()=>{
//this allows accses to the server containing all the movies
   const fetchMovieDetails = async (id) =>{
    try {
           const response = await fetch(`${url}/${id}`);
           return await response.json();
       } catch (error) {
           return console.error('ERROR fetching movie', error);
       }
   }
   //now we want to show the movie details in the webpage
   const displayMovieDetails =(movie)=>{


   const poster = document.getElementById('poster')
   poster.src = movie.poster;
   
   const title = document.getElementById('title')
   title.textContent = movie.title;

   const runtime = document.getElementById('runtime')
   runtime.textContent = `${movie.runtime}Minutes`;

   const filmInfo = document.getElementById('film-info')
   filmInfo.textContent = movie.description;

   const showtime = document.getElementById('showtime')
   showtime.textContent = movie.showtime;

   const ticketNum = document.getElementById('ticket-num')
   
   const remainingMovieTickets = movie.capacity - movie.tickets_sold;
   ticketNum.textContent = `${remainingMovieTickets} tickets`
  
  
   const buyTicketButton = document.getElementById('buy-ticket')
   
   if(remainingMovieTickets > 0 ){
    buyTicketButton.textContent = 'buy ticket ASAP'
    buyTicketButton.disabled = false;
}
else{
    buyTicketButton.textContent = 'Sold out '
    buyTicketButton.disabled = true
    }

        //add functionality to the button
        buyTicketButton.addEventListener('click', async (event)=>{
         
         
             if(remainingMovieTickets > 0){
                await buyTicket(movie)
             }
             else{
                 console.log('no available tickets');
             }
         })
}
const buyTicket = async (movie)=>{
    try{
        const updateTicketSold = movie.tickets_sold+1
        const response = await fetch (`${url}/${movie.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                tickets_sold:updateTicketSold,
            })
        });
        if(response.ok){
            const updatedMovie = await response.json();
            displayMovieDetails(updatedMovie);
        }
        else{
            console.error('failed to update tikets sold on server')
        }

    }  
    catch(error){
        console.error('error buying ticket', error)
    }
}






const movieMenu = async () => {
    // a try block allows you to define a block of code to be tested for errors while being executed
    
    try {
        const response = await fetch(url);
        const movies = await response.json();
       
        const moviesList = document.getElementById('films')
       
        const placeLi = document.querySelector('#films .film.item')
        if (placeLi){
            moviesList.removeChild(placeLi);
        }
        //add movies in a list order
        movies.forEach(async(movie)=>{
        const movieLi = document.createElement('li')
        movieLi.classList.add('film','item');
        //dispaly movie title in the list
        movieLi.textContent = movie.title
        //make delete button
       
        //add click to display movie details
        movieLi.addEventListener('click',async()=>{
            displayMovieDetails(movie)
        })
         moviesList.appendChild(movieLi)
        })
    }
     catch(error){
        console.error('ERROR DISPLAYING MOVIES',error)
     }

    
}



movieMenu();
fetchMovieDetails(1)
.then(movie => displayMovieDetails(movie))
.catch(error => console.error('error fetching and displayng movie details',error))
});


function fetchAllMovies() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(data => {
            renderMoviesList(data);
        })
        .catch(error => console.error('Error fetching movies:', error));
}

// Render list of all movies on the page
function renderMoviesList(movies) {
    const filmsList = document.getElementById('films');
    filmsList.innerHTML = '';
    movies.forEach(movie => {
        const filmItem = document.createElement('li');
        filmItem.classList.add('film-item');
        filmItem.setAttribute('data-film-id', movie.id);
        filmItem.innerHTML = `
            <span>${movie.title}</span>
            <button class="delete-button" data-film-id="${movie.id}">Delete</button>
        `;
        filmsList.appendChild(filmItem);
    });
}
    
function fetchAllMovies() {
  fetch('http://localhost:3000/films')
    .then(response => response.json())
    .then(data => {
      const filmsList = document.getElementById('films');
      filmsList.innerHTML = '';
      data.forEach(movie => {
        const filmItem = document.createElement('li');
        filmItem.classList.add('film-item');
        filmItem.setAttribute('data-film-id', movie.id);
        filmItem.innerHTML = `
          <span>${movie.title}</span>
          <button class="delete-button" data-film-id="${movie.id}">Delete</button>
        `;
        filmsList.appendChild(filmItem);
      });
    })
    .catch(error => console.error('Error fetching movies:', error));
}

function buyTicket() {
  const movieId = 1; // Assuming we are always dealing with the first movie for simplicity
  fetch(`http://localhost:3000/films/${movieId}`)
    .then(response => response.json())
    .then(data => {
      if (data.tickets_sold < data.capacity) {
        const newTicketsSold = data.tickets_sold + 1;
        updateTicketsSold(movieId, newTicketsSold);
      } else {
        console.log('Movie is sold out');
      }
    })
    .catch(error => console.error('Error fetching movie details for ticket purchase:', error));
}
