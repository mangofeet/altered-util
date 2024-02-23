'use strict'

class Card extends HTMLElement {

  static observedAttributes = ['facing']
  
  dom
  src
  srcBack = "img/adventure-cards/ADV_CARD_BACK.png"
  facing = "up"
  rotation = 0
  img
  
  constructor() {
	super()

	this.dom = this.attachShadow({mode:"closed"})

	if (!this.hasAttribute("src")) {
	  throw new Error("src required on game-card")
	}
	this.src = this.getAttribute("src")

	if (this.hasAttribute("src-back")) {
	  this.srcBack = this.getAttribute("src-back")
	}

	if (this.hasAttribute("facing")) {
	  this.facing = this.getAttribute("facing")
	  if (this.facing != "up" && this.facing != "down") {
		throw new Error(`invalid facing ${this.facing}`)
	  }
	}

	if (this.hasAttribute("rotation")) {
	  this.rotation = parseInt(this.getAttribute("rotation"))
	}

	this.img = document.createElement('img')

	if (this.facing == "up") {
	  this.img.setAttribute('src', this.src)  
	} else if (this.facing == "down") {
	  this.img.setAttribute('src', this.srcBack)  
	}
	
	this.img.style.transform = `rotate(${this.rotation}deg)`
	// swap these due to the transform
	this.img.style['max-width'] = '100%'
	this.img.style.height = 'auto'

	this.img.onclick = (event) => {
	  const newFacing = this.facing == "up" ? "down" : "up"
	  this.setAttribute('facing', newFacing)
	}

	this.dom.appendChild(this.img)
  }

  attributeChangedCallback(name, oldValue, newValue) {
	switch (name) {
	case "facing":
	  
	  if (newValue != "up" && newValue != "down") {
		throw new Error(`invalid facing ${this.facing}`)
	  }
	  
	  this.facing = newValue
	  if (this.facing == "up") {
		this.img.setAttribute('src', this.src)  
	  } else if (this.facing == "down") {
		this.img.setAttribute('src', this.srcBack)  
	  }
	  break
	  
	default:
	  console.log(`${name} changed from ${oldValue} to ${newValue}`)
	}
  }
  
}

window.customElements.define('game-card', Card)
