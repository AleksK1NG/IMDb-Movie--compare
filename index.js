console.log('Hi there! ')
const fetchData = async () => {
  try {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'd7a0924e',
        s: 'avengers',
      },
    })

    console.log('res => ', response.data)
  } catch (e) {
    console.error(e)
  }
}

fetchData()
