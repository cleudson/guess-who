/*
 
Painel

*/

import React from 'react';
import Button from "./button";
import classNames from "classnames";

function Painel(props) {
    const {state, actions} = props;
    const disabled = (state.endGame || !state.startGame);
    return (
      <div className={classNames({
          "panel": true,
          "panel--hidden": disabled
      })}>
        <div className="button-container mb-2">
            {state.options.map((option, key)=>{
                return <Button className={classNames({
                    "button": true,
                    "button--disabled": state.nextStep,
                    "button--right": state.nextStep && (state.currentCharacter.name == option.name),
                    "button--wrong": state.nextStep && state.playerChoice == key && !state.playerIsCorrect
                })}                    
                onClick={(event)=>(actions.getAnswer(event))} key={key} value={option.name} data-number={key} disabled={state.nextStep}>{option.name}</Button>
            })}
        </div>
        {state.remainingCharacters.length > 0 && state.startGame &&
            <div className="button-container">
                <Button disabled={!state.nextStep} className="button button--next button--auto" onClick={()=>(actions.goToNextStep())}>Next Round</Button>
            </div>
        }
        {state.remainingCharacters.length == 0 && state.startGame &&
            <div className="button-container">
                <Button disabled={state.playerChoice == null} className="button button--next button--auto" onClick={()=>(actions.goToScore())}>See your score</Button>   
            </div>
        }
      </div>
    );
  }
  
  export default Painel;