/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import Dialogflow from "react-native-dialogflow";
import { GiftedChat } from 'react-native-gifted-chat';
import dismissKeyboard from 'dismissKeyboard';
import Tts from 'react-native-tts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons'
import ButtonGroup from 'react-native-button-group';


type Props = {};
export default class App extends Component<Props> {

  state = {
    messages: [],
    ligarSom: true,
    dataUltimaConsulta: null
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
        if (this.state.ligarSom)
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
                avatar: 'http://www.freelogovectors.net/photo6/Saraiva-logo.jpg',
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

  componentHideAndShow = () => {
    Tts.stop();
    this.setState(previousState => ({ ligarSom: !previousState.ligarSom }))
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <GiftedChat placeholder="Digite ou pergunte pelo micronone"
          messages={this.state.messages}
          onSend={messages => {
            dismissKeyboard();
            this.onSend(messages);
            Dialogflow.requestQuery(
              messages[0].text,
              result => {
                Tts.stop();
                if (this.state.ligarSom)
                  Tts.speak(result.result.fulfillment.messages[0].speech);
                this.onSend({
                  _id: Math.round(Math.random() * 1000000),
                  text: result.result.fulfillment.messages[0].speech,
                  createdAt: new Date(),
                  user: {
                    _id: 3,
                    name: 'Chatbot Saraiva',
                    avatar: 'http://www.freelogovectors.net/photo6/Saraiva-logo.jpg',
                  }
                });


              },
              error => console.log(error)
            );
          }}
        />


        <ButtonGroup style={{ textAlignVertical: "center", textAlign: "center", }}>

          <View style={{ flex: 1, paddingLeft: 80 }}>
            {!this.state.ligarSom ?
              <FontAwesomeIcon style={{ textAlignVertical: "center", textAlign: "center", }} icon={faVolumeUp} size={32} title={'center'}
                onPress={this.componentHideAndShow}
              />
              :
              <FontAwesomeIcon style={{ textAlignVertical: "center", textAlign: "center", }} icon={faVolumeMute} size={32} title={'center'}

                onPress={this.componentHideAndShow}
              />
            }
          </View>
          <View style={{ flex: 1, paddingLeft: 30 }}>
            <FontAwesomeIcon icon={faMicrophone} size={32}

              onPress={() => {

                Dialogflow.startListening(result => {

                  var msDiff = 10000;

                  if(this.state.dataUltimaConsulta != null) {
                    var d1 = new Date(result.timestamp);
                    var d2 = new Date(this.state.dataUltimaConsulta);

                    msDiff = d1.getTime() - d2.getTime();    
                    console.log(msDiff);

                  }

                  if(msDiff > 2000) {
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
                        avatar: 'http://www.freelogovectors.net/photo6/Saraiva-logo.jpg',
                      }
                    });
  
                    this.state.dataUltimaConsulta = result.timestamp;
                  }

                }, error => {
                  console.log(error);
                });
              }}
            />
          </View>

        </ButtonGroup>
      </View>
    )
  }
}
