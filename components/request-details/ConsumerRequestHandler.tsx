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

function consumingAppNames(appName: string, eventName: string) {
  return axios.get(`${backend_service}/kyc/consumer?appName=${appName}&eventName=${eventName}`)
}


function producingEventsNames(appName: string) {
  return axios.get(`${backend_service}/kyc/producing-events?appName=` + appName)
}

function allAppNames() {
  return axios.get(`${backend_service}/kyc/app-names`)
}

function getCurrentProducerDetails(appName: string, eventName: string) {
  return axios.get(`${backend_service}/kyc/producer?appName=${appName}&eventName=${eventName}`)
}

let selectedDC = '';
let selectedProducingApp = '';
let selectedEvent = '';
let selectedConsumingApp = '';

export function ConsumerRequestHandler() {
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const queryClient = useQueryClient();
  const appResult = useQuery('app-names', allAppNames);
  let eventResult = useQuery('event-names', () => producingEventsNames(selectedProducingApp));
  const { data: currentProducerDetails } = useQuery('current-producer-details', () => getCurrentProducerDetails(selectedProducingApp, selectedEvent));
  const { data: consumerAppNames } = useQuery('consuming-app-names', () => consumingAppNames(selectedProducingApp, selectedEvent));


  const [formData, setFormData] = useState({
    "requesterEmail": userEmail,
    "requesterTeamEmail": ""
  });

  const datacenters = [
    { key: 'dc2', text: 'Chennai', value: 'dc2' },
    { key: 'dc1', text: 'Pune', value: 'dc1' },
  ]

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }
  const optionsProducerApp = appResult.data?.data.appNames.map((item: string) => { return { key: item, text: item, value: item } })
  let optionsEvent = eventResult.data?.data.events.map((item: string) => { return { key: item, text: item, value: item } })
  const optionsConsumerApp = consumerAppNames?.data?.consumingAppNames?.map((item: string) => { return { key: item, text: item, value: item } })

  const handleProducingApplicationSelection = (event: object, item: any) => {
    selectedProducingApp = item.value;
    queryClient.invalidateQueries('event-names');
    selectedEvent = '';
  }

  const handleEventSelection = (event: object, item: any) => {
    selectedEvent = item.value;
    queryClient.invalidateQueries('current-producer-details');
    queryClient.invalidateQueries('consuming-app-names');
  }

  const handleConsumingApplicationSelection = (event: object, item: any) => {
    selectedConsumingApp = item.value;
  }
  const handleDcChange = (event: object, item: any) => {
    selectedDC = item.value;
  }

  const printAcquired = (event: object, item: any) => {
    console.log("selectedDC = " + selectedDC);
    console.log("selectedConsumingApp = " + selectedConsumingApp);
    console.log("selectedProducingApp = " + selectedProducingApp);
    console.log("selectedEvent = " + selectedEvent);
    console.log("Current Producer Details: ");
    console.log(currentProducerDetails);
  }

  return (
    <React.Fragment>
      <Form>
        <Form.Group widths='equal'>
        <Form.Select
            fluid
            id='datacenters'
            label='Data Center'
            options={datacenters}
            onChange={handleDcChange}
          />

          <Form.Select
            fluid
            id='appName'
            label='Producing Application'
            options={optionsProducerApp}
            onChange={handleProducingApplicationSelection}
          />

          <Form.Select
            fluid
            id='eventName'
            label='Event Name'
            options={optionsEvent}
            onChange={handleEventSelection}
          />

          <Form.Select
            fluid
            id='appName'
            label='Consuming Application'
            options={optionsConsumerApp}
            onChange={handleConsumingApplicationSelection}
          />

        </Form.Group>
        <Form.Button onClick={printAcquired}>Print</Form.Button>
      </Form>
    </React.Fragment>
  )
}