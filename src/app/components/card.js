/*
 
Card

*/

import React from 'react';
import Feature from "./feature";
import Button from "./button";
import classNames from "classnames";

function Card(props) {
  const {state, actions} = props;
  const buttonMessage = !state.endGame ? "Start Game" : "Play Again?";
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
                    <div className="button-container">
                        <Button className="button button--next button--auto" disabled={!state.allCharacters.length} onClick={()=>(actions.startGame())} >{buttonMessage}</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Card;