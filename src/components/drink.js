import React from 'react';

export default class Drink extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drink: []
    };
  }
  componentWillMount() {
    this.loadDrinkFromApi();
  }

  loadDrinkFromApi() {
    var id = this.props.id;
    {
      $.ajax({
        method: 'GET',
            url: '/alco_drinks/' + id,
            dataType: 'json',
            success: function(data) {
              this.setState({drink: data})
            }.bind(this)
        })
    }
  }
  componentDidMount() {
    this.interval = setInterval(() => this.loadDrinkFromApi(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return(
      <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>
            Drink title
          </th>
          <th>
            Price
          </th>
          <th>
            Size
          </th>
          <th>
            Type
          </th>
          <th>
            Url
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {this.state.drink.title}
          </td>
          <td>
            {this.state.drink.price}
          </td>
          <td>
            {this.state.drink.size}
          </td>
          <td>
            {this.state.drink.type}
          </td>
          <td>
            <a href={this.state.drink.url}>
              {this.state.drink.url}</a>
          </td>
        </tr>
      </tbody>
    </table>
    )
  }
}
