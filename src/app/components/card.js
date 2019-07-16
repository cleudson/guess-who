/*
 
Card

*/

import React from 'react';
import Feature from "./feature";
import Button from "./button";
import classNames from "classnames";

function Card(props) {
  const {state, actions} = props;
  return (
    <div className="card">
        <div className={classNames({
            "card-inner" : true,
            "card-inner--show-back" : !state.startGame || state.endGame
            })}>
            <div className="card-front">
                <div className="card__content">
                    <div className="card__image">
                        <div className={classNames({
                            "card__image-inner" : true,
                            "card__image-inner--show-back" : state.nextStep
                            })}>
                            <div className="card__image-front">
                            </div>
                            <div className={classNames({
                                "card__image-back" : true,
                                "card-ch": true,
                                ["card-ch--" + (state.currentCharacter.name || "").toLowerCase().replace(/\s/g, "-")]: state.nextStep
                            })}>
                            </div>
                        </div>
                    </div>
                    <ul className="card__features-container">
                        {state.currentFeatures.map((feature, key) =>{
                            return <Feature key={key} name={feature.name} value={feature.value}/>
                        })}
                    </ul>
                </div>
            </div>
            <div className="card-back">
                <div className="card__content">
                    {!state.endGame ?
                        <div className="button-container">
                            <Button className="button button--next button--auto" disabled={!state.allCharacters.length} onClick={()=>(actions.startGame())} text="Start Game">Start Game</Button>
                        </div> :
                        <div className="card__features-container text-center">
                            <h3 className="mb-2 color-3">Your points: {state.points}</h3>
                            <div className="button-container">
                                <Button className="button button--next button--auto" disabled={!state.allCharacters.length} onClick={()=>(actions.startGame())}>Play Again?</Button>
                            </div>
                        </div>
                    
                    }
                </div>
            </div>
        </div>
    </div>
  );
}

export default Card;