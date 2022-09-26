import React from 'react'
import { Grid, Form, Button } from 'semantic-ui-react'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useMutation } from 'react-query';
import SockJS from 'sockjs-client';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import RenderLogs from "../kafkaruns/RenderLogs";

const backend_service: string | undefined = process.env.NEXT_PUBLIC_KAFKARUN
const backend_socket: string | undefined = process.env.NEXT_PUBLIC_SOCKET_SERVICE

const transferPartition = (formData: { [key: string]: string }) => {
  const promise = axios.post(`${backend_service}/partition/transfer/start`, formData)
  toast.promise(
    promise,
    {
      pending: 'Partition transfer in progress...',
      success: {
        render({ data }) {
          return data?.data.message
        }
      },
      error: {
        render({ data }) {
          console.log(data);
          return data?.response.data.message
        }
      }
    }
  );
  return promise
}

const stopTransfer = () => {
  const promise = axios.post(`${backend_service}/partition/transfer/stop`)
  toast.promise(
    promise,
    {
      pending: 'Stopping Partition Transfer...',
      success: {
        render({ data }) {
          return data?.data.message
        }
      },
      error: {
        render({ data }) {
          console.log(data);
          return data?.response.data.message
        }
      }
    }
  );
  return promise
}

var stompClient: CompatClient;
let processSubmitted: boolean = false;

export function SinglePartitionTransfer() {
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const mutation = useMutation(transferPartition);
  const stoptransfer = useMutation(stopTransfer);
  const [messages, setMessages] = useState([]);

  useEffect((): any => {
    const socket = new SockJS(backend_socket)
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame: string) {
      console.log('Connected: ' + frame);
      stompClient.subscribe('/topic/greetings', (frame: IMessage) => {
        let message = frame.body;
        console.log(message);

        messages.unshift(message);
        setMessages(message);
      });
    });

    return function cleanup() {
      if (stompClient !== null) {
        stompClient.disconnect();
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    "consumeFromKafka": "",
    "produceToKafka": "",
    "consumeFromTopic": "",
    "produceToTopic": "",
    "consumeFromPartition": "0",
    "produceToPartition": "0",
    "consumerGroupId": "",
    "commitBatch": 50,
    "requesterEmail": userEmail,
  });

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  const handleFormChange = (event: object, item: { [key: string]: any }) => {
    formData[item.id] = item.value
    setFormData(formData);
  }

  const validateAndSubmitRequest = () => {
    var hasError = false;
    var message = "";
    for (const [key, value] of Object.entries(formData)) {
      if (key != 'groupInstanceId') {
        if (!value) {
          hasError = true
          message = `Please fill ${key} before continuing`
        }
      }
    }
    if (hasError) {
      toast.error(`Found Empty field ${message}`, {
        position: "bottom-left",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      mutation.mutate(formData);
      processSubmitted = true;
    }
  }

  const stopPartitionTransfer = () => {
    stoptransfer.mutate();
    processSubmitted = false;
  }

  return (
    <React.Fragment>
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form>
              <Form.Group widths='equal'>
                <Form.Input required fluid id="consumeFromKafka" label='Consume From Kafka' placeholder="bootstrap server addresses" onChange={handleFormChange} />
                <Form.Input required fluid id="produceToKafka" label='Producer To Kafka' placeholder="bootstrap server addresses" onChange={handleFormChange} />
              </Form.Group>

              <Form.Group widths='equal'>
                <Form.Input required fluid id="consumeFromTopic" label='Consume From Topic' placeholder='topic to consume from' onChange={handleFormChange} />
                <Form.Input required fluid id="produceToTopic" label='Produce To Topic' placeholder='topic to produce in' onChange={handleFormChange} />
              </Form.Group>

              <Form.Group widths='equal'>
                <Form.Input required fluid id="consumeFromPartition" type='number' min='0' label='Consume from partition' placeholder='partition to consume from' defaultValue={'0'} onChange={handleFormChange} />
                <Form.Input required fluid id="produceToPartition" type='number' min='0' label='Produce to partition' placeholder='partition to produce in' defaultValue={'0'} onChange={handleFormChange} />
              </Form.Group>

              <Form.Group widths='equal'>
                <Form.Input required fluid id="commitBatch" type='number' min='50' defaultValue={'50'} label='Batch Size' placeholder='unit: message count' onChange={handleFormChange} />
                <Form.Input fluid id="requesterEmail" label='Submitted By' value={userEmail} onChange={handleFormChange} />
              </Form.Group>

              <Form.Group widths='equal'>
                <Form.Input required fluid id="consumerGroupId" label='Consumer Group Id' placeholder='format: consumerApp-producerApp-eventName-consumer-group' onChange={handleFormChange} />
              </Form.Group>
              {
                processSubmitted
                  ? <Form.Button negative onClick={stopPartitionTransfer}>Stop Transfer</Form.Button>
                  : <Form.Button positive onClick={validateAndSubmitRequest}>Start Transfer</Form.Button>
              }
            </Form>
          </Grid.Column>
          <Grid.Column width={8}>
            <RenderLogs data={messages} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  )
}