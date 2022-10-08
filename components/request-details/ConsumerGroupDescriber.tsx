import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Icon } from 'semantic-ui-react';
import SockJS from 'sockjs-client';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import ConsumerGroupDetailsRenderer from "./CGDRenderer";
import CGDRenderer from "./CGDRenderer";

const backend_socket: string | undefined = process.env.NEXT_PUBLIC_SOCKET_SERVICE
const backend_service: string | undefined = process.env.NEXT_PUBLIC_KAFKARUN_SERVICE

function startConsumerGroupDescriptionFlow(formData: object) {
  return axios.post(`${backend_service}/realtime/consumer-group/describe`, formData);
}


var stompClient: CompatClient;

export default function ConsumerGroupDescriber({ groupId: string }) {

  const [formData, setformData] = useState({
    'bootstrapServers': 'localhost:9092',
    'consumerGroupId': 'ocean-consumer-group'
  });
  const [messages, setMessages] = useState([]);

  useEffect((): any => {
    const socket = new SockJS(backend_socket)
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame: string) {
      console.log('Connected: ' + frame);
      stompClient.subscribe('/topic/consumer-group-describe', (frame: IMessage) => {
        let message = frame.body;
        console.log(message);

        messages.push(message);
        setMessages(message);
      });
    });

    return function cleanup() {
      if (stompClient !== null) {
        stompClient.disconnect();
      }
    };
  }, []);


  return (
    <>
      <Button onClick={() => {startConsumerGroupDescriptionFlow(formData)}}>
        <Icon name='refresh' /> Refresh
      </Button>
      <CGDRenderer data={messages} />
    </>
  );
}