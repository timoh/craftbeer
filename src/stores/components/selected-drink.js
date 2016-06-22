import React from 'react';
import {Link} from 'react-router';

export default class SelectedDrink extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let img;
    if (this.props.drinkData.drink !== undefined) {
      img = (
          <img src={`/pics/productpic_${this.props.drinkData.drink.alko_id}.png`} className="img-responsive img-small"/>
      );
    }
    let content;
    if (this.props.drinkData.drink !== undefined) {
      content = (
        <div>
          <div className="row">
            <div className="col-md-offset-2">
                <div className="thumbnail">
                  {img}
                   <div className="caption-full">
                       <h4 className="pull-right">{this.props.drinkData.drink.price} {String.fromCharCode(8364)}</h4>
                       <h4>{this.props.drinkData.drink.title}</h4>
                   </div>
                </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-offset-2">
              <table className="table table-striped">
              <thead>
                <tr>
                  <th>Size
                  </th>
                  <th>Type
                  </th>
                  <th>Product page on Alko's site
                  </th>
                  <th>Product page
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {this.props.drinkData.drink.size} l
                  </td>
                  <td>
                    {this.props.drinkData.drink.type}
                  </td>
                  <td>
                    <a href={this.props.drinkData.drink.url}>
                      Show product on Alko website</a>
                  </td>
                  <td>
                    <Link to={`/alco_drinks/${this.props.drinkData.drink._id.$oid}`}>{this.props.drinkData.drink.title}</Link>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
         </div>
        </div>
      )
    } else {
      content = (
        <div>
          <span>Select drinks first.</span>
        </div>
      )
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}
