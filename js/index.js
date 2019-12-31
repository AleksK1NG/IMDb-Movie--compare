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
const runCompareMovies = (leftMovie, rightMovie) => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification')
  const rightSideStats = document.querySelectorAll('#right-summary .notification')

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index]

    const leftStatValue = leftStat.dataset.value
    const rightStatValue = rightStat.dataset.value

    if (rightStatValue > leftStatValue) {
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    } else {
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  })
}

// render movie
const movieTemplate = (movieDetail) => {
  // parsing fields
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
  const metaScore = parseInt(movieDetail.Metascore)
  const imdbRating = parseFloat(movieDetail.imdbRating)
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))
  const awards = movieDetail.Awards.split(' ').reduce((acc, word) => {
    const value = parseInt(word)
    if (isNaN(value)) {
      return acc
    } else {
      return acc + value
    }
  }, 0)

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
    <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
     <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
     <article data-value=${metaScore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
     <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
     <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
  `
}
