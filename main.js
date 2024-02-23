'use strict'

const tumultCards = [
  {id: 1, src: 'img/adventure-cards/ADV_CARD_1.png'},
  {id: 2, src: 'img/adventure-cards/ADV_CARD_2.png'},
  {id: 3, src: 'img/adventure-cards/ADV_CARD_3.png'},
  {id: 4, src: 'img/adventure-cards/ADV_CARD_4.png'},
  {
	id: 5,
	src: 'img/adventure-cards/ADV_CARD_5.png',
	srcBack: 'img/adventure-cards/ADV_CARD_BACK_2.jpg'
  },
]

// ranmomizes the tumult cards and returns an array
function getTumultOrder () {

  const hero = tumultCards[0]
  const companion = tumultCards[4]

  const resp = [hero]
  const middle = [tumultCards[1], tumultCards[2], tumultCards[3]]

  while (middle.length) {
	const index = randInt(middle.length)
	const card = middle.splice(index, 1)[0]
	if (randInt(2) >= 1) {
	  card.rotation = 180
	}
	resp.push(card)
  }

  resp.push(companion)

  return resp
  
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

  const tumult = document.getElementById('tumult')

  for (const card of getTumultOrder()) {
	tumult.appendChild(getAdventureCard(card))
  }
  
}

function getAdventureCard(data) {
  const card = document.createElement('game-card')
  card.setAttribute('src', data.src)
  if (data.srcBack) {
	card.setAttribute('src-back', data.srcBack)
  }

  card.setAttribute('rotation', data.rotation || 0)
  
  if (data.id == 1 || data.id == 5) {
	card.setAttribute('facing', 'up')
  } else {
	card.setAttribute('facing', 'down')
  }

  return card
}
