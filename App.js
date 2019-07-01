/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import Dialogflow from "react-native-dialogflow";
import { GiftedChat } from 'react-native-gifted-chat';
import dismissKeyboard from 'dismissKeyboard';
import Tts from 'react-native-tts';


type Props = {};
export default class App extends Component<Props> {

  state = {
    messages: [],
  }

  constructor(props) {
    super(props);


    Dialogflow.setConfiguration(
      "1e0088a9ab7f4958aa04ab2ff8925070", Dialogflow.LANG_PORTUGUESE_BRAZIL
    );
  }

  componentWillMount() {
    Dialogflow.requestQuery(
      'ola',
      result => {
        Tts.speak(result.result.fulfillment.messages[0].speech);
        this.setState({
          messages: [
            {
              _id: 1,
              text: result.result.fulfillment.messages[0].speech,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'Chatbot Saraiva',
                avatar: 'http://is5.mzstatic.com/image/thumb/Purple122/v4/b0/62/5e/b0625e9f-793c-0fc0-82e5-f36ab463aa1c/source/512x512bb.png',
              },
            },
          ],
        })
      },
      error => console.log(error)
    );


  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => {
            dismissKeyboard();
            this.onSend(messages);
            Dialogflow.requestQuery(
              messages[0].text,
              result => {
                Tts.stop();
                Tts.speak(result.result.fulfillment.messages[0].speech);
                this.onSend({
                  _id: Math.round(Math.random() * 1000000),
                  text: result.result.fulfillment.messages[0].speech,
                  createdAt: new Date(),
                  user: {
                    _id: 3,
                    name: 'Chatbot Saraiva',
                    avatar: 'http://is5.mzstatic.com/image/thumb/Purple122/v4/b0/62/5e/b0625e9f-793c-0fc0-82e5-f36ab463aa1c/source/512x512bb.png',
                  }
                });


              },
              error => console.log(error)
            );
          }}
        />
        <Button title="MIC"
          
          onPress={() => {
            Dialogflow.startListening(result => {

              this.onSend({
                _id: Math.round(Math.random() * 1000000),
                text: result.result.resolvedQuery,
                createdAt: new Date(),
                user: {
                }
              });

              this.onSend({
                _id: Math.round(Math.random() * 1000000),
                text: result.result.fulfillment.messages[0].speech,
                createdAt: new Date(),
                user: {
                  _id: 3,
                  name: 'Chatbot Saraiva',
                  avatar: 'http://is5.mzstatic.com/image/thumb/Purple122/v4/b0/62/5e/b0625e9f-793c-0fc0-82e5-f36ab463aa1c/source/512x512bb.png',
                }
              });
            }, error => {
              console.log(error);
            });
          }}
        />
      </View>
    )
  }


}

