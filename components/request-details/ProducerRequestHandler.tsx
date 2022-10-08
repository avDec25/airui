import React, { useEffect } from 'react'
import { Grid, Form, Segment, List, Label, Container, Table } from 'semantic-ui-react'
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useQueryClient, useQuery } from "react-query";
import axios from "axios";
import { useMutation } from 'react-query';
import SyntaxHighlighter from 'react-syntax-highlighter';
import styles from '../../styles/UserRequestFetcher.module.css';
import { CompleteEventDetailsRenderer } from './CompleteEventDetailsRenderer';

const backend_service = process.env.NEXT_PUBLIC_AIRBUS_SERVICE_SUPPORT

function producingEventsNames(appName: string) {
  return axios.get(`${backend_service}/kyc/producing-events?appName=${appName}`)
}

function allAppNames() {
  return axios.get(`${backend_service}/kyc/app-names`)
}

function getCompleteEventDetails(producerAppName: string, eventName: string) {
  return axios.get(`${backend_service}/info/complete/event-details?producerAppName=${producerAppName}&eventName=${eventName}`);
}

let selectedApp = '';
let selectedEvent = '';

export function ProducerRequestHandler() {
  const queryClient = useQueryClient();
  const session = useSession();
  const userEmail = session.data?.user?.email;

  const [formData, setFormData] = useState({
    "requesterEmail": userEmail,
    "requesterTeamEmail": ""
  });
  const [optionsApp, setOptionsApp] = useState([{ key: '', item: '', value: '' }]);
  const [optionsEvent, setOptionsEvent] = useState([{ key: '', item: '', value: '' }]);

  useQuery('app-names', allAppNames, {
    onSuccess: (data) => {
      setOptionsApp(data?.data?.appNames.map((item: string) => { return { key: item, text: item, value: item } }));
    }
  });
  useQuery('event-names', () => producingEventsNames(selectedApp), {
    onSuccess: (data) => {
      setOptionsEvent(data?.data.events.map((item: string) => { return { key: item, text: item, value: item } }))
    }
  });
  const completeEventDetails = useQuery('complete-event-details', () => getCompleteEventDetails(selectedApp, selectedEvent));

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  const handleFormChange = (event: object, item: { [key: string]: any }) => {
    formData[item.id] = item.value
    setFormData(formData)
  }

  const handleApplicationSelection = (event: object, item: any) => {
    selectedApp = item.value;
    queryClient.invalidateQueries('event-names');
    queryClient.invalidateQueries('complete-event-details');
    handleFormChange(event, item);
    selectedEvent = '';
  }

  const handleEventSelection = (event: object, item: any) => {
    selectedEvent = item.value;
    queryClient.invalidateQueries('complete-event-details');
    handleFormChange(event, item);
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
      </Form>

      {selectedEvent && <CompleteEventDetailsRenderer completeEventDetails={completeEventDetails?.data?.data} />}
    </React.Fragment>
  )
}