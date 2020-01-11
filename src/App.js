import React, { Component } from "react";
import { GiftedChat, View, Send, Image } from "react-web-gifted-chat";
import conversation from "./conversation.json";
import PropTypes from "prop-types";
import {uuidv4} from './utils';

import {
  FirebaseAppProvider,
  SuspenseWithPerf
} from 'reactfire';
import 'firebase/performance';
import firebaseConfig from './firebaseConfig';
import Story from './Story';


function generateMessage(text, index, additionalData) {
  return {
    id: Math.round(Math.random() * 1000000),
    text: text,
    createdAt: new Date(),
    user: {
      id: index % 3 === 0 ? 1 : 2,
      name: "Johniak"
    },
    ...additionalData
  };
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      isToggle: {},
      activeCharacter: {},
      characterCollection: []
    };
  }

  handleClick(character) {
    this.setState(state => {
      state.isToggle.hasOwnProperty(character)
        ? (state.isToggle[character] = !state.isToggle[character])
        : (state.isToggle[character] = true);

      return state.isToggle;
    });
    this.setState({
      activeCharacter: { name: character }
    });
  }
  addCharacter() {
    const characterName = prompt('Please enter your name');
    
    this.setState(state => {
      state.characterCollection.push(characterName)
      return state.characterCollection;
    }) 
  }
  render() {
    const characters = this.state.characterCollection.map((characterName) => (
      <div key={uuidv4()}>
        <button key={uuidv4()} onClick={() => this.handleClick(characterName)}>
          {characterName}{" "}
        </button>
      </div>
    ));

    return (
      <FirebaseAppProvider firebaseConfig={firebaseConfig} initPerformance>
      <SuspenseWithPerf
        fallback={'loading story status...'}
        traceId={'load-story-status'}
      >
      <div className="App" style={styles.container}>
        <div style={styles.chat}>
          <div style={styles.botonera}>
            <div>
              <button onClick={() => this.handleClick("System")}>
                System{" "}
              </button>
            </div>
            <div>
              <button onClick={() => this.addCharacter()}>+ </button>
            </div>
            {characters}
            <div>
              <button onClick={() => this.handleClick("Horacio")}>
                Horacio{" "}
              </button>
            </div>
            <div>
              <button onClick={() => this.handleClick("Marcelo")}>
                Marcelo{" "}
              </button>
            </div>
          </div>
          <span>{this.state.activeCharacter.name}</span>
          <Story state={this.state}/>

        </div>
      </div>
      </SuspenseWithPerf>
      </FirebaseAppProvider>
    );
  }
}
const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    height: "100vh"
  },
  botonera: {
    flex: 0.1,
    display: "flex",
    flexDirection: "row",
    height: "100vh"
  },
  conversationList: {
    display: "flex",
    flex: 1
  },
  chat: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    borderWidth: "1px",
    borderColor: "#ccc",
    borderRightStyle: "solid",
    borderLeftStyle: "solid"
  },
  converationDetails: {
    display: "flex",
    flex: 1
  }
};

export default App;
