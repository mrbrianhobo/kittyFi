import React from 'react';
import '../styles/Loading.css';
import 'nes.css/css/nes.css';
import loading from '../assets/loading.gif';

export default class Loading extends React.Component {
	render() {
		return (
			<div className="nes-container is-rounded loading-card">
				<div className="loading-top-left-corner"></div>
				<div className="loading-top-right-corner"></div>
				<div className="loading-bottom-left-corner"></div>
				<div className="loading-bottom-right-corner"></div>
  				<img src={loading} alt="loading animation" />
			</div>
		);
	}
}