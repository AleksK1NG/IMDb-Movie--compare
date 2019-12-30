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
  } catch (e) {
    console.error(e)
  }
}

const input = document.querySelector('input')

const debounce = (fn, delay = 300) => {
  let timeoutId

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn.apply(null, args)
    }, delay)
  }
}

const onInput = (e) => {
  fetchData(e.target.value)
}

input.addEventListener('input', debounce(onInput, 300))
