'use babel'

import {CompositeDisposable} from 'atom'
import TestPanel from './components/test-panel'
import TestStatusBar from './components/test-status-bar'

class TestPanelManager {
  constructor (statusBarFunc) {
    this.statusBar = statusBarFunc
    this.subscriptions = new CompositeDisposable()
    this.testPanel = new TestPanel()
    this.subscriptions.add(this.testPanel)
    this.panelVisible = false
    this.panel = atom.workspace.addBottomPanel({item: this.testPanel, visible: this.panelVisible, priority: 10})
    this.subscriptions.add(atom.config.observe('tester-go.displayTestOutputPanel', (displayTestOutputPanel) => {
      this.displayTestOutputPanel = displayTestOutputPanel
    }))
  }

  dispose () {
    if (this.subscriptions) {
      this.subscriptions.dispose()
    }
    this.subscriptions = null
    if (this.panel) {
      this.panel.destroy()
    }
    this.panel = null
    this.testPanel = null
    this.statusBar = null
    this.testStatusBar = null
    if (this.testStatusBarTile) {
      this.testStatusBarTile.destroy()
    }
    this.testStatusBarTile = null
  }

  togglePanel () {
    if (!this.panel) {
      return
    }

    if (this.panelVisible) {
      this.panel.hide()
      this.panelVisible = false
    } else {
      this.panel.show()
      this.panelVisible = true
    }
  }

  update (props) {
    if (!props) {
      return
    }
    let icon = 'light-bulb'
    if (props.exitcode && props.exitcode !== 0) {
      icon = 'remove-close'
    } else if (props.exitcode === 0) {
      icon = 'check'
    }

    if (props.state) {
      this.testStatusBar.update({state: props.state, icon: icon})
    }

    if (props.output && props.output.length > 0) {
      this.testPanel.update({testOutput: props.output})
    }

    if (this.displayTestOutputPanel === 'always') {
      this.panel.show()
      this.panelVisible = true
      return
    }

    if (props.exitcode && props.exitcode !== 0 && this.displayTestOutputPanel === 'failure-only') {
      this.panel.show()
      this.panelVisible = true
      return
    }

    if (props.exitcode === 0 && this.displayTestOutputPanel === 'success-only') {
      this.panel.show()
      this.panelVisible = true
      return
    }
  }

  showStatusBar () {
    if (this.testStatusBar || !this.statusBar()) {
      return
    }

    this.testStatusBar = new TestStatusBar({toggle: () => this.togglePanel()})
    this.subscriptions.add(this.testStatusBar)

    if (this.testStatusBarTile) {
      this.testStatusBarTile.destroy()
    }

    this.testStatusBarTile = this.statusBar().addRightTile({
      item: this.testStatusBar,
      priority: 1000
    })
  }
}
export {TestPanelManager}
