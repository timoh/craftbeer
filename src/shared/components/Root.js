import React from 'react';
import Header from './header';
import Menu from './menu';

export class Root extends React.Component {


  render() {
    return(
      <div>
        <Menu currentRoute={this.props.location.pathname} />
        <Header />
        {this.props.children}
      </div>
    )
  }
}
