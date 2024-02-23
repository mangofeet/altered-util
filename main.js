'use strict'

const tumultCards = [
  {id: 1, img: ''},
  {id: 2, img: ''},
  {id: 3, img: ''},
  {id: 4, img: ''},
  {id: 5, img: ''},
]

// ranmomizes the tumult cards and returns an array
function getTumultOrder () {

  console.log(randInt(tumultCards.length))
  
}

function randInt(max, min = 0) {
  const range = max - min
  
  return Math.floor((Math.random() * range) + min)
}

function date() {
  return new Date().toLocaleString()
}

function addListener(elementID, event, func) {
  const el = document.getElementById(elementID)
  el.addEventListener(event, func)
  return function() {
    el.removeEventListener(event, func)
  }
}

const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      './sw.js',
      {
        scope: '/altered/',
      }
    );
    if (registration.installing) {
      console.log('Service worker installing');
    } else if (registration.waiting) {
      console.log('Service worker installed');
    } else if (registration.active) {
      console.log('Service worker active');
    }
  } catch (error) {
    console.error(`Registration failed with ${error}`);
  }
}

registerServiceWorker()

function startGame() {
  document.getElementById('setup').style.display = "none"
  document.getElementById('footer').style.display = "none"
  document.getElementById('game').style.display = "flex"
}
