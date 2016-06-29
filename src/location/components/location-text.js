import React from 'react';

export default class LocationText extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let locationText;
    if (this.props.requested) {
      if (this.props.loading) {
        locationText = (
          <p className="centered">Loading location...</p>
        )
      } else {

        locationText = (
            <p className="centered"><strong>This is your location:</strong> <br/>
            {this.props.address} {this.props.address ? <br/> : null}
            Latitude {this.props.latitude}, longitude: {this.props.longitude}
            </p>
        )
      }
    }
    return (
      <div>
        {locationText}
      </div>
    )
  }
}
