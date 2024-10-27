"use strict";
let fs = require('fs');
const { buffer } = require('stream/consumers');
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solver = void 0;
var Solver = /** @class */ (function () {
    function Solver(s, d) {
        var _this = this;
        this.status = [[1, 1], [1, 1]];
        this.doleftovers = true;
        this.getBestMove = function (isMaximizing, depth, alpha, beta) {
            if (isMaximizing) {
                var moves = _this.getMoves(0);
                var bestScore = -Infinity;
                var bestMove = 0;
                for (var i = 0; i < moves.length; i++) {
                    var save = [[_this.status[0][0], _this.status[0][1]], [_this.status[1][0], _this.status[1][1]]];
                    _this.playMove(moves[i]);
                    var score = _this.solveBoard(false, depth - 1, alpha, beta);
                    _this.status = [[save[0][0], save[0][1]], [save[1][0], save[1][1]]];
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = moves[i];
                    }
                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
                return bestMove;
            }
            else {
                var moves = _this.getMoves(1);
                var bestScore = Infinity;
                var bestMove = 0;
                for (var i = 0; i < moves.length; i++) {
                    var save = [[_this.status[0][0], _this.status[0][1]], [_this.status[1][0], _this.status[1][1]]];
                    _this.playMove(moves[i]);
                    var score = _this.solveBoard(true, depth - 1, alpha, beta);
                    _this.status = [[save[0][0], save[0][1]], [save[1][0], save[1][1]]];
                    if (score < bestScore) {
                        bestScore = score;
                        bestMove = moves[i];
                    }
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
                return bestMove;
            }
        };
        this.solveBoard = function (isMaximizing, depth, alpha, beta) {
            if (depth <= 0) {
                return 0;
            }
            if (_this.status[1][0] == 0 && _this.status[1][1] == 0) {
                return depth;
            }
            if (_this.status[0][0] == 0 && _this.status[0][1] == 0) {
                return -depth;
            }
            if (isMaximizing) {
                var moves = _this.getMoves(0);
                var bestScore = -Infinity;
                for (var i = 0; i < moves.length; i++) {
                    var save = [[_this.status[0][0], _this.status[0][1]], [_this.status[1][0], _this.status[1][1]]];
                    try { //just some debugging stuff (leaving this here just in case)
                        _this.playMove(moves[i]);
                    }
                    catch (e) {
                        console.log(_this.status);
                        console.log(moves[i]);
                        console.error(e);
                    }
                    var score = _this.solveBoard(false, depth - 1, alpha, beta);
                    _this.status = [[save[0][0], save[0][1]], [save[1][0], save[1][1]]];
                    if (score > bestScore) {
                        bestScore = score;
                    }
                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
                return bestScore;
            }
            else {
                var moves = _this.getMoves(1);
                var bestScore = Infinity;
                for (var i = 0; i < moves.length; i++) {
                    var save = [[_this.status[0][0], _this.status[0][1]], [_this.status[1][0], _this.status[1][1]]];
                    try { //just some debugging stuff (leacing this here just in case)
                        _this.playMove(moves[i]);
                    }
                    catch (e) {
                        console.log(_this.status);
                        console.log(moves[i]);
                        console.error(e);
                    }
                    var score = _this.solveBoard(true, depth - 1, alpha, beta);
                    _this.status = [[save[0][0], save[0][1]], [save[1][0], save[1][1]]];
                    if (score < bestScore) {
                        bestScore = score;
                    }
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) {
                        break;
                    }
                }
                return bestScore;
            }
        };
        this.playMove = function (b) {
            var h1 = [(b & 16) >> 4, (b & 8) >> 3];
            var h2 = [(b & 4) >> 2, (b & 2) >> 1];
            var choice = b & 1;
            var hand1 = _this.status[h1[0]][h1[1]];
            var hand2 = _this.status[h2[0]][h2[1]];
            if (_this.status[h1[0]] == _this.status[h2[0]]) {
                var output = [];
                var total = hand1 + hand2;
                for (var i = 0; i <= total - i; i++) {
                    if (i != Math.min(hand1, hand2) && total - i < 5) {
                        output.push([total - i, i]);
                    }
                }
                _this.status[h1[0]][h1[1]] = output[choice][1];
                _this.status[h2[0]][h2[1]] = output[choice][0];
            }
            else {
                if (_this.doleftovers) {
                    _this.status[h2[0]][h2[1]] = hand2 + hand1 <= 4 ? hand2 + hand1 : (hand2 + hand1) - 5;
                }
                else {
                    _this.status[h2[0]][h2[1]] = hand2 + hand1 <= 4 ? hand2 + hand1 : 0;
                }
            }
        };
        this.getMoves = function (turn) {
            var output = [];
            for (var i = 0; i < 2; i++) {
                if (_this.status[turn][i] != 0) {
                    for (var j = 0; j < 2; j++) {
                        if (_this.status[turn ^ 1][j] != 0) {
                            output.push(parseInt(("".concat(turn).concat(i).concat(turn ^ 1).concat(j, "0")), 2));
                        }
                    }
                }
            }
            var o = 0;
            var total = _this.status[turn][0] + _this.status[turn][1];
            for (var j = 0; j <= total - j; j++) {
                if (j != Math.min(_this.status[turn][0], _this.status[turn][1]) && total - j < 5) {
                    o++;
                }
            }
            for (var j = 0; j < o; j++) {
                var e = parseInt(("".concat(turn, "0").concat(turn, "1").concat(j)), 2);
                if (!output.includes(e)) {
                    output.push(e);
                }
            }
            return output;
        };
        this.status = [[s[0], s[1]], [s[2], s[3]]];
        this.doleftovers = d;
    }
    return Solver;
}());
let data = fs.readFileSync("./testdata",'utf8');
data = data.split("\n")
for(let i = 0; i < data.length; i++){
    let a = new Solver([parseInt(data[i].charAt(0)),parseInt(data[i].charAt(1)),parseInt(data[i].charAt(2)),parseInt(data[i].charAt(3))],true)
    let b = a.solveBoard(data[i].charAt(4) == 1, data[i].split(" ")[0].split("d")[1],-Infinity,Infinity)
    if(b != parseInt(data[i].split(" ")[1])){
        console.log(data[i] + " failed expected " + b);
   }
}

