'use strict'

class Card extends HTMLElement {

  static observedAttributes = ['facing', 'src', 'src-back', 'rotation']
  
  dom
  src
  srcBack = "img/adventure-cards/ADV_CARD_BACK.png"
  facing = "down"
  rotation = 0
  img
  
  constructor() {
	super()

	this.dom = this.attachShadow({mode:"closed"})

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
	this.img.style['max-width'] = '100%'
	this.img.style.width = '100%'
	this.img.style.height = 'auto'
	this.img.style.maxHeight = '500px'
	this.img.style.transition = `max-height 300ms linear`

	this.dom.appendChild(this.img)
  }

  attributeChangedCallback(name, oldValue, newValue) {
	switch (name) {
	case "facing":
	  
	  if (newValue != "up" && newValue != "down") {
		throw new Error(`invalid facing ${this.facing}`)
	  }
	  
	  this.img.style.maxHeight = 0
	  
	  setTimeout(() => {
		this.img.setAttribute('src', '')  
		this.facing = newValue
		if (this.facing == "up") {
		  this.img.setAttribute('src', this.src)  
		} else if (this.facing == "down") {
		  this.img.setAttribute('src', this.srcBack)  
		}
		this.img.style.maxHeight = '500px'
		
	  }, 300)
	  
	  
	  break
	  
	case "src":
	  
	  this.src = newValue
	  if (this.facing == "up") {
		this.img.setAttribute('src', this.src)  
	  }
	  break
	  
	case "src-back":
	  
	  this.srcBack = newValue
	  if (this.facing == "down") {
		this.img.setAttribute('src', this.srcBack)  
	  }
	  break
	  
	case "rotation":
	  
	  this.rotation = parseInt(newValue)
	  this.img.style.transform = `rotate(${this.rotation}deg)`
	  break
	  
	default:
	  console.log(`${name} changed from ${oldValue} to ${newValue}`)
	}
  }
  
}

window.customElements.define('game-card', Card)
