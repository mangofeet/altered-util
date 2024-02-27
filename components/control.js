'use strict'

class Control extends HTMLElement {

  dom

  constructor() {
	super()

	this.dom = this.attachShadow({mode:"closed"})

	const container = document.createElement('div')
	container.style.display = 'flex'
	container.style.flexDirection = 'column'
	container.style.height = '100%'
	container.style['align-items'] = 'stretch'

	if (this.hasAttribute('flipped')) {
	  container.style.transform = 'rotate(180deg)'
	}

	
	const btnReset = this.makeButton("Reset Counters", "reset")
	container.appendChild(btnReset)
	
	const containerAdvance = document.createElement('div')
	containerAdvance.style.display = 'flex'
	containerAdvance.style.flexDirection = 'row'
	containerAdvance.style.flex = '2'
	containerAdvance.style.height = '100%'
	containerAdvance.style['align-items'] = 'stretch'
	
	const btnAdvanceHero = this.makeButton("Hero+", "advancehero")
	containerAdvance.appendChild(btnAdvanceHero)
	
	const btnAdvanceCompanion = this.makeButton("Companion+", "advancecompanion")
	containerAdvance.appendChild(btnAdvanceCompanion)
	
	const containerBackup = document.createElement('div')
	containerBackup.style.display = 'flex'
	containerBackup.style.flexDirection = 'row'
	containerBackup.style.flex = '2'
	containerBackup.style.height = '100%'
	containerBackup.style['align-items'] = 'stretch'
	
	const btnBackupHero = this.makeButton("Hero-", "backuphero")
	containerBackup.appendChild(btnBackupHero)
	
	const btnBackupCompanion = this.makeButton("Companion-", "backupcompanion")
	containerBackup.appendChild(btnBackupCompanion)
	
	container.appendChild(containerAdvance)
	container.appendChild(containerBackup)
	
	this.dom.appendChild(container)
	
  }

  makeButton(label, event) {
	const btn = document.createElement('div')
	btn.style.border = '1px solid black'
	btn.style.textAlign = 'center'
	btn.style.display = 'flex'
	btn.style.flexDirection = 'column'
	btn.style.justifyContent = 'center'
	btn.style.flex = '1'
	btn.style.cursor = 'pointer'
	btn.onclick = () => {
	  console.log('dispatching', event)
	  this.dispatchEvent(new CustomEvent(event, {
		bubbles: true,
		cancelable: false,
		composed: true,
	  }))
	}

	const span = document.createElement('span')
	span.innerHTML = label
	btn.appendChild(span)
	
	return btn
	
  }  
}




window.customElements.define('game-control', Control)
