import React from 'react'
import { Grid, Form, Segment, List, Label, Container, Table } from 'semantic-ui-react'
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useQueryClient, useQuery } from "react-query";
import axios from "axios";
import { useMutation } from 'react-query';
import SyntaxHighlighter from 'react-syntax-highlighter';
import styles from '../../styles/UserRequestFetcher.module.css';

const backend_service = process.env.NEXT_PUBLIC_AIRBUS_SERVICE_SUPPORT

function producingEventsNames(appName: string) {
  return axios.get(`${backend_service}/kyc/producing-events?appName=` + appName)
}

function allAppNames() {
  return axios.get(`${backend_service}/kyc/app-names`)
}

function getCurrentDetails(appName: string, eventName: string) {
  return axios.get(`${backend_service}/kyc/producer?appName=${appName}&eventName=${eventName}`)
}

let selectedApp = '';
let selectedEvent = '';

export function ProducerRequestHandler() {
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const queryClient = useQueryClient();
  const appResult = useQuery('app-names', allAppNames);
  let eventResult = useQuery('event-names', () => producingEventsNames(selectedApp));
  const { data: currentDetails } = useQuery('current-details', () => getCurrentDetails(selectedApp, selectedEvent));


  const [formData, setFormData] = useState({
    "requesterEmail": userEmail,
    "requesterTeamEmail": ""
  });

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  const optionsApp = appResult.data?.data.appNames.map((item: string) => { return { key: item, text: item, value: item } })
  let optionsEvent = eventResult.data?.data.events.map((item: string) => { return { key: item, text: item, value: item } })

  const handleFormChange = (event: object, item: { [key: string]: any }) => {
    formData[item.id] = item.value
    setFormData(formData)
  }

  const handleApplicationSelection = (event: object, item: any) => {
    selectedApp = item.value;
    queryClient.invalidateQueries('event-names');
    selectedEvent = '';
    handleFormChange(event, item);
  }

  const handleEventSelection = (event: object, item: any) => {
    selectedEvent = item.value;
    queryClient.invalidateQueries('current-details');
    handleFormChange(event, item);
  }

  const printAcquired = (event: object, item: any) => {
    console.log("selectedApp = " + selectedApp);
    console.log("selectedEvent = " + selectedEvent);
    console.log("Current Details: " );
    console.log(currentDetails);
  }

  return (
    <React.Fragment>
      <Form>
        <Form.Group widths='equal'>
          <Form.Select
            fluid
            id='appName'
            label='Producer Application'
            options={optionsApp}
            onChange={handleApplicationSelection}
          />

          <Form.Select
            fluid
            id='eventName'
            label='Producing Event Name'
            options={optionsEvent}
            onChange={handleEventSelection}
          />
        </Form.Group>
        <Form.Button onClick={printAcquired}>Print</Form.Button>
      </Form>
    </React.Fragment>
  )
}