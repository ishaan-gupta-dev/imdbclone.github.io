"use strict";
(function () {
    const title = document.getElementById("title");
    const year = document.getElementById("year");
    const runtime = document.getElementById("runtime");
    const rating = document.getElementById("rating");
    const poster = document.getElementById("poster");
    const plot = document.getElementById("plot");
    const directorsName = document.getElementById("director-names");
    const writersName = document.getElementById("writers-names");
    const castName = document.getElementById("cast-names");
    const genreContainer = document.getElementById("genre-container");
    const awards = document.getElementById("awards");
    let movieId = localStorage.getItem("movieId");

    fetchMoviesById(movieId);

    // fetch movies by id
    async function fetchMoviesById(movieId) {
        const url = `https://www.omdbapi.com/?i=${movieId}&type=movie&apikey=6b342ca8`;
        try {
            const response = await fetch(url);
            const movie = await response.json();

            title.innerHTML = movie.Title;
            year.innerHTML = movie.Year;
            runtime.innerHTML = movie.Runtime;
            rating.innerHTML = `${movie.imdbRating}/10`;
            poster.setAttribute("src", `${movie.Poster}`);
            plot.innerHTML = movie.Plot;

            let genreString = movie.Genre;
            let genreArray = genreString.split(",");
            genreArray.forEach(genre => {
                let genreSpan = document.createElement("span");
                genreSpan.setAttribute("class", "information");
                genreSpan.setAttribute("id", "genre");
                genreSpan.innerHTML = `
                <span class="genre-text"> ${genre} <span>
                `;
                genreContainer.prepend(genreSpan);
            });

            directorsName.innerHTML = movie.Director;
            writersName.innerHTML = movie.Writer;
            castName.innerHTML = movie.Actors;
            awards.innerHTML = movie.Awards;

        } catch (err) {
            console.log(err);
        }
    }
})();