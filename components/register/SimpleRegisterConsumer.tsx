import React from 'react'
import { Form } from 'semantic-ui-react'
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useMutation } from 'react-query';

const backend_service = process.env.NEXT_PUBLIC_AIRBUS_SERVICE_SUPPORT

const registerConsumer = (formData: { [key: string]: string }) => {
  const promise = axios.post(`${backend_service}/simpleregister/consumer`, formData)
  toast.promise(
    promise,
    {
      pending: 'Registering Consumer',
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

export function SimpleRegisterConsumer() {
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const mutation = useMutation(registerConsumer);

  const [formData, setFormData] = useState({
    "producerAppName": "",
    "eventName": "",
    "consumerAppName": "",
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
          <Form.Input required fluid onChange={handleFormChange} id="producerAppName" label='Producer App Name' placeholder="already registered app name" />
          <Form.Input required fluid onChange={handleFormChange} id="eventName" label='Event Name' placeholder="event name, not topic name" />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input required fluid onChange={handleFormChange} id="consumerAppName" label='Consumer App Name' placeholder="already registered app name" />
          <Form.Input fluid id="lastUpdatedBy" label='Submitted By' value={userEmail} />
        </Form.Group>
        <Form.Button onClick={validateAndSubmitRequest}> Submit </Form.Button>
      </Form>
    </React.Fragment>
  )
}