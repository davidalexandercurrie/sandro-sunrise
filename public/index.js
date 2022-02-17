let track = Math.floor(Math.random() * 7);
let buttonActive = true;

let sounds = [];

function playNext() {
  track = (track + 1) % 7;
  sounds[track].play();
  document.getElementById('svg').src = `Images/${track + 1}.svg`;
  console.log(`${track} is playing`);
}

window.onload = () => {
  document.getElementById('play-button').addEventListener('click', e => {
    e.target.style.display = 'none';
    document.getElementById('svg').src = `Images/${track + 1}.svg`;
    document.getElementById('iframe').style.display = 'block';
    document.getElementById('svg').style.display = 'block';
    buttonActive = false;
    playNext();
    toggleFullScreen();
  });
  document.getElementById('fs-button').addEventListener('click', () => {
    toggleFullScreen();
    e.target.style.display = 'none';
  });
};

(function () {
  var mouseTimer = null,
    cursorVisible = true;

  function disappearCursor() {
    mouseTimer = null;
    document.body.style.cursor = 'none';
    cursorVisible = false;
    document.getElementById('fs-button').style.display = 'none';
  }

  document.onmousemove = function () {
    if (mouseTimer) {
      window.clearTimeout(mouseTimer);
    }
    if (!cursorVisible) {
      document.body.style.cursor = 'default';
      cursorVisible = true;
    }
    if (document.fullscreenElement === null && !buttonActive) {
      document.getElementById('fs-button').style.display = 'block';
    }
    mouseTimer = window.setTimeout(disappearCursor, 3000);
  };
})();

for (let i = 0; i < 7; i++) {
  sounds[i] = new Howl({
    src: [`audio/danze-00${i + 1}.mp3`],
    volume: 1,
    onend: () => playNext(),
  });
  console.log(sounds[i]);
}

window.onclick = () => {
  if (!buttonActive) {
    sounds[track].stop();
    playNext();
  }
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

function toggleFullScreen() {
  if (document.fullscreenElement === null) {
    document.getElementById('fs-button').style.display = 'none';
  }
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  var cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}
