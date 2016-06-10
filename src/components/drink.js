import React from 'react';

export default class Drink extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drink: {}
    };
  }
  componentWillMount() {
    this.loadDrinkFromApi();
  }

  loadDrinkFromApi() {
    const id = this.props.id;
    {
      $.ajax({
        method: 'GET',
            url: '/alco_drinks/' + id,
            dataType: 'json',
            success: (data) => {
              this.setState({drink: data});
            }
        });
    }
  }



  render() {
    let img;
    if (this.state.drink.alko_id !== undefined) {
      img = (
          <img src={`/pics/productpic_${this.state.drink.alko_id}.png`} className="img-responsive img-small"/>
      )
    };

    return(
      <div>
            <div className="row">
                <div className="col-md-9">
                    <div className="thumbnail">
                      {img}
                       <div className="caption-full">
                           <h4 className="pull-right">{this.state.drink.price} {String.fromCharCode(8364)}</h4>
                           <h4>{this.state.drink.title}</h4>
                       </div>
                    </div>
                  </div>
           </div>
           <div className="row">
            <div className="col-md-6">
                    <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Size
                        </th>
                        <th>Type
                        </th>
                        <th>URL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {this.state.drink.size} l
                        </td>
                        <td>
                          {this.state.drink.type}
                        </td>
                        <td>
                          <a href={this.state.drink.url}>
                            Show product on Alko website</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
            </div>
           </div>
      </div>
    )
  }
}
