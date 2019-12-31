const autoCompleteConfig = {
  renderOption: (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `
  },

  inputValue: (movie) => {
    return movie.Title
  },
  fetchData: async (searchTerm) => {
    try {
      const response = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: 'd7a0924e',
          // i: 'tt0848228',
          s: searchTerm,
        },
      })
      console.log('res => ', response.data)
      if (response.data.Error) return []

      return response.data.Search
    } catch (e) {
      console.error(e)
    }
  },
}

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
  },
})

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
  },
})

let leftMovie = null
let rightMovie = null

// request for single movie on select from autocomplete dropdown
const onMovieSelect = async (movie, summaryElement, side) => {
  try {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'd7a0924e',
        i: movie.imdbID,
      },
    })
    console.log(' response => ', response.data)
    summaryElement.innerHTML = movieTemplate(response.data)

    if (side === 'left') {
      leftMovie = response.data
    } else {
      rightMovie = response.data
    }

    if (leftMovie && rightMovie) {
      runCompareMovies(leftMovie, rightMovie)
    }
  } catch (e) {
    console.error(e)
  }
}

// compare movies data
const runCompareMovies = (leftMovie, rightMovie) => {}

// render movie
const movieTemplate = (movieDetail) => {
  // parsing fields
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
  const metaScore = parseInt(movieDetail.Metascore)
  const imdbRating = parseFloat(movieDetail.imdbRating)
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))

  debugger

  return `
    <article class="media">
    <figure class="media-left">
    <p class="image">
    <img src="${movieDetail.Poster}" alt="Poster">
    </p>
    </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
     <article class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
     <article class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
     <article class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
     <article class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
  `
}
