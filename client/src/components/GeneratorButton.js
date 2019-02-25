import React from 'react'
import { withRouter, Route } from 'react-router-dom';

var Componente1 = () => (<div>Componente 1</div>)

class GeneratorButton extends React.Component {
  routeChange(){
    console.log("hello");
    this.props.history.push('./Generator');
    return <Route exact path='/Generator' component={Componente1}>GASJDDSF</Route>
  }
  render () {
    return (
       <div>
        <button onClick={this.routeChange.bind(this)}>Redirect</button>
       </div>
    )
  }
}
export default withRouter(GeneratorButton);
/*  renderRedirect = () => {
    if (this.state.redirect) {
      console.log("redirect");
      return <Redirect to='./Generator' />
    }
  }
  */