import React from 'react';
import '../styles/Card.css';
import 'nes.css/css/nes.css';

export default class Card extends React.Component {

	render() {
		const { id, name, imageUrl, backgroundColorCode, permalink, assetContract } = this.props.asset;
		let subtitle = assetContract + " #" + id;
		let backgroundColor = (backgroundColorCode !== null) ? "#" + backgroundColorCode : "#fff";
		return (
			
            <div className="nes-container is-rounded nft-card" onClick={() => this.props.handleClick(id)}>
                <div className="nft-image-container" style={{ backgroundColor: backgroundColor }}>
                    <div className="nft-top-left-corner"></div>
                    <div className="nft-top-right-corner"></div>
                    <figure className="nft-card-image">
                        <img src={imageUrl} alt={subtitle} />
                    </figure>
                </div>
                <div className="nft-text-container">
                    <div className="nft-card-text">
                        <h3 className="nft-card-title">{name}</h3>
                        <p className="nft-card-description">{subtitle}</p>
                    </div>
                </div>
            </div>
		);
	}

}