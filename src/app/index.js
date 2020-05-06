import React, { Component } from "react";
import "../scss/main.scss";
import { shuffleArray } from "./utils"
import { apiUrl, optionsToShow, featuresToShow } from "./constants";
import Card from "./components/card"
import Painel from "./components/painel";
 


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
          allCharacters: [],
          currentCharacter: {},
          remainingCharacters: [],
          options: [],
          optionsToShow,
          currentFeatures: [],
          featuresToShow,
          points: 0,
          playerChoice: null,
          playerIsCorrect: false,
          nextStep: false,
          endGame: false,
          startGame: false
        }
    }
   setCharacter(){
        const { remainingCharacters, featuresToShow } = this.state;
        const currentCharacter = shuffleArray(remainingCharacters)[0];
        const features = [
            {
                name:"Birth Year",
                value: currentCharacter.birth_year
            },
            {
                name:"Eye Color",
                value: currentCharacter.eye_color
            },
            {
                name: "Gender",
                value: currentCharacter.gender
            },
            {
                name: "Hair Color",
                value: currentCharacter.hair_color
            },
            {
                name: "Height",
                value: currentCharacter.height
            },
            {
                name: "Mass",
                value: currentCharacter.mass
            }
            
        ];
        const filteredFeatures = features.filter((feature) => {
            return feature.value !== "none" && feature.value !== "n/a";
        });
        const currentFeatures = shuffleArray(filteredFeatures).slice(0, featuresToShow);
        const newRemainingCharacters = this.state.remainingCharacters.filter((value) => value != currentCharacter);
        this.setState({
            currentCharacter,
            currentFeatures
        },() => {
            this.setOptions();
            this.setState({
                remainingCharacters: newRemainingCharacters
            })
        })
   }
   setOptions(){
        const options = [];
        const {allCharacters, currentCharacter, optionsToShow} = this.state;
        const randomUniverse = shuffleArray(allCharacters);
        options.push(currentCharacter);
        randomUniverse.forEach((randomCharacter) => {
                if(randomCharacter !== currentCharacter && options.length < optionsToShow){
                    options.push(randomCharacter);
                }
            });
        const randomOptions = shuffleArray(options);
            this.setState({
                options: randomOptions
        })
    }
   
   getAnswer(event){
        const {value} = event.target;
        const optionNumber = event.target.dataset.number;
        if(value === this.state.currentCharacter.name){
            this.setState({
                points: this.state.points + 1,
                playerIsCorrect: true
            })
        }
        this.setState({
            playerChoice: optionNumber,
            nextStep: true
        })
   }
   
   startGame(){
       this.setState({
            startGame: true,
            remainingCharacters: this.state.allCharacters,
            currentFeatures: [],
            points: 0,
            playerChoice: null,
            playerIsCorrect: false,
            nextStep: false,
            endGame: false,
       }, () => {
          this.setCharacter();
       })
   }

   
   goToNextStep(){
       if(this.state.remainingCharacters.length != 0){
        this.setCharacter();
       }
       this.setState({
        nextStep: false,
        playerChoice: null,
        playerIsCorrect: false
        })
   }
   
   goToScore(){
    this.setState({
        endGame: true
    })
   }
    componentDidMount() {
  fetch(apiUrl, {
            headers: {
                Accept: "application/json"
            }
            }).then(response => response.json())
            .then(data => {
            this.setState({
                allCharacters: data.results,
                remainingCharacters: data.results
            })
        });
       
    }
    render() {
        const {state} = this;
        const actions = {
            startGame: this.startGame.bind(this),
            goToScore: this.goToScore.bind(this),
            goToNextStep: this.goToNextStep.bind(this),
            getAnswer: this.getAnswer.bind(this)
        };
        const gameProps = {state, actions};
        const gameStatus = () => {
            if(state.allCharacters.length){
                if(state.startGame){
                    if(state.endGame){
                        return `Your score: ${state.points}/${state.allCharacters.length}`;
                    }
                    return `Round: ${state.allCharacters.length - state.remainingCharacters.length}/${state.allCharacters.length}`;
                }
                else{
                    return "May the score be with you!"
                }
            }
            else{
                return "Loading characters..."
            }
        }
 
        return (
           <div className="game-container">
               <h1 className="game-title text-center">Gues<span className="game-title__sw">s</span> <span className="game-title__sw">W</span>ho?</h1>
                <h2 className="text-center">{gameStatus()}</h2>
                <Card {...gameProps}/>
                <Painel {...gameProps}/>
            </div>
     );
    }
}
   
  


export default App;