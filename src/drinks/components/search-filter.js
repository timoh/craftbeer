import React from 'react';
import {connect} from 'react-redux';
import {changeFilter, searchForDrinks, clearFilter } from '../actions';

class SearchFilter extends React.Component {

  constructor(props) {
    super(props);
  }

  onButtonClick() {
      if(this.props.filterText !== "") {
        this.props.doSearch();
      }
  }

  clearText() {
    this.myTextInput.value = "";
    this.props.onClear();
  }

  render() {
    const onFilterInput = (event) => {
      const newValue = event.target.value;
      if(newValue.length>0) {
        this.props.onInput(newValue);
      }
    };

    return(
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div className="input-group">
              <input type="text" ref={(ref) => this.myTextInput = ref} className="form-control input-lg centered margin-on-mobile" name="filterInput" defaultValue={this.props.filterText} placeholder={"Search for drinks"} onBlur={onFilterInput} />
              <div className="input-group-btn">
                <button type="button" className="btn btn-default btn-lg" aria-label="Left Align" onClick={this.onButtonClick.bind(this)}>
                  <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                </button>
                <button type="button" className="btn btn-default btn-lg" aria-label="Left Align" onClick={this.clearText.bind(this)}>
                  Clear
                </button>
              </div>
            </div>
          </div>
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
      dispatch(changeFilter(filterText))
    ),
    doSearch: () => (
      dispatch(searchForDrinks())
    ),
    onClear: () => (
      dispatch(clearFilter())
    )
  }
);

const SearchFilterDisplay = connect(
  mapStateToSearchFilterProps,
  mapDispatchToSearchFilterProps
)(SearchFilter);

export default SearchFilterDisplay;
