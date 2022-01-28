let track = 0;

let sounds = [];

function playNext() {
  track = (track + 1) % 3;
  sounds[track].play();
  document.getElementById('svg').src = `Images/${track + 1}.svg`;
}

for (let i = 0; i < 3; i++) {
  sounds[i] = new Howl({
    src: [`audio/danze${i + 1}.mp3`],
    volume: 1,
    onend: () => playNext(),
  });
}

window.onclick = () => {
  sounds[track].stop();
  playNext();
};

fetch('/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    handleData(data);
  })
  .catch(console.error);

function handleData({ data }) {
  let currentHour = new Date().getUTCHours();
  console.log(currentHour);
  let closestHours = [];
  let closestDistance = 24;
  //find closest hour
  data.forEach(element => {
    let distance = Math.abs(currentHour - element.sunrise);
    distance = distance > 12 ? 24 - distance : distance;
    if (distance < closestDistance) {
      closestDistance = distance;
      closestHours = [];
      closestHours = [element.sunrise];
    } else if (closestDistance === distance) {
      if (closestHours.includes(distance) !== false) {
        closestHours.push(element.sunrise);
      }
      console.log(closestHours, closestDistance);
    }
  });
  //get all elements with same hour
  let srcs = data.filter(element => closestHours.includes(element.sunrise));
  let url = srcs[Math.floor(Math.random() * srcs.length)].url;

  //choose random element

  document.getElementById('iframe').src = url + '?mute=1&autoplay=1';
  // document.getElementById('iframe-container').style.display = 'none';
}

window.addEventListener('click', () => {
  document.getElementById('iframe-container').style.display = 'block';
  // start audio
});

function reportWindowSize() {
  document.getElementById('svg').style.top =
    ((window.innerWidth / 16) * 9 * 35) / 100 + 'px';
}

window.onresize = reportWindowSize;
