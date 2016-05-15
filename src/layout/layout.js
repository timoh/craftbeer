import React from 'react';
import Header from '../components/header';
import Menu from '../components/menu';

export default class Layout extends React.Component {

  render() {
    return(
      <div>
        <Menu />
        <Header />
        {this.props.children}
      </div>
    )
  }
}
