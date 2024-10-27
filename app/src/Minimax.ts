export class Solver{
    status = [[1,1],[1,1]];
    hashTable = new Map();
    doleftovers = true;
    constructor(s : number[], d : boolean){
        this.status = [[s[0],s[1]],[s[2],s[3]]];
        this.doleftovers = d;
    }
    getBestMove = (isMaximizing:boolean,depth:number) => {
        if(isMaximizing){
            let moves = this.getMoves(0);
            let bestScore = -Infinity;
            let bestMove = 0;
            for(let i = 0; i < moves.length; i++){
                let save = [[this.status[0][0],this.status[0][1]],[this.status[1][0],this.status[1][1]]];
                this.playMove(moves[i]);
                let score = this.solveBoard(false,depth-1);
                this.status = [[save[0][0],save[0][1]],[save[1][0],save[1][1]]];
                if(score > bestScore){
                    bestScore = score; 
                    bestMove = moves[i];
                }
            }
            return bestMove;
        } else {
            let moves = this.getMoves(1);
            let bestScore = Infinity;
            let bestMove = 0;
            for(let i = 0; i < moves.length; i++){
                let save = [[this.status[0][0],this.status[0][1]],[this.status[1][0],this.status[1][1]]];
                this.playMove(moves[i]);
                let score = this.solveBoard(true,depth-1);
                this.status = [[save[0][0],save[0][1]],[save[1][0],save[1][1]]];
                if(score < bestScore){
                    bestScore = score;
                    bestMove = moves[i]; 
                }
            }
            return bestMove;
        }
    }
    solveBoard = (isMaximizing:boolean,depth:number) => {
        if(this.hashTable.has(`${this.status[0][0]}${this.status[0][1]}${this.status[1][0]}${this.status[1][1]}${isMaximizing ? 1 : 0}d${depth}`)){
            return this.hashTable.get(`${this.status[0][0]}${this.status[0][1]}${this.status[1][0]}${this.status[1][1]}${isMaximizing ? 1 : 0}d${depth}`);
        }
        if(depth <= 0){
            return 0;
        }
        if(this.status[0][0] == 0 && this.status[0][1] == 0){
            return -depth;
        }
        if(this.status[1][0] == 0 && this.status[1][1] == 0){
            return depth;
        }
        if(isMaximizing){
            let moves = this.getMoves(0);
            let bestScore = -Infinity;
            for(let i = 0; i < moves.length; i++){
                let save = [[this.status[0][0],this.status[0][1]],[this.status[1][0],this.status[1][1]]];
                this.playMove(moves[i]);
                let score = this.solveBoard(false,depth-1);
                this.status = [[save[0][0],save[0][1]],[save[1][0],save[1][1]]];
                if(score > bestScore){
                    bestScore = score; 
                }
            }
            this.hashTable.set(`${this.status[0][0]}${this.status[0][1]}${this.status[1][0]}${this.status[1][1]}${isMaximizing ? 1 : 0}d${depth}`, bestScore);
            return bestScore;
        } else {
            let moves = this.getMoves(1);
            let bestScore = Infinity;
            for(let i = 0; i < moves.length; i++){
                let save = [[this.status[0][0],this.status[0][1]],[this.status[1][0],this.status[1][1]]];
                this.playMove(moves[i]);
                let score = this.solveBoard(true,depth-1);
                this.status = [[save[0][0],save[0][1]],[save[1][0],save[1][1]]];
                if(score < bestScore){
                    bestScore = score; 
                }
            }
            this.hashTable.set(`${this.status[0][0]}${this.status[0][1]}${this.status[1][0]}${this.status[1][1]}${isMaximizing ? 1 : 0}d${depth}`, bestScore);
            return bestScore;
        }
    }
    playMove = (b:number) => {
        let h1 = [(b & 16) >> 4, (b & 8) >> 3];
        let h2 = [(b & 4) >> 2,(b & 2) >> 1];
        let choice = b & 1; 
        let hand1 = this.status[h1[0]][h1[1]];
        let hand2 = this.status[h2[0]][h2[1]];
        if(this.status[h1[0]] == this.status[h2[0]]){
            let output = [];
            let total = hand1 + hand2;
            for(let i = 0; i <= total - i; i++){
              if(i != Math.min(hand1, hand2) && total - i < 5){
                output.push([total - i, i]);
              }
            }
            this.status[h1[0]][h1[1]] = output[choice][1];
            this.status[h2[0]][h2[1]] = output[choice][0];
        } else {
            if(this.doleftovers){
                this.status[h2[0]][h2[1]] = hand2 + hand1 <= 4 ? hand2 + hand1 : (hand2 + hand1) - 5;
            } else {
                this.status[h2[0]][h2[1]] = hand2 + hand1 <= 4 ? hand2 + hand1 : 0;
            }
        }
    }
    private getMoves = (turn:number) => {
        let output = [];
        for(let i = 0; i < 2; i++){
            if(this.status[turn][i] != 0){
                for(let j = 0; j < 2; j++){
                    if(this.status[turn ^ 1][j] != 0){
                        output.push(parseInt((`${turn}${i}${turn ^ 1}${j}0`),2));
                    }
                }
            }
        }
        let o = 0;
        let total = this.status[turn][0] + this.status[turn][1];
        for(let j = 0; j <= total - j; j++){
            if(j != Math.min(this.status[turn][0], this.status[turn][1]) && total - j < 5){
                o++;
            }
        }
        for(let j = 0; j < o; j++){
            let e = parseInt((`${turn}0${turn}1${j}`),2)
            if(!output.includes(e)){
                output.push(e);
            }
        }
        return output;
    }
}