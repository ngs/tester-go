/** @babel */
/** @jsx etch.dom */
/* eslint-disable react/no-unknown-property */

import {CompositeDisposable} from 'atom'
import etch from 'etch'
import EtchComponent from '../etch-component'
import Ansi from 'ansi-to-html'

export default class TestPanel extends EtchComponent {
  constructor (props) {
    if (!props) {
      props = {icon: 'check', state: 'unknown', testOutput: 'No test output...'}
    }
    super(props)
    this.subscriptions = new CompositeDisposable()
    this.ansi = new Ansi({newline: true})
    this.subscriptions.add(atom.config.observe('tester-go.maxPanelHeight', (maxPanelHeight) => {
      this.maxPanelHeight = maxPanelHeight
    }))
  }

  render () {
    let output = ''
    if (this.props && this.props.testOutput && this.props.testOutput.length) {
      output = this.ansi.toHtml(this.props.testOutput)
    }
    let panelStyle = 'max-height: ' + this.maxPanelHeight + ';'
    return (
      <atom-panel className='tester-go-panel padded'>
        <div className='inset-panel'>
          <div className='panel-heading'>GO TEST
            <button className='panel-button icon icon-x' onclick={this.handleClick.bind(this)} />
          </div>
          <div ref='content' className='panel-body padded' style={panelStyle} scrollTop={this.scrollHeight} innerHTML={output} />
        </div>
      </atom-panel>
    )
  }

  readAfterUpdate () {
    let content = this.refs.content
    if (!content) {
      return
    }

    let scrollHeight = content.scrollHeight
    if (scrollHeight && this.scrollHeight !== scrollHeight) {
      this.scrollHeight = scrollHeight
      this.update()
    }
  }

  handleClick () {
    if (this.props.toggle) {
      this.props.toggle()
    }
  }

  dispose () {
    this.destroy()
  }

  destroy () {
    super.destroy()
    this.subscriptions.dispose()
    this.ansi = null
  }
}
