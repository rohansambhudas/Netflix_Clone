// Variables
const tmdb_api_key = "3ed33e91dfd1c48e3a4d3d2afaeaff0a";
const tmdb_apiEndPointUrl = "https://api.themoviedb.org/3";
const google_api_key = "AIzaSyAuO4n85dY8QJhSFBdL5AN-I1QfxmBaW_w";
const google_apiEndPointUrl = "https://www.googleapis.com/youtube/v3"

// Movie Image base URL
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
    fetchAllCategories: `${tmdb_apiEndPointUrl}/genre/movie/list?api_key=${tmdb_api_key}`,
    fetchMovieList: (id) => `${tmdb_apiEndPointUrl}/discover/movie?api_key=${tmdb_api_key}&with_genres=${id}`,
    fetchTrendingList: `${tmdb_apiEndPointUrl}/trending/all/week?api_key=${tmdb_api_key}`,
    searchOnYoutube: (query) => `${google_apiEndPointUrl}/search?part=snippet&q=${query}&key=${google_api_key}`
}




// Boots up the app

function init() {
    fetchTrendingMovies();
    // fetchAndBuildMovieSection(apiPaths.fetchTrendingList, 'Trending Now');
    fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
    fetchAndBuildMovieSection(apiPaths.fetchTrendingList, 'Trending Now').then(list =>{
        const randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex]);
    }).catch(err => {
        console.error(err)
    })
}

function buildBannerSection(movie) {
    const bannerCont = document.getElementById("banner-section");
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

    const div = document.createElement('div');
    div.innerHTML = `
        <h2 class="banner-title">${movie.title}</h2>
        <p class="banner-info">Released - ${movie.release_date}</p>
        <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0, 200).trim()+'...' : movie.overview}</p>
        <div class="action-buttons-cont">
            <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard" data-name="Play"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp; Play</button>
            <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard" data-name="Info"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp; More Info</button>
        </div>`
    div.className = "banner-content container"
    bannerCont.append(div)
}

function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
    .then(res=>res.json())
    .then(res=>{
        const categories = res.genres;
        if (Array.isArray(categories) && categories.length) {
            categories.slice(0,3).forEach(category => fetchAndBuildMovieSection(apiPaths.fetchMovieList(category.id),category.name))
            console.log(categories)
        }
        console.log(categories);
    })
    .catch(err=>console.error(err));
}

async function fetchAndBuildMovieSection(fetchUrl, categoryName) {
    console.log(fetchUrl, categoryName);
    try {
        const res = await fetch(fetchUrl);
        const res_1 = await res.json();
        // console.log(res.results)
        const movies = res_1.results;
        if (Array.isArray(movies) && movies.length) {
            fetchMovieSection(movies, categoryName);
        }
        return movies;
    } catch (err) {
        return console.error(err);
    }
}

function fetchMovieSection(list, categoryName) {
    console.log(list, categoryName)
    
    const movieCont = document.getElementById('movies-cont');
    const moviesListHTML = list.map(item =>{
        return`<img class="movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}" onClick="searchMovieTrailer('${item.title}')">`;
    }).join('');

    // Create another HTML element
    const moviesSectionHTML = `
    <h2 class="movie-section-heading">${categoryName} 
        <span>
            <img class="explore-nudge-icon" src="https://cdn-user-icons.flaticon.com/98754/98754068/1680847476323.svg?token=exp=1680848399~hmac=2938421db8122567ff86741b497450d0" alt="nudge">
        </span> 
        
        <span class="explore-nudge">Explore All</span>
    </h2>
    <div class="movies-row">${moviesListHTML}</div>
    `
    // console.log(moviesSectionHTML)

    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = moviesSectionHTML;

    // apend html into movies container
    movieCont.append(div); 
}

function searchMovieTrailer(movieName) {
    if (!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        const bestResult = res.items[0];
        const youTubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
        console.log(youTubeUrl)
        window.open(youTubeUrl, '_blank');
    })
    .catch(err => console.error(err))
}

window.addEventListener('load', function(){
    init();
    this.window.addEventListener('scroll', function(){
        const header = this.document.getElementById('header')
        if (this.window.scrollY > 100) {
            header.classList.add('black-bg')
        }else {
            header.classList.remove('black-bg');
        }
    })
})