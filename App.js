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

import * as Constantes from './constantes';

const URL = Constantes.URL_API_WS_AWS


type Props = {};
export default class App extends Component<Props> {
  
  ws = new WebSocket(URL)

  state = {
    messages: [],
    ligarSom: true,
    dataUltimaConsulta: null,
    respostasIncorretas: 0,
    chatHumano: false,
    connectionId: null
  }

  constructor(props) {
    super(props);


    Dialogflow.setConfiguration(
      Constantes.ID_DIALOG_FLOW, Dialogflow.LANG_PORTUGUESE_BRAZIL
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

    this.ws.onmessage = evt => {
      const retorno = JSON.parse(evt.data)
      if(this.state.chatHumano) {
        if(this.state.connectionId == null) {
          this.state.connectionId = retorno.connectionid;
        }

        if(this.state.connectionId != null && this.state.connectionId == retorno.usuario) {
         
          const messages = {action : "onMessage" , message : retorno.data} 
          if (this.state.ligarSom)
                        Tts.speak(retorno.data);
          this.onSend({
            _id: Math.round(Math.random() * 1000000),
            text: messages.message,
            createdAt: new Date(),
            user: {
              _id: 3,
              name: 'Chatbot Saraiva',
              avatar: 'http://www.freelogovectors.net/photo6/Saraiva-logo.jpg',
            }
          });
        }
      }

    }

    this.ws.onclose = () => {
      console.log('disconnected')
      this.setState({
        ws: new WebSocket(URL),
      })
    }


  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  submitMessageWs = messageString => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = {action : "onMessage" , message : messageString, usuario: "Atendente"} 
    this.ws.send(JSON.stringify(message))
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

            if(this.state.respostasIncorretas > 2) {
              messages[0].text = 'chat humano';
            }

            if(messages[0].text.toUpperCase() == 'retornar bot'.toUpperCase()) {
              messages[0].text = 'oi';
              this.state.respostasIncorretas = 0;
              this.state.chatHumano = false;
              this.state.connectionId = null;
            }

            if(this.state.chatHumano == false) {
              this.onSend(messages);
              Dialogflow.requestQuery(
                messages[0].text,
                result => {
                  Tts.stop();
                  if (this.state.ligarSom)
                    Tts.speak(result.result.fulfillment.messages[0].speech);
  
                  if(result.result.metadata.intentName == 'Default Fallback Intent') {
                    this.state.respostasIncorretas++;
                  } else {
                    this.state.respostasIncorretas = 0;
                  }
  
                  if(result.result.metadata.intentName == 'humano') {
                    this.state.chatHumano = true;
                  }
  
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
            } else {
              this.submitMessageWs(messages[0].text)
              this.onSend(messages)
            }
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
