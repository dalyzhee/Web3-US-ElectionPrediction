// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PredictionMarket{
    enum Side{ Biden, Trump}
    struct Result{
        Side winner;
        Side loser;
    }
    Result public result;
    
    mapping(Side => uint) public bets;
    mapping (address => mapping (Side => uint)) public betsPerGambler;
    address public oracle;
    bool public electionFinished;

    constructor(address _oracle){
        oracle = _oracle;
    }
    function placeBet(Side _side) external payable{
        require(electionFinished == false, 'election is finished');
        bets[_side] += msg.value;
        betsPerGambler[msg.sender][_side] += msg.value;
    }
    function withdrawGain() external{
        uint gamblerBet = betsPerGambler[msg.sender][result.winner];
        require(gamblerBet > 0, 'Ypu do not have any winning bet');
        require(electionFinished == true, 'election not finished');
        uint gain = gamblerBet + bets[result.loser] * gamblerBet/bets[result.winner];
        betsPerGambler[msg.sender][Side.Biden] = 0;
        betsPerGambler[msg.sender][Side.Trump] = 0;
        payable(msg.sender).transfer(gain);

    }
    function reportResult(Side _winner, Side _loser) external{
        require(oracle == msg.sender, 'only oracle');
        require(electionFinished == false, 'election is finished');
        result.winner = _winner;
        result.loser = _loser;
        electionFinished = true;
    }

}