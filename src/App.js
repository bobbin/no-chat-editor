import React, { Component } from "react";
import { GiftedChat, View, Send, Image } from "react-web-gifted-chat";
import conversation from "./conversation.json";
import PropTypes from "prop-types";
import emojiUtils from "emoji-utils";
import SlackMessage from "./SlackMessage";

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum";
const rt_messages = [];

let msg_counter = 0;
rt_messages.push(
  generateMessage(`Idylla 2`, 3, {
    image:
      "https://www.wykop.pl/cdn/c3201142/comment_Sc8p2KAVLx3EyNIpXuOXngk3ZYJ0g8eq.jpg"
  })
);
rt_messages.push(
  generateMessage(`Goood 1`, 2, {
    image: "http://img2.dmty.pl//uploads/201010/1286036107_by_julia2332_600.jpg"
  })
);
rt_messages.push(
  generateMessage(`This is a great example of system message`, 2, {
    system: true
  })
);
rt_messages.push({
  id: Math.round(Math.random() * 1000000),
  text: "Hello developer",
  createdAt: new Date(),
  user: {
    id: 2,
    name: "React",
    avatar: "https://facebook.github.io/react/img/logo_og.png"
  }
});

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
    this.onSend = this.onSend.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  renderLoading() {
    return <div>Loading...</div>;
  }
  renderComposer(props) {
    return <span />;
  }
  renderSend(props) {
    return (
      <Send {...props}>
        <span>Tap to continue</span>
      </Send>
    );
  }
  uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
  setMessage(message) {
    message.id = this.uuidv4();
    message.createdAt = Date.now();
    if (this.state.activeCharacter.name === "System") {
      message.system = "true";
    } else {
      message.user.id = this.state.activeCharacter.name;
      message.user.name = this.state.activeCharacter.name;
      message.user.avatar = `https://i.pravatar.cc/150?u=${
        this.state.activeCharacter.name
      }`;
    }
    return message;
  }
  onSend(messages = []) {
    let message = this.setMessage(messages[0]);
    messages[0] = message;
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }
  renderMessage(props) {
    const {
      currentMessage: { text: currText }
    } = props;

    let messageTextStyle;

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
      };
    }
    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />;
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
      <div key={this.uuidv4()}>
        <button key={this.uuidv4()} onClick={() => this.handleClick(characterName)}>
          {characterName}{" "}
        </button>
      </div>
    ));

    return (
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
          <GiftedChat
            user={{ id: 1 }}
            showUserAvatar={false}
            renderAvatarOnTop={true}
            showAvatarForEveryMessage={false}
            messages={this.state.messages}
            onSend={this.onSend}
            alwaysShowSend={true}
            renderMessage={this.renderMessage}
          />
        </div>
      </div>
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
