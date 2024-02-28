'use strict'

const tumultCards = [
  {id: 1, src: 'img/adventure-cards/ADV_CARD_1.png'},
  {id: 2, src: 'img/adventure-cards/ADV_CARD_2.png', stats: [['m', 'w'], ['f']]},
  {id: 3, src: 'img/adventure-cards/ADV_CARD_3.png', stats: [['f', 'w'], ['m']]},
  {id: 4, src: 'img/adventure-cards/ADV_CARD_4.png', stats: [['f', 'm'], ['w']]},
  {
	id: 5,
	src: 'img/adventure-cards/ADV_CARD_5.png',
	srcBack: 'img/adventure-cards/ADV_CARD_BACK_2.jpg'
  },
]

const expeditionMarkers = [
  {hero: null, companion: null},
  {hero: null, companion: null},
]

let generatedTumultOrder

// ranmomizes the tumult cards and returns an array
function getTumultOrder () {

  if (generatedTumultOrder) return generatedTumultOrder
  
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

  generatedTumultOrder = resp
  
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

// registerServiceWorker()

function startGame() {
  document.getElementById('setup').style.display = "none"
  document.getElementById('footer').style.display = "none"
  document.getElementById('game').style.display = "flex"

  const controlP1 = document.getElementById('p1-control')
  controlP1.addEventListener('reset', () => resetCounters('p1'))
  controlP1.addEventListener('advancehero', () => advanceHero('p1'))
  controlP1.addEventListener('advancecompanion', () => advanceCompanion('p1'))
  controlP1.addEventListener('backuphero', () => backupHero('p1'))
  controlP1.addEventListener('backupcompanion', () => backupCompanion('p1'))

  const controlP2 = document.getElementById('p2-control')
  controlP2.addEventListener('reset', () => resetCounters('p2'))
  controlP2.addEventListener('advancehero', () => advanceHero('p2'))
  controlP2.addEventListener('advancecompanion', () => advanceCompanion('p2'))
  controlP2.addEventListener('backuphero', () => backupHero('p2'))
  controlP2.addEventListener('backupcompanion', () => backupCompanion('p2'))

  const tumult = document.getElementById('tumult')

  for (const card of getTumultOrder()) {
	tumult.appendChild(getAdventureCard(card))
  }

  expeditionMarkers[0].hero = createMarker('hero-lyra', 0, 1, 'hero')
  expeditionMarkers[0].companion = createMarker('companion-lyra', 7, 1, 'companion')
  expeditionMarkers[1].hero = createMarker('hero-muna', 0, 2, 'hero')
  expeditionMarkers[1].companion = createMarker('companion-muna', 7, 2, 'companion')

  highlightStats()
}

function highlightStats() {

  highlightStat(expeditionMarkers[0].hero, 'hero')
  highlightStat(expeditionMarkers[1].hero, 'hero')
  highlightStat(expeditionMarkers[0].companion, 'companion')
  highlightStat(expeditionMarkers[1].companion, 'companion')

}

function highlightStat(data) {
  const cardIndex = Math.ceil(data.pos/2)
  const tumult = getTumultOrder()

  const card = tumult[cardIndex]
  let stats = card.stats

  if (!stats) {
	stats = [['f', 'm', 'w'],['f', 'm', 'w']]
  }

  let stat
  
  if (data.pos%2 == 0) {
	if (card.rotation == 180) {
	  stat = stats[0]
	} else {
	  stat = stats[1]
	}
  } else {
	if (card.rotation == 180) {
	  stat = stats[1]
	} else {
	  stat = stats[0]
	}
  }

  const counter = document.getElementById(`p${data.player}-${data.expedition}`)
  counter.setAttribute('stat-highlight', stat.join(','))
}

function handleOrientationChange() {
  setTimeout(() => {
	if (expeditionMarkers[0].hero) setMarkerPosition(expeditionMarkers[0].hero.marker, expeditionMarkers[0].hero.pos, expeditionMarkers[0].hero.player)
	if (expeditionMarkers[1].hero)setMarkerPosition(expeditionMarkers[1].hero.marker, expeditionMarkers[1].hero.pos, expeditionMarkers[1].hero.player)
	if (expeditionMarkers[0].companion) setMarkerPosition(expeditionMarkers[0].companion.marker, expeditionMarkers[0].companion.pos, expeditionMarkers[0].companion.player)
	if (expeditionMarkers[1].companion) setMarkerPosition(expeditionMarkers[1].companion.marker, expeditionMarkers[1].companion.pos, expeditionMarkers[1].companion.player)
  }, 100)
}

screen.orientation.addEventListener("change", handleOrientationChange, true);

function advanceMarker(data) {
  if (data.marker.getAttribute('name').includes('companion')) {
	data.pos--
	if (data.pos < 0) data.pos = 0
  } else {
	data.pos++
	if (data.pos > 7) data.pos = 7
  }
  setMarkerPosition(data.marker, data.pos, data.player)
  
  highlightStats()
}

function unadvanceMarker(data) {
  if (data.marker.getAttribute('name').includes('companion')) {
	data.pos++
	if (data.pos > 7) data.pos = 7
  } else {
	data.pos--
	if (data.pos < 0) data.pos = 0
  }
  setMarkerPosition(data.marker, data.pos, data.player)
  highlightStats()
}

function createMarker(name, pos, player, expedition) {
  const marker = document.createElement('expedition-marker')
  marker.setAttribute('name', name)
  marker.style.transition = 'left 300ms'
  setMarkerPosition(marker, pos, player)
  document.getElementById('tumult').appendChild(marker)

  const data = {marker, pos, player, expedition}
  marker.onclick = () => {
	advanceMarker(data)
  }
  return data
}

function setMarkerPosition(marker, pos, player) {
  
  const cards = getAdventureCards()
  
  const cardIndex = Math.ceil(pos/2)

  for (let i = 0; i < cards.length; i++) {

	if (cardIndex != i) {
	  continue
	}
	
	const card = cards[i]

	if (card.getAttribute('facing') == 'down') {
	  card.setAttribute('facing', 'up')
	}

	const offset = card.offsetLeft
	const cardWidth = card.offsetWidth
	const cardHeight = card.offsetHeight
	const size = cardHeight / 3

	marker.style.position = 'absolute'

	marker.style.width = `${size}px`
	marker.style.height = `${size}px`

	let left = offset + (cardWidth/2) - (size/2)
	
	if (pos == 0) {
	  left = offset + ((cardWidth/3)*2) - (size/2)
	} else if (pos == 7){
	  left = offset + ((cardWidth/3)) - (size/2)
	} else if (pos % 2 == 1) {
	  left = offset + ((cardWidth/4)) - (size/2)
	} else if (pos % 2 == 0) {
	  left = offset + ((cardWidth/4)*3) - (size/2)
	}
	
	marker.style.left = `${left}px`
	
	let top = ((cardHeight/3)*2) - (size/2)
	if (player == 2) {
	  top = ((cardHeight/3)) - (size/2)
	}
	marker.style.top = `${top}px`

  }

  
}

function getAdventureCards() {

  const resp = []
  
  const tumult = document.getElementById('tumult')
  
  for (const child of tumult.children) {
	if (child.nodeName.toLowerCase() == 'game-card') {
	  resp.push(child)
	}
  }

  return resp
  
}

function getAdventureCard(data) {
  const card = document.createElement('game-card')
  card.style.display = 'flex'
  card.style.alignItems = 'center'

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


function resetCounters(player) {
  document.getElementById(`${player}-hero`).setAttribute('reset', true)
  document.getElementById(`${player}-companion`).setAttribute('reset', true)
}

function advanceHero(player) {
  console.log('advance hero', player)
  let data

  switch (player) {
  case 'p1':
	data = expeditionMarkers[0].hero
	break
  case 'p2':
	data = expeditionMarkers[1].hero
	break
  }
  advanceMarker(data)
}

function advanceCompanion(player) {
  let data

  switch (player) {
  case 'p1':
	data = expeditionMarkers[0].companion
	break
  case 'p2':
	data = expeditionMarkers[1].companion
	break
  }
  advanceMarker(data)
}

function backupHero(player) {
  console.log('advance hero', player)
  let data

  switch (player) {
  case 'p1':
	data = expeditionMarkers[0].hero
	break
  case 'p2':
	data = expeditionMarkers[1].hero
	break
  }
  unadvanceMarker(data)
}

function backupCompanion(player) {
  let data

  switch (player) {
  case 'p1':
	data = expeditionMarkers[0].companion
	break
  case 'p2':
	data = expeditionMarkers[1].companion
	break
  }
  unadvanceMarker(data)
}
