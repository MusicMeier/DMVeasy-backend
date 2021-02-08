const app = require('express')();
const PORT = 2021

app.get('/', (request, response) => {
  response.json({message: "Sup, DMVeasy crew!"})
});

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));