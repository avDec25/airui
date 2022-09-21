import React from 'react'
import { Form } from 'semantic-ui-react'
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useMutation } from 'react-query';

const backend_service = process.env.NEXT_PUBLIC_AIRBUS_SERVICE_SUPPORT

const registerProducer = (formData: { [key: string]: string }) => {
  const promise = axios.post(`${backend_service}/simpleregister/event`, formData)
  toast.promise(
    promise,
    {
      pending: 'Registering Producer',
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


export function SimpleRegisterProducer() {
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const mutation = useMutation(registerProducer);

  const [formData, setFormData] = useState({
    "producerAppName": "",
    "eventName": "",
    "clusterId": "",
    "schemaId": "",
    "schemaType": "",
    "currentSchema": "",
    "lastUpdatedBy": userEmail,
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
      if (!value) {
        if (key != "currentSchema") {
          hasError = true
          message = `Please fill ${key} before continuing`
        }
      }
    }
    if (hasError) {
      toast.error(`Found Empty field ${message}`, {
        position: "top-right",
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
          <Form.Input required fluid onChange={handleFormChange} id="producerAppName" label='Producer App Name' placeholder="already registered app name" />
          <Form.Input required fluid onChange={handleFormChange} id="eventName" label='Event Name' placeholder="event name, not topic name" />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input required fluid onChange={handleFormChange} id="clusterId" label='Cluster Id' placeholder="14" />
          <Form.Input required fluid onChange={handleFormChange} id="schemaId" label='Schema Id' placeholder="-1" />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input required fluid onChange={handleFormChange} id="schemaType" label='Schema Type' placeholder="PLAIN" />
          <Form.Input fluid onChange={handleFormChange} id="currentSchema" label='Current Schema' placeholder="leave this field empty if not sure what to fill here" />
        </Form.Group>
        <Form.Input fluid id="lastUpdatedBy" label='Submitted By' value={userEmail} />
        <Form.Button onClick={validateAndSubmitRequest}> Submit </Form.Button>
      </Form>
    </React.Fragment>
  )
}