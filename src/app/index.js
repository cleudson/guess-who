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
    }

    //Escolhe um personagem para ser advinhado
   setCharacter(){
       // captura os personagens restantes
        const { remainingCharacters, featuresToShow } = this.state;
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
       //randomiza os personagens
       const randomUniverse = shuffleArray(allCharacters);
       // inclui o personagem escolhido
       options.push(currentCharacter);
       // inclui o restante de personagens com base no número de opções
       randomUniverse.forEach((randomCharacter) => {
           if(randomCharacter !== currentCharacter && options.length < optionsToShow){
            options.push(randomCharacter);
           }
       });
       //randomiza as opções
       const randomOptions = shuffleArray(options);
       this.setState({
           options: randomOptions
       })
   }
   // Respondendo a pergunta
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
        // obtenção de dados através da api
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
        const state = this.state;
        const actions = {
            startGame: this.startGame.bind(this),
            goToScore: this.goToScore.bind(this),
            goToNextStep: this.goToNextStep.bind(this),
            getAnswer: this.getAnswer.bind(this)
        }
        return (
           <div className="game-container">
               <h1 className="game-title text-center">Gues<span className="game-title__sw">s</span> <span className="game-title__sw">W</span>ho?</h1>
                {!state.allCharacters.length ?
                    <h2 className="text-center">Loading characters...</h2> : 
                    <h2 className="text-center">Round: {state.allCharacters.length - state.remainingCharacters.length}/{state.allCharacters.length}</h2>
                }
                <Card state={state} actions={actions}/>
                <Painel state={state} actions={actions}/>
            </div>
           
        );
    }
}
   
  


export default App;