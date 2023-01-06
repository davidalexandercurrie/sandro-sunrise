import express from 'express';
import axios from 'axios';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

let streams;
let dataReady;
let data;

console.log('hi');

app.get('/data', function (req, res) {
  res.end(JSON.stringify({ data: data }));
});

app.listen(port);

streamData();

function streamData() {
  axios
    .get('https://api.npoint.io/568578fc942eb0fd597e')
    .then(response => {
      // handle success
      data = response.data.streams;
      console.log(data);
      prepareData(data, 0);
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
  return data;
}

function prepareData(input, index) {
  axios
    .get(
      `https://api.sunrise-sunset.org/json?lat=${input[index].location[0]}&lng=${input[index].location[1]}&formatted=0
  `
    )
    .then(response => {
      // handle success
      let sunrise = new Date(response.data.results.sunrise).getUTCHours();
      data[index].sunrise = sunrise;

      if (index + 1 < data.length) {
        prepareData(input, index + 1);
      } else {
        console.log(data);
        dataReady = true;
        dataLoaded();
      }
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
}

function dataLoaded() {
  data = data.sort((a, b) => {
    return a.sunrise - b.sunrise;
  });
  console.log(data);
}
