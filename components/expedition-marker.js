'use strict'

class ExpeditionMarker extends HTMLElement {

  static observedAttributes = ['name']
  
  dom
  img
  src
  
  constructor() {
	super()

	this.dom = this.attachShadow({mode:"closed"})

	this.img = document.createElement('img')
	this.img.style['max-width'] = '100%'
	this.img.style.width = '100%'
	this.img.style.height = 'auto'
	this.img.style.maxHeight = '500px'
	
	this.handleName(this.getAttribute("name"))


	this.dom.appendChild(this.img)
  }

  handleName(name) {
	this.src = `img/expedition-markers/${name}.png`
	this.img.setAttribute('src', this.src)
  }

  attributeChangedCallback(name, oldValue, newValue) {
	switch (name) {
	case "name":
	  
	  this.handleName(newValue)
	  
	  break
	  
	default:
	  console.log(`${name} changed from ${oldValue} to ${newValue}`)
	}
  }
  
}

window.customElements.define('expedition-marker', ExpeditionMarker)
