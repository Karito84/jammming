import React from 'react';
import './SearchBar.css'

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }
    render() {
        return (
        <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
                onChange={this.handleTermChange} />
        <button className="SearchButton">SEARCH</button>
      </div>)
    }

    search() {
      this.props.onSearch(this.state.searchTerm);
    }

    handleTermChange(e) {
      this.setState({searchTerm: e.target.value});
    }
}

export default SearchBar;