'use strict'

class Control extends HTMLElement {

  dom

  constructor() {
	super()

	this.dom = this.attachShadow({mode:"closed"})

	
  }

  
}


window.customElements.define('game-control', Control)
