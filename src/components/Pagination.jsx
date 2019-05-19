import React from 'react';
import '../styles/Pagination.css';
import 'nes.css/css/nes.css';

export default class Pagination extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleNextPage = this.handleNextPage.bind(this);
		this.handlePrevPage = this.handlePrevPage.bind(this);
	}

	async handleNextPage() {
		const { onNextPage, hasNextPage } = this.props;
		if (hasNextPage) {
			onNextPage();
		} else {
			console.log("stop clicking");
		}
	}

	async handlePrevPage() {
		const { onPrevPage, pageNum } = this.props;
		if (pageNum !== 1) {
			onPrevPage();
		} else {
			console.log("stop clicking");
		}
	}

	render() {
		const { pageNum } = this.props;
		return (
			<div className="pagination-container">
                <button 
                    type="button" 
                    className={pageNum === 1 ? "nes-btn is-disabled" : "nes-btn is-primary"} 
                    onClick={this.handlePrevPage}
                >&lt;
                </button>
				<h2 className="page-number">{pageNum}</h2>
                <button 
                    type="button" 
                    className={this.props.hasNextPage ? "nes-btn is-primary" : "nes-btn is-disabled"} 
                    onClick={this.handleNextPage}
                >&gt;
                </button>
			</div>
		);
	}

}