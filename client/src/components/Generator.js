import React from 'react'

class Generator extends React.Component {
  hello() {
      console.log("hello");
  }
  render () {
    return (
       <div onLoad={this.hello()}>
        <p>Generator</p>
       </div>
    )
  }
}
export default Generator;