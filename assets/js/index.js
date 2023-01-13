// api key = 6b342ca8
// api URL => https://www.omdbapi.com/?i=tt3896198&apikey=6b342ca8

(function () {
    const apiURL = "https://www.omdbapi.com"
    const apiKey = "6b342ca8"

    const moviesContainer = document.getElementById("movies-container");
    const movieCardContainer = document.getElementById("movie-card-container");
    const searchBoxInput = document.getElementById("search-box-input");
    const searchBoxForm = document.getElementById("search-box-form");
    const emptyMoviesDiv = document.getElementById("empty-movies-div");
    const emptyFavMoviesDiv = document.getElementById("empty-fav-movies-div");

    let searchResults = [];
    let favMovieArray = [];

    let favMoviesContainer = document.getElementById("fav-movies-container");

    // load fav movies in DOM from local storage if any
    addToFavMoviesContainer();

    // prevent enter from working in search box since search is automatic
    searchBoxInput.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
        }
    })

    // fetch movies using search text
    async function fetchMovies(searchText) {
        const response = await fetch(`${apiURL}/?t=${searchText}&apikey=${apiKey}`);
        const jsonResponse = await response.json();
        const movie = jsonResponse;
        return movie;
    }

    //fetch movie using id
    async function fetchMovieUsingId(Id) {
        const response = await fetch(`${apiURL}/?i=${Id}&apikey=${apiKey}`);
        const jsonResponse = await response.json();
        const movie = jsonResponse;
        return movie;
    }

    // to display the movies
    function displayMovies(movie) {
        const movieCard = document.createElement("div");
        movieCard.setAttribute("class", "movie-card");

        //if image not found
        if (movie.Poster == "N/A") {
            movie.Poster = "./assets/images/image-not-found.png";
        }

        let isMovieFav = localStorage.getItem(`is${movie.imdbID}Fav`);
        /* setting fav button to ON if the movie is fav*/
        if (isMovieFav == "true") {
            movieCard.innerHTML = `
        <a href="movie.html">
            <img src="${movie.Poster}" data-id="${movie.imdbID}" />
        </a>
        <div class="movie-card-details">
            <p id="rating">⭐${movie.imdbRating}</p>
            <button class="fav-btn"> <i class="fa-solid fa-bookmark solid-yellow" data-id="${movie.imdbID}"></i></button>
        </div>
        <a href="movie.html">
            <h1 data-id="${movie.imdbID}"> ${movie.Title} </h1>
        </a>
        `;
        } else { /* setting fav button to OFF if the movie is not fav*/
            movieCard.innerHTML = `
            <a href="movie.html">
                <img src="${movie.Poster}" data-id="${movie.imdbID}" />
            </a>
            <div class="movie-card-details">
                <p id="rating">⭐${movie.imdbRating}</p>
                <button class="fav-btn"> <i class="fa-solid fa-bookmark" data-id="${movie.imdbID}"></i></button>
            </div>
            <a href="movie.html">
                <h1 data-id="${movie.imdbID}"> ${movie.Title} </h1>
            </a>
            `;
        }

        movieCardContainer.prepend(movieCard);
    }


    // on search, fetch movies and add to DOM as search results
    searchBoxInput.addEventListener("keyup", function () {
        emptyMoviesDiv.style.display = "none";
        let searchText = searchBoxInput.value;
        if (searchText === "") {
            // nothing to display in search results
            movieCardContainer.innerHTML = "";
            // clear the searchResults array
            searchResults = [];
            emptyMoviesDiv.style.display = "block";
        } else { // fetch movies using search text
            (async () => {
                let movie = await fetchMovies(searchText);
                addToMoviesContainer(movie); // add fetched movies to DOM
            })();
        }
    });

    // add to movies container div if movie found 
    function addToMoviesContainer(movie) {
        let isExist = false;

        // check if movie exists in the searchResults array
        searchResults.forEach((searchItem) => {
            if (searchItem.Title == movie.Title) {
                isExist = true;
            }
        });

        if (!isExist && movie.Title != undefined) {
            searchResults.push(movie);
            displayMovies(movie); // display movies in DOM
        }
    }

    //------------------------------------//


    // storing array of fav movies in local storage
    async function handleFavbtnClick(e) {
        let movieId = e.target.dataset.id;
        let movie = await fetchMovieUsingId(movieId);
        let localFavMovieList = localStorage.getItem("favMovieList");

        if (localFavMovieList) {
            favMovieArray = Array.from(JSON.parse(localFavMovieList));
        } else {
            localStorage.setItem("favMovieList", JSON.stringify(movie));
        }
        // check if movie already exists in fav list
        let isExist = false;
        favMovieArray.forEach((searchItem) => {
            if (movie.Title == searchItem.Title) {
                isExist = true;
            }
        });
        if (!isExist) { // if not, add to fav movie array and set to local storage
            favMovieArray.push(movie);
            localStorage.setItem(`is${movie.imdbID}Fav`, true);
        }
        localStorage.setItem("favMovieList", JSON.stringify(favMovieArray));
        isExist = !isExist;

        addToFavMoviesContainer();
    }

    // display the movie in fav container
    function addToFavMoviesContainer() {

        favMoviesContainer.innerHTML = "";
        let list = JSON.parse(localStorage.getItem("favMovieList"));
        // if no movies are fav, show the empty fav movies div
        if (list == null || list.length == 0) {
            emptyFavMoviesDiv.style.display = "block";
        }
        if (list != null && list.length > 0) {
            // hide empty fav movies div
            emptyFavMoviesDiv.style.display = "none";
            list.forEach((movie) => {
                const favMovieCard = document.createElement("div");
                favMovieCard.setAttribute("class", "fav-movie-card");
                favMovieCard.innerHTML = `
            <a href="movie.html" data-id="${movie.imdbID}"><img src="${movie.Poster}"}" /></a>
            <div class="fav-movie-card-details">
              <p>⭐${movie.imdbRating}</p>
              <h3><a href="movie.html" data-id="${movie.imdbID}"> ${movie.Title} </a></h3>
              <small> ${movie.Year} </small>
            </div>
            <div class="del-btn-container">
              <button class="del-btn" data-id="${movie.imdbID}"> <i class="fa-solid fa-circle-xmark fa-2x" data-id="${movie.imdbID}"></i> </button>
            </div>
            `;
                favMoviesContainer.prepend(favMovieCard);
            });
        }
    }

    // delete from fav
    function deleteFromFav(movieId) {
        let list = JSON.parse(localStorage.getItem("favMovieList"));
        let favArray = Array.from(list);
        let newList = favArray.filter((movie) => {
            return movie.imdbID != movieId;
        });

        localStorage.setItem("favMovieList", JSON.stringify(newList));
        localStorage.setItem(`is${movieId}Fav`, false);
        addToFavMoviesContainer();
    }

    // handle aal the click of app
    async function clickHandler(e) {
        if (e.target.classList.contains("fa-bookmark")) {
            e.preventDefault();
            e.target.classList.add("solid-yellow");
            handleFavbtnClick(e);
        } else if (e.target.classList.contains("fa-circle-xmark")) {
            let dataId = e.target.dataset.id;
            let favBtn = document.querySelector(`.fa-bookmark[data-id = ${dataId}]`);
            if (favBtn) {
                favBtn.classList.remove("solid-yellow");
            }
            deleteFromFav(e.target.dataset.id);
        }
        localStorage.setItem("movieId", e.target.dataset.id);
    }
    document.addEventListener("click", clickHandler);
})();


