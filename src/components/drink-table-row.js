import React from 'react';
import {Link} from 'react-router';

export default class DrinkTableRow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
        <tr>
            <td>
              <Link to={`/alco_drinks/${this.props.drinkData.drink._id.$oid}`}>{this.props.drinkData.drink.title}</Link>
            </td>
            <td>
              {this.props.drinkData.drink.title}
            </td>
            <td>
              {this.props.drinkData.drink.best_rev_candidate_score.toFixed(2)}
            </td>
            <td>
              {this.props.drinkData.score}
            </td>
            <td>
              {this.props.drinkData.drink.size.toFixed(2)}
            </td>
            <td>
              {this.props.drinkData.drink.price.toFixed(2)}
            </td>
            <td>
              {this.props.drinkData.maxAvailability}
            </td>
        </tr>
    )
  }
}
