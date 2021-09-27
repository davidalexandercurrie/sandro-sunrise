fetch('/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    handleData(data);
  })
  .catch(console.error);

function handleData(data) {
  let currentHour = new Date().getUTCHours();
  console.log(currentHour);
  let closestHours = [];
  let closestDistance = 24;
  //find closest hour
  data.data.forEach(element => {
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
  let srcs = data.data.filter(element =>
    closestHours.includes(element.sunrise)
  );
  let url = srcs[Math.floor(Math.random() * srcs.length)].url;

  //choose random element

  document.getElementById('iframe').src = url + '?mute=1&autoplay=1';
  document.getElementById('iframe-container').style.display = 'none';
}

setTimeout(() => {
  window.addEventListener('click', () => {
    document.getElementById('iframe-container').style.display = 'block';
  });
}, 5000);
