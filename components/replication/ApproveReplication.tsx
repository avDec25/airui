import React from 'react'
import { Form } from 'semantic-ui-react'
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useMutation } from 'react-query';
import validator from "validator";

const backend_service = process.env.NEXT_PUBLIC_AIRBUS_SERVICE_SUPPORT

const approveReplication = (formData: { [key: string]: string }) => {
  const promise = axios.post(`${backend_service}/replication/approve`, formData)
  toast.promise(
    promise,
    {
      pending: 'Approving Replication Request',
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


export function ApproveReplication() {
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const mutation = useMutation(approveReplication);

  const datacenters = [
    { key: 'dc2', text: 'Chennai', value: 'dc2' },
    { key: 'dc1', text: 'Pune', value: 'dc1' },
  ]

  const [formData, setFormData] = useState({
    "requestId": "",
    "approvedBy": userEmail,
    "vmHostname": "not-assigned-yet",
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
      if (!value) {
        hasError = true
        message = `Please fill ${key} before continuing`
      } else if (key == "requestId" && !validator.isUUID(value)) {
        hasError = true
        message = `Incorrect Request ID`
      }
    }
    if (hasError) {
      toast.error(`Error; ${message}`, {
        position: "bottom-left",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      // console.log(formData);
      mutation.mutate(formData);
    }
  }

  return (
    <React.Fragment>
      <Form>
        <Form.Group widths='equal'>
          <Form.Input id="requestId" required fluid label='Request Id' placeholder="enter request id here" onChange={handleFormChange} />
          <Form.Input id="vmHostname" required fluid label='VM Hostname' placeholder="vm identifier IP or Hostname" onChange={handleFormChange} />
          <Form.Input id="approvedBy" value={userEmail} fluid type='email' label='Approved By' readOnly />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input required fluid onChange={handleFormChange} defaultValue={"25"} id="maxPollRecords" label='Max Poll Records' />
          <Form.Input required fluid onChange={handleFormChange} defaultValue={"65536"} id="batchSize" label='Batch Size' />
          <Form.Input required fluid onChange={handleFormChange} defaultValue={"200"} id="lingerMs" label='Linger time (in ms)' />
          <Form.Input required fluid onChange={handleFormChange} defaultValue={"2"} id="numStreams" label='Number of Consumer Streams' />
        </Form.Group>

        <Form.Button onClick={validateAndSubmitRequest}>Submit</Form.Button>
      </Form>
    </React.Fragment>
  )
}