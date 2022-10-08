import React from 'react'
import { Form } from 'semantic-ui-react'
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useMutation } from 'react-query';

const backend_service = process.env.NEXT_PUBLIC_AIRBUS_SERVICE_SUPPORT

const requestReplication = (formData: { [key: string]: string }) => {
  const promise = axios.post(`${backend_service}/replication/enable`, formData)
  toast.promise(
    promise,
    {
      pending: 'Sending Replication Request',
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


export function RequestReplication() {
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const mutation = useMutation(requestReplication);

  const datacenters = [
    { key: 'dc2', text: 'Chennai', value: 'dc2' },
    { key: 'dc1', text: 'Pune', value: 'dc1' },
  ]

  const [formData, setFormData] = useState({
    "dataCenter": "",
    "topicName": "",
    "fromKafkaServers": "",
    "toKafkaServers": "",
    "requesterEmail": userEmail,
    "requesterTeamEmail": "",
    "vmHostname": "not-assigned-yet",
    "approvedBy": "not-assigned-yet",
    "maxPollRecords": "25",
    "batchSize": "65536",
    "lingerMs": "200",
    "numStreams": "2",
  });

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  const handleFormChange = (event: object, item: { [key: string]: any }) => {
    formData[item.id] = item.value
    setFormData(formData)
  }

  const validateAndSubmitRequest = () => {
    var hasError = false;
    var message = "";
    for (const [key, value] of Object.entries(formData)) {
      if (key != "currentSchema") {
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
          <Form.Select id="dataCenter" required fluid label='Data Center' placeholder='where messages are produced' options={datacenters} onChange={handleFormChange} />
          <Form.Input id="topicName" required fluid label='Topic Name' placeholder="kafka topic name, not event name" onChange={handleFormChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input id="fromKafkaServers" required fluid label='From Kafka' placeholder="bootstrap server addresses, with port, separated by commas, no white space" onChange={handleFormChange} />
          <Form.Input id="toKafkaServers" required fluid label='To Kafka' placeholder="bootstrap server addresses, with port, separated by commas, no white space" onChange={handleFormChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input id="requesterEmail" value={userEmail} fluid type='email' label='POC Email' readOnly />
          <Form.Input id="requesterTeamEmail" fluid required type='email' label='Team Email' placeholder='Team Email or Manager Email' onChange={handleFormChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input value={formData['maxPollRecords']} id="maxPollRecords" fluid label='Max Poll Records' readOnly />
          <Form.Input value={formData['batchSize']} id="batchSize" fluid label='Batch Size' readOnly />
          <Form.Input value={formData['lingerMs']} id="lingerMs" fluid label='Linger time (in ms)' readOnly />
          <Form.Input value={formData['numStreams']} id="numStreams" fluid label='Number of Consumer Streams' readOnly />
        </Form.Group>

        <Form.Button onClick={validateAndSubmitRequest}>Submit</Form.Button>
      </Form>
    </React.Fragment>
  )
}