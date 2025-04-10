export function getFechaTijuana(callback) {
    fetch('http://worldtimeapi.org/api/timezone/America/Tijuana')
      .then(res => res.json())
      .then(data => callback(data.datetime))
      .catch(() => callback(new Date().toISOString()));
  }
  