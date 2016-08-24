/** @babel */
/** @jsx etch.dom */
/* eslint-disable react/no-unknown-property */

import {CompositeDisposable} from 'atom'
import etch from 'etch'
import EtchComponent from '../etch-component'

export default class TestPanel extends EtchComponent {
  constructor (props) {
    if (!props) {
      props = {icon: 'check', state: 'unknown', testOutput: 'No test output...'}
    }
    super(props)
    this.subscriptions = new CompositeDisposable()
  }

  render () {
    return (
      <atom-panel className='padded'>
        <div className='inset-panel'>
          <div className='panel-heading'>GO TEST</div>
          <div className='panel-body padded'><span style='white-space: pre-wrap;'>{this.props.testOutput}</span></div>
        </div>
      </atom-panel>
    )
  }

  dispose () {
    this.destroy()
  }

  destroy () {
    super.destroy()
    this.subscriptions.dispose()
  }
}
