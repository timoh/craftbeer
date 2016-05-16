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
              <Link to={`/alco_drinks/${this.props.drink._id.$oid}`}>{this.props.drink.title}</Link>
            </td>
            <td>
              {this.props.drink.title}
            </td>
            <td>
              {this.props.drink.best_rev_candidate_score.toFixed(2)}
            </td>
            <td>
              {this.props.drink.score}
            </td>
            <td>
              {this.props.drink.size.toFixed(2)}
            </td>
            <td>
              {this.props.drink.price.toFixed(2)}
            </td>
            <td>
              {this.props.drink.maxAvailability}
            </td>
        </tr>
    )
  }
}
