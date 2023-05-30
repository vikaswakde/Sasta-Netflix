
const API_KEY = "a718169442276f951f804a33905c072f"

const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

// Call the fetchMovies function
fetchMovies().then((movies) => {
  displayMovies(movies);
});

// Function to fetch movie data
async function fetchMovies() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log("Error:", error);
  }
}


// Function to display movie recommendations
const displayMovies = (movies) => {
  const movieList = document.getElementById('movie-list');
  const movieListFragment = document.createDocumentFragment(); // Create a fragment to improve performance

  movies.forEach((movie) => {
    // Create movie card
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie');

    // Create movie image
    const movieImage = document.createElement('img');
    movieImage.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
    movieImage.alt = movie.title;

    // Add click event listener to movie card
    movieCard.addEventListener('click', () => {
      showMovieDetails(movie);
      fetchTrailer(movie.id); // Fetch trailer information for the clicked movie
    });

    // Append movie image to movie card
    movieCard.appendChild(movieImage);

    // Create watch button
      const watchButton = createWatchButton();

    // Add click event listener to watch button
    watchButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent the movie card click event from triggering
      fetchTrailer(movie.id);
    });

    // Append watch button to movie card
    movieCard.appendChild(watchButton);

    // Append movie card to movie list fragment
    movieListFragment.appendChild(movieCard);
  });

  // Clear previous list and append the movie list fragment
  movieList.innerHTML = '';
  movieList.appendChild(movieListFragment);

  updatePagination(movies.length);
};

// Helper function to create the watch button
const createWatchButton = () => {
  const watchButton = document.createElement('button');
  watchButton.classList.add('watch-button');
  watchButton.textContent = 'Play Now!';
  return watchButton;
};

// updatePagination 
const updatePagination = (totalMovies) => {
  const totalPages = Math.ceil(totalMovies / moviesPerPage);

  const pagination = document.getElementById('pagination');
  pagination.innerHTML = ''; // clear previous pagination

  for(let i = 1; i <= totalPages; i++){
    const pageButton = document.createElement("button");
    pageButton.textContent = i; 

    if (i === currentPage){
      pageButton.classList.add("active");
    }

    pageButton.addEventListener('click', () => {
      currentPage = i; 
      fetchMovies().then((movies) => {
        displayMovies(movies);
      });
    })

    pagination.appendChild(pageButton)
  }
}

// Show movie details function 
const showMovieDetails = (movie) => {
  const movieDetailsSection = document.getElementById('movie-details');
  movieDetailsSection.innerHTML = '';

  const movieTitle = document.createElement('h2');
  movieTitle.textContent = movie.title;

  const movieRating = document.createElement('p');
  movieRating.textContent = `Rating: ${movie.vote_average}`;

  const movieOverview = document.createElement('p');
  movieOverview.textContent = movie.overview;

  movieDetailsSection.appendChild(movieTitle);
  movieDetailsSection.appendChild(movieRating);
  movieDetailsSection.appendChild(movieOverview);

  movieDetailsSection.style.display = "block";

  movieDetailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}




// Get the search input and search button elements;
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Function to handle movie search
const handleMovieSearch = () => {
  const searchTerm = searchInput.value;
  if (searchTerm.trim() === '') {
    // Empty search term, display all movies
    fetchMovies().then((movies) => {
      displayMovies(movies);
    });
  } else {
    // Non-empty search term, fetch and display search results
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`;

    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        displayMovies(data.results); // Pass data.results directly to displayMovies
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
};


const fetchTrailer = async (movieId) => {
  const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`;

  try {
    const response = await fetch(trailerUrl);
    const data = await response.json();
    const trailers = data.results;

    if (trailers.length > 0) {
      const trailerKey = trailers[0].key; // Get the key of the first trailer
      playTrailer(trailerKey);
    } else {
      console.log("No trailer found");
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

// Function to play the trailer
const playTrailer = (trailerKey) => {
  const trailerUrl = `https://www.youtube.com/watch?v=${trailerKey}`;
  window.open(trailerUrl);
};


// Add click event listener to search button
searchButton.addEventListener("click", handleMovieSearch);

const moviesPerPage = 9; // Number of movies to display per page
let currentPage = 1; // Current page number
