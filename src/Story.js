import React, { useEffect, useState } from 'react';
import { useFirebaseApp, useFirestoreCollection, useFirestore } from 'reactfire';
import { GiftedChat, View, Send, Image } from "react-web-gifted-chat";
import emojiUtils from "emoji-utils";
import SlackMessage from "./SlackMessage";
import {uuidv4} from './utils';

import 'firebase/firestore';

export default (props) => {

    const firestore = useFirestore();
    const setMessage = (message) => {
        message.id = uuidv4();
        message.createdAt = Date.now();
        if (props.state.activeCharacter.name === "System") {
        message.system = "true";
        } else {
        message.user.id = props.state.activeCharacter.name;
        message.user.name = props.state.activeCharacter.name;
        message.user.avatar = `https://i.pravatar.cc/150?u=${
            props.state.activeCharacter.name
        }`;
        }
        return message;
    }
    const addMessage = message => {
        console.log(message)
        storyRef.doc(id).update({
          messages: message
        });
    };

    const onSend = (msgs = []) => {
        let message = setMessage(msgs[0]);
        msgs[0] = message;
        setMessages(prevState => GiftedChat.append(prevState, msgs));
        // addMessage(messages);
    }
    useEffect(() => {
        console.log("change")
        storyRef.doc(id).update({
            messages: messages
        });
    });

    const renderMessage = (props) => {
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
        console.log(messages)
        return <SlackMessage {...props} messageTextStyle={messageTextStyle} />;
    }

    const firebaseApp = useFirebaseApp();
    
    const storyRef = firebaseApp
    .firestore()
    .collection('stories');
    
    const stories = useFirestoreCollection(storyRef).docs.map(d => ({id: d.id, ...d.data()}));
    const [messages, setMessages] = useState(stories[0].messages);
    const [title, setTitle] = useState(stories[0].title);
    const [id, setId] = useState(stories[0].id);
    
    return(
        <div>
           {title}

            <GiftedChat
                user={{ id: 1 }}
                showUserAvatar={false}
                renderAvatarOnTop={true}
                showAvatarForEveryMessage={false}
                messages={messages}
                onSend={onSend}
                alwaysShowSend={true}
                renderMessage={renderMessage}
            />
        </div>
    )
}