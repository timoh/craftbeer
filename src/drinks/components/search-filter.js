import React from 'react';
import {connect} from 'react-redux';
import {filterChange} from '../actions';

class SearchFilter extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const onFilterInput = (event) => {
      this.props.onInput(event.target.value);
    };

    return(
        <div>
          <input type="text" className="form-control input-lg centered" name="filterInput" defaultValue={this.props.filterText} placeholder={"Search for drinks"} onBlur={onFilterInput} />
        </div>
    )
  }
}

const mapStateToSearchFilterProps = state => (
  {
    filterText: state.drinksData.filterText
  }
)

const mapDispatchToSearchFilterProps = (dispatch) => (
  {
    onInput: (filterText) => (
      dispatch(filterChange(filterText))
    )
  }
);

const SearchFilterDisplay = connect(
  mapStateToSearchFilterProps,
  mapDispatchToSearchFilterProps
)(SearchFilter);

export default SearchFilterDisplay;
