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

	const isFlipped = this.hasAttribute('flipped')
	if (isFlipped) {
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
