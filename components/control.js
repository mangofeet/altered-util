'use strict'

class Control extends HTMLElement {

  static observedAttributes = ['reset']


  dom


  containerManual
  containerAuto

  btnDefenderHero
  btnDefenderCompanion

  constructor() {
	super()

	this.dom = this.attachShadow({mode:"closed"})

	this.containerManual = document.createElement('div')
	this.containerManual.style.display = 'none'
	this.containerManual.style.flexDirection = 'column'
	this.containerManual.style.height = '100%'
	this.containerManual.style['align-items'] = 'stretch'

	this.containerAuto = document.createElement('div')
	this.containerAuto.style.display = 'flex'
	this.containerAuto.style.flexDirection = 'column'
	this.containerAuto.style.height = '100%'
	this.containerAuto.style['align-items'] = 'stretch'

	const isFlipped = this.hasAttribute('flipped')
	if (isFlipped) {
	  this.containerManual.style.transform = 'rotate(180deg)'
	  this.containerAuto.style.transform = 'rotate(180deg)'
	}

	const btnAdvance = this.makeButton("Advance", "advance")
	const btnReset = this.makeButton("Reset Counters", "reset")
	
	const btnSwitchToManual = this.makeButton("Manual Mode", "manualmode", () => this.switchToManual())
	const btnSwitchToAuto = this.makeButton("Auto Mode", "automode", () => this.switchToAuto())
	
	const containerAdvance = document.createElement('div')
	containerAdvance.style.display = 'flex'
	containerAdvance.style.flexDirection = 'row'
	containerAdvance.style.flex = '2'
	containerAdvance.style.height = '100%'
	containerAdvance.style['align-items'] = 'stretch'
	
	const btnAdvanceHero = this.makeButton("H+", "advancehero")
	const btnAdvanceCompanion = this.makeButton("C+", "advancecompanion")

	if (isFlipped) {
	  containerAdvance.appendChild(btnAdvanceCompanion)
	  containerAdvance.appendChild(btnAdvanceHero)
	} else {
	  containerAdvance.appendChild(btnAdvanceHero)
	  containerAdvance.appendChild(btnAdvanceCompanion)
	}
	
	const containerBackup = document.createElement('div')
	containerBackup.style.display = 'flex'
	containerBackup.style.flexDirection = 'row'
	containerBackup.style.flex = '2'
	containerBackup.style.height = '100%'
	containerBackup.style['align-items'] = 'stretch'
	
	const btnBackupHero = this.makeButton("H-", "backuphero")
	const btnBackupCompanion = this.makeButton("C-", "backupcompanion")
	
	if (isFlipped) {
	  containerBackup.appendChild(btnBackupCompanion)
	  containerBackup.appendChild(btnBackupHero)
	} else {
	  containerBackup.appendChild(btnBackupHero)
	  containerBackup.appendChild(btnBackupCompanion)
	}
	
	const containerDefender = document.createElement('div')
	containerDefender.style.display = 'flex'
	containerDefender.style.flexDirection = 'row'
	containerDefender.style.flex = '2'
	containerDefender.style.height = '100%'
	containerDefender.style['align-items'] = 'stretch'
	
	this.btnDefenderHero = this.makeButton("H Def", "defenderhero", (evt, btn) => buttonToggle(btn))
	this.btnDefenderCompanion = this.makeButton("C Def", "defendercompanion", (evt, btn) => buttonToggle(btn))
	
	if (isFlipped) {
	  containerDefender.appendChild(this.btnDefenderCompanion)
	  containerDefender.appendChild(this.btnDefenderHero)
	} else {
	  containerDefender.appendChild(this.btnDefenderHero)
	  containerDefender.appendChild(this.btnDefenderCompanion)
	}
	
	this.containerManual.appendChild(btnReset)
	this.containerManual.appendChild(containerAdvance)
	this.containerManual.appendChild(containerBackup)
	this.containerManual.appendChild(btnSwitchToAuto)
	
	this.containerAuto.appendChild(btnAdvance)
	this.containerAuto.appendChild(containerDefender)
	this.containerAuto.appendChild(btnSwitchToManual)
	
	this.dom.appendChild(this.containerManual)
	this.dom.appendChild(this.containerAuto)
	
  }

  switchToManual() {
	this.containerAuto.style.display = 'none'
	this.containerManual.style.display = 'flex'
  }

  switchToAuto() {
	this.containerAuto.style.display = 'flex'
	this.containerManual.style.display = 'none'
  }

  makeButton(label, event, onclick = ()=>{}) {
	const btn = document.createElement('div')
	btn.style.border = '1px solid black'
	btn.style.textAlign = 'center'
	btn.style.display = 'flex'
	btn.style.flexDirection = 'column'
	btn.style.justifyContent = 'center'
	btn.style.flex = '1'
	btn.style.cursor = 'pointer'
	btn.onclick = (evt) => {
	  this.dispatchEvent(new CustomEvent(event, {
		bubbles: true,
		cancelable: false,
		composed: true,
	  }))
	  onclick(evt, btn)
	}

	const span = document.createElement('span')
	span.innerHTML = label
	btn.appendChild(span)
	
	return btn
	
  }

  attributeChangedCallback(name, oldValue, newValue) {
	switch (name) {
	case "reset":
	  if (newValue == 'true' || newValue == true) {
		buttonOff(this.btnDefenderHero)
		buttonOff(this.btnDefenderCompanion)
		this.setAttribute('reset', false)
	  }
	}
  }

}

function buttonIsOn(btn) {
  return btn.style.backgroundColor == "gold"
}

function buttonOn(btn) {
  btn.style.backgroundColor = "gold"
}

function buttonOff(btn) {
  btn.style.backgroundColor = ""
}

function buttonToggle(btn) {
  if (buttonIsOn(btn)) {
	buttonOff(btn)
  } else {
	buttonOn(btn)
  }
}



window.customElements.define('game-control', Control)
