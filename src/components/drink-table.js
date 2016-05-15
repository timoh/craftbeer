import React from 'react';
import DrinkTableRow from '../components/drink-table-row';

export default class DrinkTable extends React.Component {

  	constructor() {
  		super();
  		this.state = {
  			drinks: []
  		};
  	}
    componentWillMount() {
  		this.loadDrinksFromApi();
    }

    loadDrinksFromApi() {
      {
        $.ajax({
          method: 'GET',
              url: '/home/index',
              dataType: 'json',
              success: function(data) {
                this.setState({drinks: data})
              }.bind(this)
          })
      }
    }
    componentDidMount() {
      this.interval = setInterval(() => this.loadDrinksFromApi(), 5000);
    }

  	componentWillUnmount() {
  		clearInterval(this.interval);
  	}

  render() {
    return(
        <table className= "table table-striped table-bordered">
          <thead>
            <tr>
              <th>
                Drink title
              </th>
              <th>
                Review title
              </th>
              <th>
                Match score
              </th>
              <th>
                Review score
              </th>
              <th>
                Size
              </th>
              <th>
                Price
              </th>
              <th>
                Max availability in Alko
              </th>
            </tr>
          </thead>
          <tbody>
            { this.state.drinks.map(function(drink){
              return (
                <DrinkTableRow key={ drink._id.$oid }
                drink={ drink }/>
              )
            }, this)}
          </tbody>
        </table>
    )
  }
}
