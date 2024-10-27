import {Solver} from './Minimax';
onmessage = (e) =>{
    let solve = new Solver(e.data[0], e.data[3]);
    let response = solve.getBestMove(e.data[1],e.data[2],-Infinity,Infinity);
    solve.playMove(response);
    postMessage([solve.status[0][0],solve.status[0][1],solve.status[1][0],solve.status[1][1]]);
}