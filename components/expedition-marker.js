'use strict'

class ExpeditionMarker extends HTMLElement {

  static observedAttributes = ['name', 'flipped', 'advancing']
  
  dom
  container
  img
  forward
  src
  
  constructor() {
	super()

	this.dom = this.attachShadow({mode:"closed"})

	this.container = document.createElement('div')
	
	this.container.style.position = 'relative'
	
	this.img = document.createElement('img')
	this.img.style['max-width'] = '100%'
	this.img.style.width = '100%'
	this.img.style.height = 'auto'
	this.img.style.maxHeight = '500px'
	this.img.style.borderRadius = '50%'
	
	this.forward = document.createElement('img')
	this.forward.setAttribute('src', 'img/expedition-markers/arrow.png')
	this.forward.style['max-width'] = '100%'
	this.forward.style.width = '100%'
	this.forward.style.height = 'auto'
	this.forward.style.maxHeight = '500px'
	this.forward.style.position = 'absolute'
	this.forward.style.top = '0'
	this.forward.style.left = '50%'
	this.forward.style.display = 'none'

	this.container.appendChild(this.img)
	this.container.appendChild(this.forward)
	
	this.dom.appendChild(this.container)
	
	this.handleName()
	this.handleFlipped()
	this.handleAdvancing()
  }

  getExpedition() {
	if (!this.src) return ''
	if (this.src.includes('companion')) {
	  return 'companion'
	} else if (this.src.includes('hero')) {
	  return 'hero'
	}
  }

  setForwardSide() {
	switch (this.getExpedition()) {
	case 'hero':
	  this.forward.style.top = '0'
	  this.forward.style.left = '50%'
	  this.forward.style.transform = 'scaleX(1)'
	  break
	case 'companion':
	  this.forward.style.top = '0'
	  this.forward.style.left = '-50%'
	  this.forward.style.transform = 'scaleX(-1)'
	  break
	}
  }
  
  handleFlipped() {
	if (this.hasAttribute('flipped')) {
	  this.img.style.transform = 'rotate(180deg)'
	}
  }

  handleName() {
	const name = this.getAttribute("name")
	this.src = `img/expedition-markers/${name}.png`
	this.img.setAttribute('src', this.src)
	this.setForwardSide()
  }

  getFaction() {
	const name = this.getAttribute("name")
	if (!name) return
	const parts = name.split('-')
	if (parts.length != 2) return
	return parts[1]
  }
  
  handleAdvancing() {
	let display = 'none'
	let boxShadow = ''
	let boxShadowColor = 'gold'

	switch (this.getFaction()) {
	case 'axiom':
	  boxShadowColor = 'brown'
	  break
	case 'bravos':
	  boxShadowColor = 'red'
	  break
	case 'lyra':
	  boxShadowColor = 'pink'
	  break
	case 'muna':
	  boxShadowColor = 'green'
	  break
	case 'ordis':
	  boxShadowColor = 'blue'
	  break
	case 'yzmir':
	  boxShadowColor = 'purple'
	  break
	default:
	  boxShadowColor = 'gold'
	}
	
	if (this.getAttribute('advancing')) {
	  display = 'block'
	  boxShadow = `0 0 10px 5px ${boxShadowColor}`
	}

	this.img.style.boxShadow = boxShadow
	
	this.forward.style.display = display

  }

  attributeChangedCallback(name, oldValue, newValue) {
	switch (name) {
	case "name":
	  this.handleName(newValue)
	  break
	  
	case "flipped":
	  this.handleFlipped()
	  break
	  
	case "advancing":
	  this.handleAdvancing()
	  break
	  
	default:
	  console.log(`${name} changed from ${oldValue} to ${newValue}`)
	}
  }
  
}

window.customElements.define('expedition-marker', ExpeditionMarker)
