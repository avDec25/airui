import React from 'react'
import { Form, Message, Grid, Tab } from 'semantic-ui-react'
import { useState, useEffect } from "react";
import axios from "axios";
import ConsumerGroupDescriber from './ConsumerGroupDescriber';
import CompleteEventDetailsRenderer from './CompleteEventDetailsRenderer';
import styles from '../../styles/EventRequestsHandler.module.css';

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

function getCompleteEventDetails(producerAppName: string, eventName: string) {
  return axios.get(`${backend_service}/info/complete/event-details?producerAppName=${producerAppName}&eventName=${eventName}`);
}

const datacenters = [
  { key: 'dc2', text: 'Chennai', value: 'dc2' },
  { key: 'dc1', text: 'Pune', value: 'dc1' },
]

export function EventRequestsHandler() {
  const [optionsProducerApp, setoptionsProducerApp] = useState([{ key: '', text: '', value: '' }]);
  const [optionsEvents, setoptionsEvents] = useState([{ key: '', text: '', value: '' }]);
  const [optionsConsumingApp, setoptionsConsumingApp] = useState([{ key: '', text: '', value: '' }]);

  const [selectedProducerApp, setSelectedProducerApp] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedConsumingApp, setSelectedConsumingApp] = useState('');
  const [selectedDC, setselectedDC] = useState('');
  const [eventDetails, seteventDetails] = useState('');
  const [consumerGroupId, setconsumerGroupId] = useState('');




  useEffect(() => {
    allAppNames().then(response => {
      setoptionsProducerApp(response.data.appNames?.map((item: string) => { return { key: item, text: item, value: item } }))
    });
  }, [])

  useEffect(() => {
    producingEventsNames(selectedProducerApp).then(response => {
      setoptionsEvents(response.data.events?.map((item: string) => { return { key: item, text: item, value: item } }))
    });
    setSelectedEvent('');
  }, [selectedProducerApp])

  useEffect(() => {
    consumingAppNames(selectedProducerApp, selectedEvent).then(response => {
      setoptionsConsumingApp(response.data.consumingAppNames?.map((item: string) => { return { key: item, text: item, value: item } }))
    });
    getCompleteEventDetails(selectedProducerApp, selectedEvent).then(response => {
      seteventDetails(response.data)
    });
    setSelectedConsumingApp('');
  }, [selectedProducerApp, selectedEvent])



  const handleDcChange = (event: object, item: any) => {
    setselectedDC(item.value);
  }

  const handleProducingApplicationSelection = (event: object, item: any) => {
    setSelectedProducerApp(item.value);
  }

  const handleEventSelection = (event: object, item: any) => {
    setSelectedEvent(item.value);
  }

  const handleConsumingApplicationSelection = (event: object, item: any) => {
    setSelectedConsumingApp(item.value);
    if (selectedDC.length > 0 &&
      selectedProducerApp.length > 0 &&
      selectedEvent.length > 0) {
      setconsumerGroupId(`${selectedDC}-${selectedConsumingApp}-${selectedProducerApp}-${selectedEvent}-consumer-group`);
    }
  }


  const panes = [
    {
      menuItem: 'Event Details',
      render: () => <Tab.Pane attached={false}>
        {eventDetails && <CompleteEventDetailsRenderer completeEventDetails={eventDetails} />}
      </Tab.Pane>,
    },
    {
      menuItem: 'Consumer Group Describe',
      render: () => <Tab.Pane attached={false}>
        {selectedDC.length > 0 && selectedConsumingApp.length > 0 && selectedProducerApp.length > 0 &&
          selectedEvent.length > 0 && <ConsumerGroupDescriber groupId={consumerGroupId} />}
      </Tab.Pane>,
    },
  ];

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
            value={selectedDC}
          />

          <Form.Select
            fluid
            id='appName'
            label='Producing Application'
            options={optionsProducerApp}
            onChange={handleProducingApplicationSelection}
            value={selectedProducerApp}
          />

          <Form.Select
            fluid
            id='eventName'
            label='Event Name'
            options={optionsEvents}
            onChange={handleEventSelection}
            value={selectedEvent}
          />

          <Form.Select
            fluid
            id='appName'
            label='Consuming Application'
            options={optionsConsumingApp}
            onChange={handleConsumingApplicationSelection}
            value={selectedConsumingApp}
          />
        </Form.Group>
      </Form>

      <Grid>
        <Grid.Row>
          {consumerGroupId.length > 0 && <Grid.Column>
              <Message header="Consumer Group" content={consumerGroupId} />
            </Grid.Column>}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <Tab menu={{ attached: false, tabular: false }} panes={panes} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  )
}

