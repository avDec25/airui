import React from 'react'
import { Form } from 'semantic-ui-react'
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useMutation } from 'react-query';

const backend_service = process.env.NEXT_PUBLIC_KAFKARUN

const transferPartition = (formData: { [key: string]: string }) => {
  const promise = axios.post(`${backend_service}/partition/transfer`, formData)
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


export function SinglePartitionTransfer() {
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const mutation = useMutation(transferPartition);

  const [formData, setFormData] = useState({
    "consumeFromKafka": "",
    "produceToKafka": "",

    "consumeFromTopic": "",
    "produceToTopic": "",

    "consumeFromPartition": "0",
    "produceToPartition": "0",

    "consumerGroupId": "",
    "consumeFromOffset": "0",

    "pollTime": "1000",
    "epoch": "3",

    "groupInstanceId": "",
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
    }
  }

  return (
    <React.Fragment>
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
          <Form.Input required fluid id="consumerGroupId" label='Consumer Group Id' placeholder='format: consumer-producer-event-consumer-group' onChange={handleFormChange} />
          <Form.Input required fluid id="consumeFromOffset" type='number' min='0' defaultValue={'0'} label='Consume From Offset' placeholder='start consumption from offset of consumeFromPartition' onChange={handleFormChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input required fluid id="pollTime" type='number' min='100' max='10000' label='Consumer poll time' placeholder='poll duration in milliseconds' defaultValue={'1000'} onChange={handleFormChange} />
          <Form.Input required fluid id="epoch" type='number' min='1' label='Epoch' defaultValue={'3'} placeholder='times this entire consume and produce cycle be repeated' onChange={handleFormChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input fluid id="groupInstanceId" label='Group Instance ID' placeholder={'leave it, if this is unknown to you'} onChange={handleFormChange} />
          <Form.Input fluid id="requesterEmail" label='Submitted By' value={userEmail} onChange={handleFormChange} />
        </Form.Group>

        <Form.Button onClick={validateAndSubmitRequest}>Submit</Form.Button>
      </Form>
    </React.Fragment>
  )
}