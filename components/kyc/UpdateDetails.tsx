import React from 'react'
import { useState } from "react";
import { Container, Form, Grid } from 'semantic-ui-react'
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

const backend_service = process.env.NEXT_PUBLIC_AIRBUS_SERVICE_SUPPORT

function producingEventsNames(appName: string) {
  return axios.get(`${backend_service}/kyc/producing-events?appName=` + appName)
}

function allAppNames() {
  return axios.get(`${backend_service}/kyc/app-names`)
}

let selectedApp = '';
let selectedEvent = '';

export function UpdateDetails() {
  const session = useSession();
  const queryClient = useQueryClient();

  const appResult = useQuery('app-names', allAppNames);
  let eventResult = useQuery('event-names', () => producingEventsNames(selectedApp));

  const userEmail = session.data?.user?.email;
  const [formData, setFormData] = useState({
    "appName": "",
    "eventName": "",
    "brdLoad": "",
    "bauLoad": "",
    "team": "",
    "managerEmail": "",
    "updaterEmail": userEmail,
  });
  const optionalFields = ["brdLoad", "bauLoad"];

  if (session.status != "authenticated") {
    return (
      <div>Login first to continue</div>
    );
  }



  if (appResult.isLoading || eventResult.isLoading) {
    return <>is Loading....</>
  }
  const optionsApp = appResult.data?.data.appNames.map((item: string) => { return { key: item, text: item, value: item } })
  let optionsEvent = eventResult.data?.data.events.map((item: string) => { return { key: item, text: item, value: item } })
  const optionsSDKs = [
    {key: "java", text: "Java", value: "java"},
    {key: "go", text: "Go", value: "go"},
    {key: "python", text: "Python", value: "python"},
    {key: "node", text: "Node", value: "node"},
  ]

  const handleApplicationSelection = (event: object, item: any) => {
    selectedApp = item.value;
    queryClient.invalidateQueries('event-names');
    selectedEvent = '';
  }

  const handleEventSelection = (event: object, item: any) => {
    selectedEvent = item.value;
    console.log(selectedApp);
    console.log(selectedEvent);
  }



  const validateAndSubmitRequest = (e: object, item: any) => {
    var hasError = false;
    var message = "";
    for (const [key, value] of Object.entries(formData)) {
      if (!optionalFields.includes(key)) {
        if (!value) {
          hasError = true
          message = `Please fill ${key} before continuing`
        }
      }
    }
    if (hasError) {
      toast.error(`Found Empty field; ${message}`, {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      console.log('submitted form')
    }
  }

  return (
    <>
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Container>
              <Form>
                <Form.Group widths='equal'>
                  <Form.Select
                    fluid
                    label='Producer Application'
                    options={optionsApp}
                    onChange={handleApplicationSelection}
                  />

                  <Form.Select
                    fluid
                    label='Producing Event Name'
                    options={optionsEvent}
                    onChange={handleEventSelection}
                  />
                </Form.Group>

                <Form.Group widths={'equal'}>
                  <Form.Input fluid label='BRD Load' placeholder='in KBps' />
                  <Form.Input fluid label='BAU Load' placeholder='in KBps' />
                </Form.Group>
                <Form.Group widths={'equal'}>
                <Form.Select
                    fluid
                    label='Airbus SDK'
                    options={optionsSDKs}
                  />
                  <Form.Input fluid label='SDK version' />
                </Form.Group>
                <Form.Group widths={'equal'}>
                  <Form.Input required fluid type='email' label='Manager Email' placeholder='email only is accepted' />
                  <Form.Input fluid label='Team Name or Team Email' />
                  <Form.Input fluid label='Updater' value={userEmail} />
                </Form.Group>

                <Form.Button>Submit</Form.Button>
              </Form>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}