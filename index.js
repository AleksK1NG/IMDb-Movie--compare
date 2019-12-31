console.log('Hi there! ')
const fetchData = async (searchTerm) => {
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
}

const root = document.querySelector('.autocomplete')
root.innerHTML = `
  <label><b>Search For a Movie </b></label>
  <input type="text" class="input">
  <div class="dropdown">
   <div class="dropdown-menu">
    <div class="dropdown-content results">
        
    </div>
  </div> 
</div>
 
`

const input = document.querySelector('input')
const dropdown = document.querySelector('.dropdown')
const resultsWrapper = document.querySelector('.results')

const onInput = async (e) => {
  const movies = await fetchData(e.target.value)

  // close for empty response
  if (!movies.length) {
    dropdown.classList.remove('is-active')
    return
  }

  resultsWrapper.innerHTML = ''
  dropdown.classList.add('is-active')

  for (let movie of movies) {
    const option = document.createElement('a')

    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster

    option.classList.add('dropdown-item')
    option.innerHTML = `
      <img src="${imgSrc}" />
      <h1>${movie.Title}</h1>
    `

    resultsWrapper.appendChild(option)
  }
}

input.addEventListener('input', debounce(onInput, 300))

// close autocomplete dropdown
document.addEventListener('click', (e) => {
  console.log(e.target)
  if (!root.contains(e.target)) {
    dropdown.classList.remove('is-active')
  }
})
