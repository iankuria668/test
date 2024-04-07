// Set the base URL for the API
const baseUrl = 'http://localhost:3000';

// Fetch all movies when the page loads
fetch(`${baseUrl}/films`)
  .then(response => response.json())
  .then(films => {
    // Display a menu of all movie titles
    const filmsList = document.getElementById('films');
    films.forEach(film => {
      const filmItem = document.createElement('li');
      filmItem.classList.add('film', 'item');
      filmItem.innerHTML = `
        <h3 id="title">${film.title}</h3>
        <p id="runtime">Runtime: ${film.runtime} minutes</p>
        <p id="showtime">Showtime: ${film.showtime}</p>
        <p id="ticket-num">Available Tickets: ${film.capacity - film.tickets_sold}</p>
        <p id="description">${film.description}</p>
      `;
      filmsList.appendChild(filmItem);

      // Add an event listener to the movie title
      filmItem.querySelector('h3').addEventListener('click', () => {
        // Fetch the movie details and display them
        fetch(`${baseUrl}/films/${film.id}`)
          .then(response => response.json())
          .then(filmDetails => {
              const filmPoster = document.getElementById('poster');
              filmPoster.src = filmDetails.poster;
              filmPoster.alt = `${filmDetails.title} poster`;

              const filmDetailsElement = document.getElementById('film-details');
              filmDetailsElement.innerHTML = `
                <h3>${filmDetails.title}</h3>
                <p>Runtime: ${filmDetails.runtime} minutes</p>
                <p>Showtime: ${filmDetails.showtime}</p>
                <p>Available Tickets: ${filmDetails.capacity - filmDetails.tickets_sold}</p>
                <p>Description: ${filmDetails.description}</p>
              `;

              // Display the parameters of the clicked title reference in db.json
              const filmInfoElement = document.getElementById('film-info');
              filmInfoElement.innerHTML = `
                <p>id: ${filmDetails.id}</p>
                <p>Runtime: ${filmDetails.runtime}</p>
                <p>Showtime: ${filmDetails.showtime}</p>
                <p>Ticket Numbers: ${filmDetails.tickets_sold}</p>
              `;
            })
          .catch(error => {
              console.error('Error fetching film details:', error);
            });
      });
    });

    // Display the first movie's details when the page loads
    const firstFilm = films[0];
    const filmPoster = document.getElementById('poster');
    filmPoster.src = firstFilm.poster;
    filmPoster.alt = `${firstFilm.title} poster`;

    const filmDetails = document.getElementById('film-details');
    filmDetails.innerHTML = `
      <h3>${firstFilm.title}</h3>
      <p>Runtime: ${firstFilm.runtime} minutes</p>
      <p>Showtime: ${firstFilm.showtime}</p>
      <p>Available Tickets: ${firstFilm.capacity - firstFilm.tickets_sold}</p>
      <p>Description: ${firstFilm.description}</p>
    `;
  })
  .catch(error => {
    console.error('Error fetching films:', error);
  });

  // Add an event listener to the movie title
filmItem.querySelector('h3').addEventListener('click', () => {
  // Fetch the movie details and display them
  fetch(`${baseUrl}/films/${film.id}`)
    .then(response => response.json())
    .then(filmDetails => {
        // Display the title name in the element with id="title"
        document.getElementById('title').innerText = filmDetails.title;

        const filmPoster = document.getElementById('poster');
        filmPoster.src = filmDetails.poster;
        filmPoster.alt = `${filmDetails.title} poster`;

        const filmDetailsElement = document.getElementById('film-details');
        filmDetailsElement.innerHTML = `
          <h3>${filmDetails.title}</h3>
          <p>Runtime: ${filmDetails.runtime} minutes</p>
          <p>Showtime: ${filmDetails.showtime}</p>
          <p>Available Tickets: ${filmDetails.capacity - filmDetails.tickets_sold}</p>
          <p>Description: ${filmDetails.description}</p>
        `;

        // Display the parameters of the clicked title reference in db.json
        const filmInfoElement = document.getElementById('film-info');
        filmInfoElement.innerHTML = `
          <p>id: ${filmDetails.id}</p>
          <p>Runtime: ${filmDetails.runtime}</p>
          <p>Showtime: ${filmDetails.showtime}</p>
          <p>Ticket Numbers: ${filmDetails.tickets_sold}</p>
        `;
    })
    .catch(error => {
        console.error('Error fetching film details:', error);
    });
});
