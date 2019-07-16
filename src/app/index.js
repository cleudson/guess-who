import React, { Component } from "react";
import "../scss/main.scss";
import classNames from "classnames";
import { shuffleArray } from "./utils"
import { apiUrl, optionsToShow, featuresToShow } from "./constants";
import Button from "./components/button";
import Card from "./components/card"
 


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // grupo de personagens
            allCharacters: [],
            //personagem atual
            currentCharacter: {},
            //personagens que restam a serem advinhados
            remainingCharacters: [],
            //opções de personagens que serão mostradas na tela
            options: [],
            //quants opções se deve mostrar
            optionsToShow,
            //caracteristicas que serão apresentadas
            currentFeatures: [],
            //define quantas características devem aparecer
            featuresToShow,
            //pontuação
            points: 0,
            //a escolha do jogador
            playerChoice: null,
            //se o jogador acertou a resposta
            playerIsCorrect: false,
            //verifica se o usuário acertou a resposta
            nextStep: false,
            //libera fim do jogo
            endGame: false,
            //libera o início do jogo
            startGame: false
        }
        this.setCharacter = this.setCharacter.bind(this);
        this.setOptions = this.setOptions.bind(this);
        this.getAnswer = this.getAnswer.bind(this);
        this.goToNextStep = this.goToNextStep.bind(this);
        this.goToScore = this.goToScore.bind(this);
    }

    //Escolhe um personagem para ser advinhado
   setCharacter(){
       // captura os personagens restantes
        const {remainingCharacters, featuresToShow} = this.state;
        // Escolhe o novo personagem
        const currentCharacter = shuffleArray(remainingCharacters)[0];
        // Gera as características que podem aparecer para o jogador
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
        // filtra as características
        const filteredFeatures = features.filter((feature) => {
            return feature.value !== "none" && feature.value !== "n/a";
        });
        //muda a ordem das caracteristicas filtradas e retorna o número necessário
        const currentFeatures = shuffleArray(filteredFeatures).slice(0, featuresToShow);
        
        //retira o personagem selecionado dos personagens restantes
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
   // Escolhe outros personagens para entrar na pergunta
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
   // Respondendo a pergunta
   getAnswer(event){
        const {value} = event.target;
        const optionNumber = event.target.dataset.number;
        
        this.setState({
            playerChoice: optionNumber
        })
        if(value === this.state.currentCharacter.name){
            this.setState({
                points: this.state.points + 1,
                playerIsCorrect: true
            })
        }
        this.setState({
            nextStep: true
        })
   }
   //Inicializando  o jogo
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

   //Ir para o próximo round
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
   // Finaliza o jogo
   goToScore(){
    this.setState({
        endGame: true
    })
   }
    componentDidMount() {
        // obtenção de dadosatravés da api
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
        let scoreButton;
        const {remainingCharacters, playerChoice, endGame} = this.state;
        if(remainingCharacters.length == 0 && playerChoice !== null){
            if(!endGame){
                scoreButton = 
                <div className="button-container">
                    <Button className="button button--next button--auto" onClick={()=>(this.goToScore())}>See your score</Button>   
                </div>
            }
        }
        return (
           <div className="game-container">
               <h1 className="game-title text-center">Gues<span className="game-title__sw">s</span> <span className="game-title__sw">W</span>ho?</h1>
                
                {!this.state.allCharacters.length ?
                    <h2 className="text-center">Loading characters...</h2> : 
                    <h2 className="text-center">Round: {this.state.allCharacters.length - this.state.remainingCharacters.length}/{this.state.allCharacters.length}</h2>
                }
                <Card state={this.state} actions={{startGame: this.startGame.bind(this)}}/>
                    
                
                <div className="button-container mb-2">
                {this.state.options.map((option, key)=>{
                    return <Button className={classNames({
                        "button": true,
                        "button--disabled": this.state.nextStep,
                        "button--right": this.state.nextStep && (this.state.currentCharacter.name == option.name),
                        "button--wrong": this.state.nextStep && this.state.playerChoice == key && !this.state.playerIsCorrect
                    })}                    
                    onClick={(event)=>(this.getAnswer(event))} key={key} value={option.name} data-number={key} disabled={this.state.nextStep}>{option.name}</Button>
                })}
                </div>
                {this.state.remainingCharacters.length !=0 && this.state.startGame &&
                    <div className="button-container">
                        <Button disabled={!this.state.nextStep} className="button button--next button--auto" onClick={()=>(this.goToNextStep())}>Next Round</Button>
                    </div>
                }    
                {scoreButton}
            </div>
           
        );
    }
}
   
  


export default App;