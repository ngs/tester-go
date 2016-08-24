/** @babel */
/** @jsx etch.dom */
/* eslint-disable react/no-unknown-property */

import {CompositeDisposable} from 'atom'
import etch from 'etch'
import EtchComponent from '../etch-component'

export default class TestStatusBar extends EtchComponent {
  constructor (props) {
    if (!props) {
      props = {icon: 'check', state: 'unknown'}
    }
    super(props)
    this.subscriptions = new CompositeDisposable()

    // this.subscriptions.add(atom.tooltips.add(this.element, {title: 'An update will be installed the next time Atom is relaunched.<br/><br/>Click the squirrel icon for more information.'}))
  }

  handleClick () {
    if (this.props.toggle) {
      this.props.toggle()
    }
  }

  render () {
    if (!this.props.icon) {
      this.props.icon = 'check'
    }

    if (!this.props.state) {
      this.props.state = 'unknown'
    }

    let className = 'tester-go-status-bar test-status-' + this.props.state + ' icon icon-' + this.props.icon + ' inline-block'
    return (
      <span type='button' className={className} onclick={this.handleClick.bind(this)} />
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
