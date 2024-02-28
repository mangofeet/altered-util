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

const expeditionMarkers = {
  p1: {hero: null, companion: null},
  p2: {hero: null, companion: null},
}

const currentStats = {
  p1: {
	target: {
	  hero: [true, true, true],
	  companion: [true, true, true]
	},
	current: {
	  hero: [0, 0, 0],
	  companion: [0, 0, 0]
	},
	defender: {
	  hero: false,
	  companion: false,
	}
  },
  p2: {
	target: {
	  hero: [true, true, true],
	  companion: [true, true, true]
	},
	current: {
	  hero: [0, 0, 0],
	  companion: [0, 0, 0]
	},
	defender: {
	  hero: false,
	  companion: false,
	}
  }
}



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

registerServiceWorker()

function startGame() {
  document.getElementById('setup').style.display = "none"
  document.getElementById('footer').style.display = "none"
  document.getElementById('game').style.display = "flex"

  const controlP1 = document.getElementById('p1-control')
  controlP1.addEventListener('reset', () => resetCounters('p1'))
  controlP1.addEventListener('advance', processAdvancement)
  controlP1.addEventListener('advancehero', () => advanceHero('p1'))
  controlP1.addEventListener('advancecompanion', () => advanceCompanion('p1'))
  controlP1.addEventListener('backuphero', () => backupHero('p1'))
  controlP1.addEventListener('backupcompanion', () => backupCompanion('p1'))
  controlP1.addEventListener('defenderhero', () => defenderHero('p1'))
  controlP1.addEventListener('defendercompanion', () => defenderCompanion('p1'))

  const controlP2 = document.getElementById('p2-control')
  controlP2.addEventListener('reset', () => resetCounters('p2'))
  controlP2.addEventListener('advance', processAdvancement)
  controlP2.addEventListener('advancehero', () => advanceHero('p2'))
  controlP2.addEventListener('advancecompanion', () => advanceCompanion('p2'))
  controlP2.addEventListener('backuphero', () => backupHero('p2'))
  controlP2.addEventListener('backupcompanion', () => backupCompanion('p2'))
  controlP2.addEventListener('defenderhero', () => defenderHero('p2'))
  controlP2.addEventListener('defendercompanion', () => defenderCompanion('p2'))

  document.getElementById('p1-hero').addEventListener("change", (evt) => handleStatChange('p1', 'hero', evt.detail))
  document.getElementById('p1-companion').addEventListener("change", (evt) => handleStatChange('p1', 'companion', evt.detail))
  document.getElementById('p2-hero').addEventListener("change", (evt) => handleStatChange('p2', 'hero', evt.detail))
  document.getElementById('p2-companion').addEventListener("change", (evt) => handleStatChange('p2', 'companion', evt.detail))
  
  const tumult = document.getElementById('tumult')

  for (const card of getTumultOrder()) {
	tumult.appendChild(getAdventureCard(card))
  }

  expeditionMarkers['p1'].hero = createMarker('hero-lyra', 0, 'p1', 'hero')
  expeditionMarkers['p1'].companion = createMarker('companion-lyra', 7, 'p1', 'companion')
  expeditionMarkers['p2'].hero = createMarker('hero-muna', 0, 'p2', 'hero')
  expeditionMarkers['p2'].companion = createMarker('companion-muna', 7, 'p2', 'companion')

  highlightStats()

  
  
}

function highlightStats() {

  highlightStat(expeditionMarkers['p1'].hero, 'hero')
  highlightStat(expeditionMarkers['p2'].hero, 'hero')
  highlightStat(expeditionMarkers['p1'].companion, 'companion')
  highlightStat(expeditionMarkers['p2'].companion, 'companion')

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

  const target = [false, false, false]
  for (const s of stat) {
	switch (s) {
	case 'f':
	  target[0] = true
	  break
	case 'm':
	  target[1] = true
	  break
	case 'w':
	  target[2] = true
	  break
	}
  }
  currentStats[data.player].target[data.expedition] = target

  const counter = document.getElementById(`${data.player}-${data.expedition}`)
  counter.setAttribute('stat-highlight', stat.join(','))
}

function handleOrientationChange() {
  setTimeout(() => {

	processExpeditions((player, expedition) => {
	  if (expeditionMarkers[player][expedition])
		setMarkerPosition(
		  expeditionMarkers[player][expedition].marker,
		  expeditionMarkers[player][expedition].pos,
		  expeditionMarkers[player][expedition].player
		)
	})
	
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

function backupMarker(data) {
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
	if (player == 'p2') {
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
  let data

  switch (player) {
  case 'p1':
	data = expeditionMarkers['p1'].hero
	break
  case 'p2':
	data = expeditionMarkers['p2'].hero
	break
  }
  advanceMarker(data)
}

function advanceCompanion(player) {
  let data

  switch (player) {
  case 'p1':
	data = expeditionMarkers['p1'].companion
	break
  case 'p2':
	data = expeditionMarkers['p2'].companion
	break
  }
  advanceMarker(data)
}

function backupHero(player) {
  let data

  switch (player) {
  case 'p1':
	data = expeditionMarkers['p1'].hero
	break
  case 'p2':
	data = expeditionMarkers['p2'].hero
	break
  }
  backupMarker(data)
}

function backupCompanion(player) {
  let data

  switch (player) {
  case 'p1':
	data = expeditionMarkers['p1'].companion
	break
  case 'p2':
	data = expeditionMarkers['p2'].companion
	break
  }
  backupMarker(data)
}

function defenderHero(player) {
  currentStats[player].defender.hero = true
}

function defenderCompanion(player) {
  currentStats[player].defender.companion = true
}

function handleStatChange(player, expedition, data) {
  currentStats[player].current[expedition] = data.count
}

function processAdvancement() {
  processExpeditions((player, expedition) => {
	if (checkAdvancement(player, expedition)) {
	  advanceMarker(expeditionMarkers[player][expedition])
	}
  })
  document.getElementById('p1-control').setAttribute('reset', true)
  document.getElementById('p2-control').setAttribute('reset', true)
  resetCounters('p1')
  resetCounters('p2')
}


function checkAdvancement(player, expedition) {
  const otherPlayer = player == 'p1' ? 'p2' : 'p1'
  
  if (currentStats[player].defender[expedition]) {
	return false
  }
  
  const results = []
  
  for (let i = 0; i < currentStats[player].target[expedition].length; i++) {
	const isTarget = currentStats[player].target[expedition][i]
	if (!isTarget) continue

	results.push(currentStats[player].current[expedition][i] > currentStats[otherPlayer].current[expedition][i])

  }

  return !results.every(v => !v)
}

function processExpeditions(f = (player, expedition) => {}) {
  for (const player of ['p1', 'p2']) {
	for (const expedition of ['hero', 'companion']) {
	  f(player, expedition)
	}
  }
}
