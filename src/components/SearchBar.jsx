import React from 'react';
import '../styles/SearchBar.css';
import 'nes.css/css/nes.css';

export default class SearchBar extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        kittyID: '', // initialize to empty string
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(e) {
      const kittyID = e.target.value;
      this.setState({ kittyID });
    }
  
    handleSubmit(e) {
      e.preventDefault();
      const { onSearch } = this.props;
      const { kittyID } = this.state;

      if (kittyID !== '') { // form value is not empty
        onSearch(parseInt(kittyID));
      }
    }
  
    render() {
      const { isHome } = this.props;
      const { kittyID } = this.state;
      return (
        <div className={isHome ? "nes-field search-container" : "nes-field search-container-top"}>
          {isHome ? <label htmlFor="address_field">kitty meow jukebox</label> : null}
          <div className="search-bar">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text" 
                id="kitty-id" 
                className="nes-input search-input" 
                placeholder="your kitty id"
                value={kittyID}
                onChange={this.handleChange} 
              />
              <button type="submit" className="nes-btn is-primary search-button">
                <span>search</span>
              </button>
            </form>
          </div>
        </div>
      );
    }
  };