import React from 'react';
import { memo, useEffect, useState } from 'react'
import opnbtn from './img/ThreeLines.svg'
import clsbtn from './img/x.svg'; 
import './App.css';
const SideMenu = memo(({status,turn,newgame,topai,botai,doleftovers}:{status:number[],turn:boolean,newgame:()=>void,topai:()=>void,botai:()=>void,doleftovers:()=>void}) => {
  const [depth, setDepth] = useState(31);
  const [isOpen, Open] = useState(true);
  const [evaluation, setEvaluation] = useState('calculating...');
  const [leftovers,setleftovers] = useState(true);
  let evaluate = new Worker(new URL('./eval-worker.ts', import.meta.url), { type: 'module' });
  evaluate.onmessage = (e) => {
    if(e.data > 0){
      setEvaluation(`bottom player wins in ${depth - e.data} moves`);
    } else if(e.data < 0){
      setEvaluation(`top player wins in ${depth + e.data} moves`);
    } else if(e.data == 0){
      setEvaluation('position is even');
    }
  };
  useEffect(()=>{
    evaluate.postMessage([status, turn, depth, (document.getElementById('doleftovers') as HTMLInputElement).checked]);
    setEvaluation('calculating...')
  },[status, turn, depth, leftovers]);
  const closeNav = () => {
      Open(false);
      (document.getElementsByClassName('BottomLeft')[0] as HTMLElement).style.left = '15%';
      (document.getElementsByClassName('TopLeft')[0] as HTMLElement).style.left = '15%';
      (document.getElementsByClassName('BottomRight')[0] as HTMLElement).style.left = '70%';
      (document.getElementsByClassName('TopRight')[0] as HTMLElement).style.left = '70%';
      (document.getElementsByClassName('TurnText')[0] as HTMLElement).style.left = '50%';
      (document.getElementsByClassName('BigText')[0] as HTMLElement).style.left = '50%';
  }
  const openNav = () =>{
    Open(true);
    (document.getElementsByClassName('BottomLeft')[0] as HTMLElement).style.left = '25%';
      (document.getElementsByClassName('TopLeft')[0] as HTMLElement).style.left = '25%';
      (document.getElementsByClassName('BottomRight')[0] as HTMLElement).style.left = '80%';
      (document.getElementsByClassName('TopRight')[0] as HTMLElement).style.left = '80%';
      (document.getElementsByClassName('TurnText')[0] as HTMLElement).style.left = '60%';
      (document.getElementsByClassName('BigText')[0] as HTMLElement).style.left = '60%';
  }
  return(
    <div>
      {!isOpen &&
        <img src = {opnbtn} onClick={()=>{openNav()}} style = {{width:'5%'}}/>
      }
      <div className = 'SideMenu' style = {{width: isOpen ? '20%' : '0%', backgroundColor: isOpen ? '#ddd' : '#fff'}}>
          <nav>
            <>
            <span>
            <h1 style = {{fontSize:'1.7em', display : isOpen ? "" : "none"}}>Chopsticks Solver</h1>
            <img src = {clsbtn} onClick={()=>{closeNav()}} style = {{width:'5%', position: 'absolute', top: '1%', right:'1%' , display : isOpen ? "" : "none"}}/>
            <ul style = {{display : isOpen ? "" : "none"}}>
                  <li>{evaluation}</li>
                  <br/>
                  <li><input type = 'checkbox' id = "topisai" defaultChecked onChange = {topai}/> {' top player is AI'}</li>
                  <br/>
                  <li><input type = 'checkbox' id = "botisai" onChange = {botai}/> {' bottom player is AI'}</li>
                  <br/>
                  <li><input type = 'checkbox' id = "doleftovers" defaultChecked onChange = {()=>{doleftovers();setleftovers(!leftovers)}}/> {'do leftovers'}</li>
                  <br/>
                  <li><input type = 'number' id = "depth" style = {{width:'16%'}} defaultValue = {30} min = '1' max = '50' onChange={(e:React.ChangeEvent<HTMLInputElement>) => {setDepth(parseInt(e.target.value) + 1);}}/> {' engine depth'}</li>
                  <br/>
                  <li><button onClick={newgame}>New Game</button></li>
              </ul>
            </span>
            </>
          </nav>   
      </div>
    </div>
  )
});
const Game = memo(() => {
  const [doleftovers, setDoleftovers] = useState(true);
  const [botisai, setBotisai] = useState(false);
  const [topisai, setTopisai] = useState(true);
  const [depth, setDepth] = useState(20);
  const [mergeoptions, setmergeoptions] = useState([[-1],[-1]]);
  const [turn, setTurn] = useState(true) // true for bottom players turn
  const [selection, editSelection] = useState(-1);
  const [state, editState] = useState([1,1,1,1]); //index 0 is bottom left, 1 is bottom right, 2 is top left, 3 is top right
  let getmove = new Worker(new URL('./play-move-worker.ts', import.meta.url), { type: 'module' });
  getmove.onmessage = (e) => {
    editState(e.data);
    setTurn(!turn);
  }
  useEffect(()=>{
    setDepth(parseInt((document.getElementById('depth') as HTMLInputElement).value))
    if(findWinner() == null){
      if(topisai && !turn){
        getmove.postMessage([state, false, depth, doleftovers]);
      }
      if(botisai && turn){
        getmove.postMessage([state, true, depth, doleftovers]);
      }
    }
  },[state,turn,topisai,botisai])
  const findWinner = () => {
    if(state[0] == 0 && state[1] == 0){
      return "TOP PLAYER WINS!";
    }
    if(state[2] == 0 && state[3] == 0){
      return "BOTTOM PLAYER WINS!";
    }
  };
  const choice = mergeoptions.map((val) =>{
    if(val[0] >= 0 && val[1] >= 0){
      return(
        <>
        <span>
          (
          <img src = {require(`./img/${val[0]}.png`)} width={"5%"} onClick={()=>{
            if(turn){
              state[0] = val[0];
              state[1] = val[1];
              editState(state);
              setmergeoptions([[-1]]);
              setTurn(!turn);
            } else {
              state[2] = val[0];
              state[3] = val[1];
              editState(state);
              setmergeoptions([[-1]]);
              setTurn(!turn);
            }
          }} key = {val[0]}/>
          <img src = {require(`./img/${val[1]}.png`)} width={"5%"} onClick={()=>{
            if(turn){
              state[0] = val[0];
              state[1] = val[1];
              editState(state);
              setmergeoptions([[-1]]);
              setTurn(!turn);
            } else {
              state[2] = val[0];
              state[3] = val[1];
              editState(state);
              setmergeoptions([[-1]]);
              setTurn(!turn);
            }
          }} key = {val[1] + 5}/>
          )
        </span>
        </>
      )
    }
  })
  const closechoice = () =>{
    if(mergeoptions[0][0] >= 0){
      return <img src = {clsbtn} width={"5%"} onClick={()=>{setmergeoptions([[-1]]);}}/>
    }
  }  
    function merge(h1 : number, h2 : number){
      let output = [];
      let total = state[h1] + state[h2];
      for(let i = 0; i <= total - i; i++){
        if(i != Math.min(state[h1], state[h2]) && total - i < 5){
          output.push([total - i, i]);
        }
      }
      if(output.length == 0){
        editSelection(-1);
        return;
      }
      if(output.length == 1){
        state[h1] = output[0][1];
        state[h2] = output[0][0];
        editState(state);
        setTurn(!turn);
      } else {
        setmergeoptions(output)
      }
      editSelection(-1);
    }
  function handleClick(i: number){
    let doleftovers = (document.getElementById("doleftovers") as HTMLInputElement).checked
    if(selection == i){
      editSelection(-1);
      return
    }
    if(turn && i <= 1 && !botisai|| !turn && i >= 2 && !topisai){
      if(selection == -1 && state[i] > 0 && mergeoptions[0][0] < 0){
          editSelection(i);
      } 
    }
    if(selection >= 0) {
      if(selection == 0 || selection == 1){
        if(i == 2 || i == 3){
          if(state[i] != 0){
            state[i] += state[selection];
            if(doleftovers){
              state[i] = state[i] > 4 ? state[i] - 5 : state[i];  
            } else {
              state[i] = state[i] > 4 ? 0 : state[i];  
            } 
            editState(state);
            editSelection(-1);
            setTurn(false);}
        } else {
          if((state[i] != 0 || state[selection] > 1) && (state[i] + state[selection] < 7)){
            merge(selection, i);
          }
        }
      }
      if(selection == 2 || selection == 3){
        if((i == 0 || i == 1) ){
          if(state[i] != 0){
            state[i] += state[selection];
            if(doleftovers){
              state[i] = state[i] > 4 ? state[i] - 5 : state[i];  
            } else {
              state[i] = state[i] > 4 ? 0 : state[i];  
            }
            editState(state);
            editSelection(-1);
            setTurn(true);}
        } else {
          if((state[i] != 0 || state[selection] > 1) && (state[i] + state[selection] < 7)){
            merge(selection, i);
          }
        }
      }
    }
  }
  return (
    <div className = "App">
      <div className = "TurnText">
            {findWinner() == null && (turn ? "Bottom Player's Turn" : "Top player's Turn")}
      </div>
      <div className="BigText" id = "t">
            {findWinner()}
        </div>
        <div className="BigText" id = "t">
            {choice}     {closechoice()}
        </div>
      <>
        <div className="BottomLeft">
          <BottomHand s = "L" f = {state[0]} onClick={()=>handleClick(0)} selected = {selection == 0}/>
        </div>
        <div className="BottomRight">
          <BottomHand s = "R" f = {state[1]} onClick={()=>handleClick(1)} selected = {selection == 1}/>
        </div>
        <div className="TopLeft">
          <TopHand s = "R" f = {state[2]} onClick={()=>handleClick(2)} selected = {selection == 2}/>
        </div>
        <div className="TopRight">
        <TopHand s = "L" f = {state[3]} onClick={()=>handleClick(3)} selected = {selection == 3}/>
        </div>
      </>
      <SideMenu status = {state} turn = {turn} newgame={()=>{editState([1,1,1,1]);setTurn(true);}} botai={()=>{setBotisai(!botisai)}} topai={()=>{setTopisai(!topisai)}} doleftovers={()=>{setDoleftovers(!doleftovers)}}/>
    </div>
  );
});
function BottomHand({s, f, onClick, selected}: {s: string, f: number, onClick: ()=>void, selected: boolean}){
  return (
    <img src = {require(`./img/${f}.png`)} onClick={onClick} style = {{opacity : selected ? 0.5 : 1, transform : s == "R" ? "scaleX(-1)" : "", height: "100%"}}>
    </img>
  )
}
function TopHand({s, f, onClick, selected}: {s: string, f: number, onClick: ()=>void, selected: boolean}){
  return (
    <img src = {require(`./img/T${f}.png`)} onClick={onClick} style = {{opacity : selected ? 0.5 : 1, transform : s == "R" ? "scaleX(-1)" : "", height: "100%"}}>
    </img>
  )
}
export default function App() {
  return (
        <Game/>
  );
}
