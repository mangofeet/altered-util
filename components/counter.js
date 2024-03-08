'use strict'

class Counter extends HTMLElement {

  static observedAttributes = ['stat-highlight', 'reset']
  
  dom

  counts = {
	water: 0,
	mountain: 0,
	forest: 0
  }

  containers = {
	water: null,
	mountain: null,
	forest: null
  }
  
  counters = {
	water: null,
	mountain: null,
	forest: null
  }
  
  constructor() {
	super()

	this.dom = this.attachShadow({mode:"closed"})

	this.counters.forest = makeCounterValue('forest', this.counts.forest)
	this.counters.mountain = makeCounterValue('mountain', this.counts.forest)
	this.counters.water = makeCounterValue('water', this.counts.forest)
	
	this.containers.forest = makeContainer('forest', '#546d1a', this.counters.forest)
	this.containers.mountain = makeContainer('mountain', '#8d5b32', this.counters.mountain)
	this.containers.water = makeContainer('water', '#3a6385', this.counters.water)

	const container = document.createElement('div')
	container.style.display = 'flex'
	container.style.height = '100%'
	container.style['align-items'] = 'stretch'

	if (this.hasAttribute('flipped')) {
	  container.style.transform = 'rotate(180deg)'
	  container.appendChild(this.containers.water)
	  container.appendChild(this.containers.mountain)
	  container.appendChild(this.containers.forest)
	} else {
	  container.appendChild(this.containers.forest)
	  container.appendChild(this.containers.mountain)
	  container.appendChild(this.containers.water)
	}
	
	
	this.containers.forest.onclick = this.makeIncrementFunc('forest')
	this.containers.mountain.onclick = this.makeIncrementFunc('mountain')
	this.containers.water.onclick = this.makeIncrementFunc('water')
	
	this.dom.appendChild(container)
  }


  makeIncrementFunc(key) {
	const self = this
	return (evt) => {
	  const thisWidth = evt.currentTarget.clientWidth
	  const offset = evt.offsetX
	  if (offset < thisWidth/2) {
		self.counts[key] -= 1
	  } else {
		self.counts[key] += 1
	  }
	  if (self.counts[key] < 0) self.counts[key] = 0
	  self.counters[key].innerHTML = `${this.counts[key]}`
	  self.dispatchEvent(new CustomEvent("change", {
		detail: {key, value: self.counts[key], count: [self.counts.forest, self.counts.mountain, self.counts.water]},
		bubbles: true,
		cancelable: false,
		composed: true,
	  }))

	}
  }

  attributeChangedCallback(name, oldValue, newValue) {
	switch (name) {
	case 'stat-highlight':
	  const stats = newValue.split(',')
	  this.highlightContainers(stats)
	  
	  break
	case 'reset':
	  if (newValue == 'true' || newValue == true) {
		this.counts.forest = 0
		this.counters.forest.innerHTML = `${this.counts.forest}`
		this.counts.mountain = 0
		this.counters.mountain.innerHTML = `${this.counts.mountain}`
		this.counts.water = 0
		this.counters.water.innerHTML = `${this.counts.water}`
		this.setAttribute('reset', false)
		this.dispatchEvent(new CustomEvent("change", {
		  detail: {count: [0, 0, 0]},
		  bubbles: true,
		  cancelable: false,
		  composed: true,
		}))

	  }
	  break
	}
  }

  unhighlightContainers() {
	unhighlightContainer(this.containers.forest)
	unhighlightContainer(this.containers.mountain)
	unhighlightContainer(this.containers.water)
  }

  highlightContainers(stats) {
	this.unhighlightContainers()
	for (const stat of stats) {
	  switch (stat) {
	  case 'f':
		highlightContainer(this.containers.forest)
		break
	  case 'm':
		highlightContainer(this.containers.mountain)
		break
	  case 'w':
		highlightContainer(this.containers.water)
		break
	  }
	}
  }

}

function highlightContainer(node) {
  // node.style.border = '3px solid gold'
  node.style.color = '#dcdccc'
  for (const child of node.children) {
	if (child.id == 'top-overlay') {
	  const filter = 'brightness(100%)'
	  child.style.backdropFilter = filter
	  child.style['-webkit-backdrop-filter'] = filter
	}
  }
}

function unhighlightContainer(node) {
  // node.style.border = '3px solid grey'
  node.style.color = '#dcdccc'
  for (const child of node.children) {
	if (child.id == 'top-overlay') {
	  const filter = 'brightness(40%)'
	  child.style.backdropFilter = filter
	  child.style['-webkit-backdrop-filter'] = filter
	}
  }
}

function makeCounterValue(label, value) {
  const val = document.createElement('span')
  val.innerHTML = `${value}`
  val.style.position = 'absolute'
  val.style.width = '100%'
  val.style.top = '40%'
  val.style.left = '0'
  val.style.textAlign = 'center'
  val.style.fontSize = '2.7em'
  val.id = `counter-${label}`
  
  return val
}

function makeContainer(label, color, counter) {
  const container = document.createElement('div')
  container.style.flex = '1'
  container.style.height = '100%'
  container.style.background = `${color} url("img/${label}.png") no-repeat 50% 5%`
  container.style.backgroundBlendMode = 'overlay'
  container.style.color = '#dcdccc'
  container.style.position = 'relative'

  const blur = document.createElement('div')
  blur.style.position = 'absolute'
  blur.style.top = 0
  blur.style.left = 0
  blur.style.width = '100%'
  blur.style.height = '100%'
  const blurBackdropFilter = 'blur(1px)'
  blur.style.backdropFilter = blurBackdropFilter
  blur.style['-webkit-backdrop-filter'] = blurBackdropFilter

  const plus = document.createElement('div')
  plus.style.position = 'absolute'
  plus.style.top = 0
  plus.style.left = '50%'
  plus.style.width = '50%'
  plus.style.height = '100%'
  plus.innerHTML = '+'
  plus.style.textAlign = 'center'
  plus.style.fontSize = '2em'

  const minus = document.createElement('div')
  minus.style.position = 'absolute'
  minus.style.top = 0
  minus.style.left = 0
  minus.style.width = '50%'
  minus.style.height = '100%'
  const minusBackdropFilter = 'brightness(85%)'
  minus.style.backdropFilter = minusBackdropFilter
  minus.style['-webkit-backdrop-filter'] = minusBackdropFilter
  minus.innerHTML = '-'
  minus.style.textAlign = 'center'
  minus.style.fontSize = '2em'

  const clicker = document.createElement('div')
  clicker.style.position = 'absolute'
  clicker.style.top = 0
  clicker.style.left = 0
  clicker.style.width = '100%'
  clicker.style.height = '100%'
  clicker.id = 'top-overlay'

  container.appendChild(blur)
  container.appendChild(plus)
  container.appendChild(minus)
  container.appendChild(counter)
  container.appendChild(clicker)

  return container
}

window.customElements.define('game-counter', Counter)
