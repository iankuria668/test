document.addEventListener('DOMContentLoaded', () => {
    // Step 1: Render movie details on page load
    fetchMovieDetails();

    // Step 2: Render menu of all movies
    fetchAllMovies();

    // Step 3: Implement buying a ticket functionality
    document.getElementById('buy-ticket').addEventListener('click', buyTicket);

    // Step 4: Implement deleting a film functionality
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', deleteFilm);
    });
});

// Step 1: Render movie details on page load
function fetchMovieDetails() {
    fetch('http://localhost:3000/films/1')
        .then(response => response.json())
        .then(data => {
            renderMovieDetails(data);
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

// Render movie details on the page
function renderMovieDetails(movie) {
    const movieDetails = document.getElementById('movie-details');
    movieDetails.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}" />
        <h2>${movie.title}</h2>
        <p>Runtime: ${movie.runtime} mins</p>
        <p>Showtime: ${movie.showtime}</p>
        <p>Available Tickets: ${movie.capacity - movie.tickets_sold}</p>
        <p>Description: ${movie.description}</p>
    `;

    // Indicate if the movie is sold out
    if (movie.tickets_sold >= movie.capacity) {
        document.getElementById('buy-ticket').textContent = 'Sold Out';
    }
}

// Step 2: Render menu of all movies
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

// Step 3: Implement buying a ticket functionality
function buyTicket() {
    fetch('http://localhost:3000/films/1')
        .then(response => response.json())
        .then(data => {
            if (data.tickets_sold < data.capacity) {
                const newTicketsSold = data.tickets_sold + 1;
                updateTicketsSold(data.id, newTicketsSold);
            } else {
                console.log('Movie is sold out');
            }
        })
        .catch(error => console.error('Error fetching movie details for ticket purchase:', error));
}

// Update tickets sold for a movie
function updateTicketsSold(movieId, newTicketsSold) {
    fetch(`http://localhost:3000/films/${movieId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tickets_sold: newTicketsSold
        })
    })
        .then(response => response.json())
        .then(data => {
            fetchMovieDetails(); // Update movie details after ticket purchase
            purchaseTicket(movieId);
        })
        .catch(error => console.error('Error updating tickets sold:', error));
}

// Purchase ticket and add to tickets endpoint
function purchaseTicket(movieId) {
    fetch('http://localhost:3000/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            film_id: movieId,
            number_of_tickets: 1 // Assuming only one ticket is bought at a time
        })
    })
        .then(response => response.json())
        .then(ticketData => {
            console.log('Ticket purchased:', ticketData);
        })
        .catch(error => console.error('Error purchasing ticket:', error));
}

// Step 4: Implement deleting a film functionality
function deleteFilm(event) {
    const filmId = event.target.dataset.filmId;
    fetch(`http://localhost:3000/films/${filmId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                event.target.parentElement.remove();
            }
        })
        .catch(error => console.error('Error deleting film:', error));
}
