import React from 'react'
import { useState } from "react";
import { Container, Form, Grid, Table } from 'semantic-ui-react'
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient, useMutation } from 'react-query';
import axios from 'axios';

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

const saveKycUpdate = (formData: object) => {  
  const promise = axios.post(`${backend_service}/kyc/producer`, formData)
  toast.promise(
    promise,
    {
      pending: 'Saving KYC Details',
      success: {
        render({data}) {
          return data?.data.message
        }
      },
      error: {
        render({data}) {
          console.log(data);
          return data?.response.data.message
        }
      }
    }
  );
  return promise
}

let selectedApp = '';
let selectedEvent = '';


export function UpdateDetails() {
  const session = useSession();
  const queryClient = useQueryClient();

  const appResult = useQuery('app-names', allAppNames);
  let eventResult = useQuery('event-names', () => producingEventsNames(selectedApp));
  const { data: currentDetails } = useQuery('current-details', () => getCurrentDetails(selectedApp, selectedEvent));

  const userEmail = session.data?.user?.email;
  const [formData, setFormData] = useState({
    "appName": "",
    "eventName": "",
    "brdLoad": "",
    "bauLoad": "",
    "sdkLang": "",
    "sdkVersion": "",
    "team": "",
    "managerEmail": "",
    "lastUpdatedBy": userEmail,
  });
  const optionalFields = ["brdLoad", "bauLoad"];

  const mutation = useMutation(saveKycUpdate, {
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries('current-details')
    },
  });

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
    { key: "java", text: "Java", value: "java" },
    { key: "go", text: "Go", value: "go" },
    { key: "python", text: "Python", value: "python" },
    { key: "node", text: "Node", value: "node" },
  ]

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

  const handleFormChange = (event: object, item: { [key: string]: any }) => {
    formData[item.id] = item.value
    setFormData(formData)
  }



  const validateAndSubmitRequest = (e: any, item: any) => {
    e.preventDefault();
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
    <>
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Container>
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

                <Form.Group widths={'equal'}>
                  <Form.Input id='brdLoad' fluid label='BRD Load' placeholder='in KBps' onChange={handleFormChange} />
                  <Form.Input id='bauLoad' fluid label='BAU Load' placeholder='in KBps' onChange={handleFormChange} />
                </Form.Group>
                <Form.Group widths={'equal'}>
                  <Form.Select
                    fluid
                    id='sdkLang'
                    label='Airbus SDK'
                    options={optionsSDKs}
                    onChange={handleFormChange}
                  />
                  <Form.Input fluid id='sdkVersion' label='SDK version' onChange={handleFormChange} />
                </Form.Group>
                <Form.Group widths={'equal'}>
                  <Form.Input required fluid id='managerEmail' type='email' label='Manager Email' onChange={handleFormChange} />
                  <Form.Input fluid id='team' label='Team Name' placeholder='Enter team email if available' onChange={handleFormChange} />
                  <Form.Input fluid id='lastUpdatedBy' label='Updater' value={userEmail} onChange={handleFormChange} />
                </Form.Group>

                <Form.Button onClick={validateAndSubmitRequest}>Save</Form.Button>
              </Form>
            </Container>
          </Grid.Column>


          {!!selectedEvent &&
            <Grid.Column width={5}>
              <Container>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell colSpan='2'>Current Details</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Producer Application</Table.Cell>
                      <Table.Cell> {selectedApp} </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>Producer Event Name</Table.Cell>
                      <Table.Cell> {selectedEvent} </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>BRD Load</Table.Cell>
                      <Table.Cell> {currentDetails?.data.brdLoad} </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>BAU Load</Table.Cell>
                      <Table.Cell> {currentDetails?.data.bauLoad} </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>Airbus SDK</Table.Cell>
                      <Table.Cell> {currentDetails?.data.sdkLang} </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>SDK Version</Table.Cell>
                      <Table.Cell> {currentDetails?.data.sdkVersion} </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>Manager Email</Table.Cell>
                      <Table.Cell> {currentDetails?.data.managerEmail} </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>Team</Table.Cell>
                      <Table.Cell> {currentDetails?.data.team} </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>Last Updated By</Table.Cell>
                      <Table.Cell> {currentDetails?.data.lastUpdatedBy} </Table.Cell>
                    </Table.Row>
                  </Table.Body>

                </Table>
              </Container>
            </Grid.Column>}
        </Grid.Row>
      </Grid>
    </>
  );
}