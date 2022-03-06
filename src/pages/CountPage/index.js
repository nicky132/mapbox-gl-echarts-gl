import React from 'react'
import jsxToString from 'jsx-to-string'
import ReactCountTo from './lib'
import './index.scss'

export default class Demo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          startVal: 2020,
          endVal: 1990,
          prefix: '¥',
          suffix: 'RMB',
          duration:3000,
        }
    }

    start(counter) {
        this.counter.start()
    }

    pause(counter) {
        this.counter.pause()
    }

    resume(counter) {
        this.counter.resume()
    }

    stop(counter) {
        this.counter.stop()
    }

    render() {
        const { startVal, endVal, prefix, suffix ,duration} = this.state
        return <div className={'countTo'}>
           <div className={'sample'}>
                <ReactCountTo
                  className={'countTo_Num'}
                  ref={(c) => { this.counter = c }}
                  decimals={2}
                  prefix={prefix}
                  suffix={suffix}
                  startVal={startVal}
                  endVal={endVal}
                  prefixStyle={{marginRight: 10}}
                  suffixStyle={{marginLeft: 10}}
                  duration={duration}
                  useEasing={false}
                  separator={','}/>
                <div className={'control'}>
                  <label>startVal: <input value={startVal} onChange={(val) => this.setState({ startVal: +val.currentTarget.value})}/></label>
                  <label>endVal: <input value={endVal} onChange={(val) => this.setState({ endVal: +val.currentTarget.value})}/></label>
                  <label>prefix: <input value={prefix} onChange={(val) => this.setState({ prefix: val.currentTarget.value})}/></label>
                  <label>suffix: <input value={suffix} onChange={(val) => this.setState({ suffix: val.currentTarget.value})}/></label>
                  <label>duration: <input value={duration} onChange={(val) => this.setState({ duration: val.currentTarget.value})}/></label>
                  <div style={{marginTop: 20}}>
                    <button onClick={() => this.start()}>Start</button>
                    <button onClick={() => this.pause()}>Pause</button>
                    <button onClick={() => this.resume()}>Resume</button>
                    <button style={{ width: 100}} onClick={() => this.stop()}>Stop / Reset</button>
                  </div>
                </div>
           </div>
        </div>
    }
}