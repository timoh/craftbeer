import React from 'react';
import { findDOMNode } from 'react-dom';

function maxmin(pos, min, max) {
	if (pos < min) { return min; }
	if (pos > max) { return max; }
	return pos;
}

export default class Slider extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      limit: null,
      grab: null,
			value: props.initialMaxDistance
    };
  }

  componentDidMount() {
    const sliderPos = findDOMNode(this.refs.slider)['offsetWidth'];
    const handlePos = findDOMNode(this.refs.handle)['offsetWidth'];
    this.setState({
      limit: sliderPos - handlePos,
      grab: handlePos / 2
    });
  }

  handleSliderMouseDown = (e) => {
  	this.onChange(this.position(e),true);
  }

	handleSliderTouchStart = (e) => {
		e.preventDefault();
  	this.onChange(this.position(e),true);
  }

  handleDrag = (e) => {
		e.preventDefault();
  	this.onChange(this.position(e),false);
  }

  handleDragEnd = (e) => {
		e.preventDefault();
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragEnd);
		document.removeEventListener('touchmove', this.handleDrag);
    document.removeEventListener('touchend', this.handleDragEnd);
		this.props.onChange(this.state.value);
  };

  handleKnobMouseDown = () => {
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleDragEnd);
  };

	handleKnobTouchStart = () => {
		document.addEventListener('touchmove', this.handleDrag);
    document.addEventListener('touchend', this.handleDragEnd);
	};

  handleNoop = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  onChange(changedValue,updateTable) {
		this.setState({
			value: changedValue
		});
		if(updateTable) {
			this.props.onChange(changedValue);
		}
  }

  getPositionFromValue = (value) => {
    const { limit } = this.state;
    const { min, max } = this.props;
    const percentage = (value - min) / (max - min);
    const pos = Math.round(percentage * limit);
    return pos;
  };

  getValueFromPosition = (pos) => {
  	const { limit } = this.state;
	  const { min, max, step } = this.props;
  	const percentage = (maxmin(pos, 0, limit) / (limit || 1));
    const valToMultiply = Math.round(percentage * (max - min) / step);
    const value = step * valToMultiply + min*1;
  	return value;
  };

  position = (e) => {
  	const { grab } = this.state;
  	const node = findDOMNode(this.refs.slider);
  	const coordinate = !e.touches
			? e['clientX']
			: e.touches[0]['clientX'];
  	const direction = node.getBoundingClientRect()['left'];
  	const pos = coordinate - direction - grab;
  	const value = this.getValueFromPosition(pos);
  	return value;
  }

  coordinates = (pos) => {
  	const { grab } = this.state;
  	const value = this.getValueFromPosition(pos);
  	const handlePos = this.getPositionFromValue(value);
  	const fillPos = handlePos + grab;
  	return {
  		fill: fillPos,
  		handle: handlePos,
  	};
  }

	valueToKilometers(value) {
		return value / 1000 + " km"
	}

  render() {
    const value = this.state.value;
    const position = this.getPositionFromValue(value);
    const coords = this.coordinates(position);
    const fillStyle = {'width': `${coords.fill}px`};
    const handleStyle = {'left': `${coords.handle}px`};
    return(
      <div>
				<div className="h4 text-center unselectable">Maximum distance to Alko store</div>
        <div ref="slider" className="rangeslider rangeslider-horizontal" onMouseDown={this.handleSliderMouseDown} onTouchStart={this.handleSliderTouchStart}
  		onClick={this.handleNoop}>
          <div ref="fill" className="rangeslider__fill" style={fillStyle}/>
          <div ref="handle" className="rangeslider__handle" onMouseDown={this.handleKnobMouseDown} onTouchStart={this.handleKnobTouchStart}	onClick={this.handleNoop} style={handleStyle} />
        </div>
				<div className="row unselectable">
					<div className="col-md-5 col-xs-5 min">
						{this.valueToKilometers(this.props.min)}
					</div>
					<div className="col-md-2 col-xs-2 value">
            {this.valueToKilometers(this.state.value)}
          </div>
					<div className="col-md-5 col-xs-5 max">
						{this.valueToKilometers(this.props.max)}
					</div>
				</div>
      </div>
    )
  }
}
