import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum';
// import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const SIDE = {
  BIDEN: 0,
  TRUMP: 1
};

function App() {
  const [predictionMarket, setPredictionMarket] = useState(undefined);
  const [myBets, setMyBets] = useState(undefined);
  const [betPrediction, setBetPrediction] = useState(undefined);
  useEffect(() =>{
    const init = async () =>{
      const { signerAddress, predictionMarket } = await getBlockchain();
      const myBets = await Promise.all([
        predictionMarket.betsPerGambler(signerAddress, SIDE.BIDEN),
        predictionMarket.betsPerGambler(signerAddress, SIDE.TRUMP),
      ]);
      const bets = await Promise.all([
        predictionMarket.bets(SIDE.BIDEN), 
        predictionMarket.bets(SIDE.TRUMP), 
      ]);
      const betPredictions = {
      	labels: [
      		'Trump',
      		'Biden',
      	],
      	datasets: [{
      		data: [bets[1].toString(), bets[0].toString()],
      		backgroundColor: [
            '#FF6384',
            '#36A2EB',
      		],
      		hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
      		]
      	}]
      };
      setPredictionMarket(predictionMarket);
      setMyBets(myBets);
      setBetPrediction(betPredictions);
    };
    init();
  }, []);
  if(typeof predictionMarket === 'undefined' || typeof myBets === 'undefined' || typeof betPrediction === 'undefined'){
    return 'LOading .....';
  }
  const placeBet = async(side, e) =>{
    e.preventDefault();
    await predictionMarket.placeBet(
      side,
      {value: e.target.elements[0].value}
    );
  };
  const withdrawGain = async () =>{
     await predictionMarket.withdrawGain();
  };
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-sm-12'>
          <h1 className='text-center'>Prediction Market</h1>
          <div className='jumbotron'>
            <h1 className='display-4 text-center'>Who will win US election</h1>
            <p className='lead text-center'>Current Odds</p>
            <div>
              <Pie data={betPrediction}/>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-6'>
          <div className="card">
            <img src='./img/trump.png' />
            <div className="card-body">
              <h5 className="card-title">Trump</h5>
              <form className="form-inline" onSubmit={e => placeBet(SIDE.TRUMP, e)}>
                <input 
                  type="text" 
                  className="form-control mb-2 mr-sm-2" 
                  placeholder="Bet amount (ether)"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary mb-2"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className='col-sm-6'>
          <div className="card">
            <img src='./img/biden.png' />
            <div className="card-body">
              <h5 className="card-title">Biden</h5>
              <form className="form-inline" onSubmit={e => placeBet(SIDE.BIDEN, e)}>
                <input 
                  type="text" 
                  className="form-control mb-2 mr-sm-2" 
                  placeholder="Bet amount (ether)"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary mb-2"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <h2>Your Bets</h2>
        <ul>
          <li>Biden: {myBets[0].toString()} ETH (wei)</li>
          <li>Trump: {myBets[1].toString()} ETH (wei)</li>
        </ul>
      </div>
      <div className='row'>
        <h2>Clain your gains, if any</h2>
        <button type='submit' className='btn btn-primary mb-2' onClick={e => withdrawGain()}>Submit</button>
      </div>

    </div>
    
  );
}

export default App;
