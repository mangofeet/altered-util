'use strict'

class Counter extends HTMLElement {

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

	this.containers.forest = makeContainer('forest', '#94ad5a')
	this.containers.mountain = makeContainer('mountain', '#ad7b52')
	this.containers.water = makeContainer('water', '#5a73a5')

	const container = document.createElement('div')
	container.style.display = 'flex'
	container.style.height = '100%'
	container.style['align-items'] = 'stretch'

	container.appendChild(this.containers.forest)
	container.appendChild(this.containers.mountain)
	container.appendChild(this.containers.water)

	
	this.counters.forest = makeCounterValue('forest', this.counts.forest)
	this.counters.mountain = makeCounterValue('mountain', this.counts.forest)
	this.counters.water = makeCounterValue('water', this.counts.forest)

	this.containers.forest.appendChild(this.counters.forest)
	this.containers.mountain.appendChild(this.counters.mountain)
	this.containers.water.appendChild(this.counters.water)

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
	}
  }
}

function makeCounterValue(label, value) {
  const val = document.createElement('span')
  val.style.color = '#dcdccc'
  val.innerHTML = `${value}`
  val.style.position = 'absolute'
  val.style.width = '100%'
  val.style.top = '40%'
  val.style.left = '0'
  val.style.textAlign = 'center'
  val.style.fontSize = '3em'
  val.id = `counter-${label}`
  
  return val
}

function makeContainer(label, color) {
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
  blur.style.backdropFilter = 'blur(1px)'

  container.appendChild(blur)

  return container
}

window.customElements.define('game-counter', Counter)
