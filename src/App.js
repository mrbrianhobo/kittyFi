import React, { Component } from 'react';
import Anime from 'react-anime';
import Web3 from 'web3';
import './styles/App.css';
import SearchBar from './components/SearchBar.jsx';
import Card from './components/Card.jsx';
import Pagination from './components/Pagination.jsx';
import Loading from './components/Loading.jsx';
import idToAudio from './utils/soundSynthsizer.js';


// "http://api.etherscan.io/api?module=contract&action=getabi&address=0x06012c8cf97bead5deae237070f9587f8e7a266d&apikey=T36JMNHAMAEKHCQ3IP4UNTPB5ZNENVKA6C"
// "0x06012c8cf97bead5deae237070f9587f8e7a266d"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animeProps: {
        opacity: [0,1],
        translateY: ["1rem", 0],
        delay: (el, i) => i * 100,
        easing: "easeOutQuart",
      },
      audioContext: null,
      web3: null,
      accounts: [],
      contractAddress: "0x06012c8cf97bead5deae237070f9587f8e7a266d", //cryptokitties contract
      contract: null,
    	isHome: true,
      isLoading: false,
      isSignedIn: false,
      page: 0,
      pages: { prev: null, curr: [], next: null },
      geneList: { prev: null, curr: [], next: null },
      kittyID: '',
      kitty: null,
      genes: '',
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
  }

  async componentWillMount() {
    const provider = window.ethereum;
    const web3 = new Web3(provider || new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/98ac5a2313db4e9aae4a0dbd67fab58f"));
    console.log(web3);
    this.setState({ web3: web3 });
    try {
      let response = await fetch("http://api.etherscan.io/api?module=contract&action=getabi&address=0x06012c8cf97bead5deae237070f9587f8e7a266d&apikey=T36JMNHAMAEKHCQ3IP4UNTPB5ZNENVKA6C");
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      let json = await response.json();
      let abi = JSON.parse(json.result);
      console.log(abi);
      let contract = new web3.eth.Contract(abi, this.state.contractAddress);
      console.log(contract);
      this.setState({ contract });
    } catch (error) {
      console.log(error)
    }
  }

  componentWillUnmount() {
    this.setState({ 
      web3: null,
      accounts: [],
      isSignedIn: false,
      kittyID: '',
      kitty: null,
      genes: '',
    });
  }

  parseJsonObject(asset) {
    let nft = {
      id: asset.token_id,
      name: asset.name,
      description: asset.description,
      imageUrl: asset.image_url,
      backgroundColorCode: asset.background_color,
      permalink: asset.permalink,
      assetContract: asset.asset_contract.name
    };
    return nft;
  }

  parseJsonObjects(json) {
    let assetList = json.assets;
    let nfts = [];
    for (let asset of assetList) {
      if (asset.asset_contract.address === "0x06012c8cf97bead5deae237070f9587f8e7a266d") {
        let nft = {
          id: asset.token_id,
          name: asset.name,
          description: asset.description,
          imageUrl: asset.image_url,
          backgroundColorCode: asset.background_color,
          permalink: asset.permalink,
          assetContract: asset.asset_contract.name
        };
        nfts.push(nft);
      }
    }
    return nfts;
  }

  async handlePlay(id) {
    let audio = idToAudio(id);
    audio.play();
    console.log(id);
  }

  async handleLogin() {
    console.log("signed in");
    try {
      const accounts = await window.ethereum.enable();
      this.setState({ isLoading: true });
      console.log(accounts);
      // let address = accounts[0];
      let address = "0xd519169278aa08c5e304062598b824952a32746a";
      let nfts = await this.getAssets(address, 1, 16);
      let geneList = await this.getGenes(nfts);
      let next = null;
      let nextGeneList = null;
      if (nfts.length === 0) {
        nfts = [];
        geneList = [];
      } 
      if (nfts.length <= 8) {
        // do nothing
      }
      if (nfts.length > 8) {
        next = nfts.splice(8);
        nextGeneList = geneList.splice(8);
      }
      this.setState({
        isLoading: false,
        isHome: false,
        isSignedIn: true,
        kitty: null,
        kittyID: null,
        genes: null,
        accounts: accounts,
        page: 1, 
        pages: { prev: null, curr: nfts, next: next },
        geneList: { prev: null, curr: geneList, next: nextGeneList },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async handleSearch(id) {
    const { contract } = this.state;
    this.setState({ isLoading: true });
    let web3Response = await contract.methods.getKitty(id).call();
    console.log(web3Response);
    console.log(web3Response.genes.toString());
    let genes = web3Response.genes.toString();
    let options = {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
        "X-API-KEY": "b033c7a00b9d4a66964de9d699248e09"
      }
    };
    let openSeaResponse = await fetch("https://api.opensea.io/api/v1/asset/0x06012c8cf97bead5deae237070f9587f8e7a266d/" + id, options);
    let json = await openSeaResponse.json()
    console.log(json);
    let kitty = this.parseJsonObject(json);
    this.setState({ 
      isLoading: false,
      isHome: false,
      kittyID: id,
      kitty: kitty,
      genes: genes,
    });
  }

  async handleNext() {
    this.setState({ isLoading: true });
    const { accounts, page } = this.state;
    let address = accounts[0];
    let next = await this.getAssets(address, page + 2, 8);
    let nextGeneList = await this.getGenes(next);
    if (next.length === 0) {
      next = null;
      nextGeneList = null;
    }
    this.setState(prevState => ({
      isLoading: false,
      isHome: false,
      page: prevState.page + 1, 
      pages: {prev: prevState.pages.curr, curr: prevState.pages.next, next: next},
      geneList: { prev: prevState.geneList.curr, curr: prevState.geneList.nextt, next: nextGeneList },
    }));
  }

  async handlePrev() {
    this.setState({ isLoading: true });
    const { accounts, page } = this.state;
    let address = accounts[0];
    let prev = null;
    let prevGeneList = null;
    if (page > 2) {
      prev = await this.getAssets(address, page - 2, 8);
      prevGeneList = await this.getGenes(prev);
    }
    this.setState(prevState => ({
      isLoading: false,
      isHome: false,
      page: prevState.page - 1, 
      pages: {prev: prev, curr: prevState.pages.prev, next: prevState.pages.curr},
      geneList: {prev: prevGeneList, curr: prevState.geneList.prev, next: prevState.geneList.curr},
    }));
  }

  async getAssets(address, page, limit) {
    const { contract, contractAddress } = this.state;
    let offset = (page - 1) * 8;
  	let url = "https://api.opensea.io/api/v1/assets/?owner=" + address + "&limit=" + limit + "&offset=" + offset;
    let options = {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
        "X-API-KEY": "b033c7a00b9d4a66964de9d699248e09"
      }
    };
    try {
      let response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      let json = await response.json();
      let nfts = this.parseJsonObjects(json);
      console.log(json);
      console.log(nfts);
      return nfts;
    } catch (error) {
      console.log(error)
      return [];
    }
  }

  async getGenes(nfts) {
    let geneList = [];
    const { contract } = this.state;
    for (let kitty of nfts) {
      let id = kitty.id;
      let web3Response = await contract.methods.getKitty(id).call();
      let genes = web3Response.genes.toString();
      geneList.push(genes);
    }
    return geneList;
  }

  renderLogin() {
    const { isSignedIn, accounts } = this.state;
    return (
      <div>
        {isSignedIn ? (
          <h4 className="account-address">{accounts[0]}</h4>
        ) : (
          <button className="nes-btn is-primary sign-in" onClick={this.handleLogin}>
            <span>login</span>
          </button>
        )}
      </div>
    );
  }

  renderSearchBar() {
    const { isHome } = this.state;
    return (
      <SearchBar 
        isHome={isHome} 
        onSearch={this.handleSearch}
      />
    );
  }

  renderLoading() {
    const { isLoading } = this.state;
    return (
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          null
        )}
      </div>
    );
  }

  renderCards() {
    const { pages, accounts, page, animeProps } = this.state;
    let address = accounts[0];
    let currPage = pages.curr;
    let id = address + "?page=" + page;
    let assets = currPage.map(asset => <Card key={asset.assetContract + " #" + asset.id} asset={asset} handleClick={this.handlePlay} />);

    return (
      <div className="card-container">
      <Anime {...animeProps} key={id}>
        {assets.map((card, i) => <div key={i}>{card}</div>)}
      </Anime>
      </div>
    );
  }

  renderPagination() {
    const { page, pages, isLoading } = this.state;
    let hasNextPage = pages.next !== null;
    return (
      <div>
        {isLoading ? (
          null
        ) : (
          <Pagination 
            pageNum={page} 
            hasNextPage={hasNextPage} 
            onNextPage={this.handleNext} 
            onPrevPage={this.handlePrev} 
          />
        )}
      </div>
    );
  }
  
  render() {
    const { isHome, isSignedIn, kitty, genes, animeProps } = this.state;
    return (
      <div className="flex-wrapper">
        <div className="container">
          <header>
            <a className="title" href="./"><h1 className="heading">#kittyFi</h1></a>
            {this.renderLogin()}
          </header>
          {this.renderLoading()} 
          {isSignedIn ? (
            <div>
              {this.renderCards()}
              {this.renderPagination()}
            </div>
          ) : (
            <div>
              <SearchBar isHome={isHome} onSearch={this.handleSearch} />
              {isHome ? (
                null
              ) : (
                <div className="card-container">
                  <Anime {...animeProps} key={genes}>
                    <div key={kitty.id}><Card asset={kitty} handleClick={this.handlePlay}/></div>
                  </Anime> 
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  	);
  }
}

export default App;
