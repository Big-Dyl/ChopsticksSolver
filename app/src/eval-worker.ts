import {Solver} from './Minimax';
onmessage = (e) =>{
    let solve = new Solver(e.data[0], e.data[3]);
    let response = solve.solveBoard(e.data[1],e.data[2],-Infinity,Infinity);
    postMessage(response);
}