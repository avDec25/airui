import React from 'react'
import { useState } from "react";
import { Statistic, Container, Form, Grid, Table, Popup, List } from 'semantic-ui-react'
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient, useMutation } from 'react-query';
import axios from 'axios';
import validator from 'validator';

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

const saveKycUpdate = (formData: { [key: string]: string }) => {
  const promise = axios.post(`${backend_service}/kyc/producer`, formData)
  toast.promise(
    promise,
    {
      pending: 'Saving KYC Details',
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
    "importance": "",
    "description": "",
    "primaryDC": "",
    "brdLoad": "",
    "bauLoad": "",
    "sdkLang": "",
    "sdkVersion": "",
    "team": "",
    "managerEmail": "",
    "lastUpdatedBy": userEmail,
  });

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
    return <>Loading Data...</>
  }
  const optionsApp = appResult.data?.data.appNames.map((item: string) => { return { key: item, text: item, value: item } })
  let optionsEvent = eventResult.data?.data.events.map((item: string) => { return { key: item, text: item, value: item } })
  const optionsSDKs = [
    { key: "java", text: "Java", value: "java" },
    { key: "go", text: "Go", value: "go" },
    { key: "python", text: "Python", value: "python" },
    { key: "node", text: "Node", value: "node" },
  ]

  const optionsImportance = [
    { key: "critical", text: "🔴 Critical", value: "critical" },
    { key: "major", text: "🟠 Major", value: "major" },
    { key: "minor", text: "🟡 Minor", value: "minor" },
    { key: "trivial", text: "⚪ Trivial", value: "trivial" },
  ]

  const optionsDC = [
    { key: "pune", text: "Pune (dc1)", value: "pune" },
    { key: "chennai", text: "Chennai (dc2)", value: "chennai" },
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


  const validateAndSubmitRequest = (e: object, item: any) => {
    console.log("======checking=======");
    console.log(formData);

    var hasError = false;
    var message = "";
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        hasError = true
        message = `Please fill ${key} before continuing`
      }
      if (key == 'description') {
        if (!validator.isAlphanumeric(value?.replaceAll(' ', ''))) {
          hasError = true
          message = 'Event Description only accepts letters and numbers.'
        }
      }
    }
    if (hasError) {
      toast.error(`Error: ${message}`, {
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
                  <Form.Input required fluid type='email' id='managerEmail' label='Manager Email' onChange={handleFormChange} />
                  <Form.Input fluid id='team' label='Team Name' placeholder='Enter team email if available' onChange={handleFormChange} />
                </Form.Group>

                <Form.Group widths={'equal'}>
                  <Popup trigger={
                    <Form.Select
                      id='importance'
                      label='Importance'
                      options={optionsImportance}
                      onChange={handleFormChange}
                    />
                  }>
                    <List>
                      <List.Item><strong>🔴 Critical: </strong> Event failure will result in an immediate and irrecoverable Revenue loss</List.Item>
                      <List.Item><strong>🟠 Major: </strong> Failure for long will eventually result in Revenue Loss</List.Item>
                      <List.Item><strong>🟡 Minor: </strong> Failure will not result in a revenue loss, Kind of loss will be different</List.Item>
                      <List.Item><strong>⚪ Trivial: </strong> Event deletion is acceptable</List.Item>
                    </List>
                  </Popup>

                  <Form.Select
                    id='primaryDC'
                    label='Primary Data Center'
                    options={optionsDC}
                    onChange={handleFormChange}
                  />
                </Form.Group>

                <Form.TextArea
                  id='description'
                  required={true}
                  label='Event Description'
                  placeholder='Describe what this event is used for OR inform what it carries'
                  onChange={handleFormChange}
                />
                <Form.Input fluid id='lastUpdatedBy' label='Updater' value={userEmail} onChange={handleFormChange} />

                <Form.Button type='submit' onClick={validateAndSubmitRequest}>Submit</Form.Button>
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

                    <Popup trigger={
                      <Table.Row>
                        <Table.Cell>Producer Event Name</Table.Cell>
                        <Table.Cell>
                          {selectedEvent}
                        </Table.Cell>
                      </Table.Row>
                    } position='right center'>
                      <Popup.Content>
                        {currentDetails?.data.description}
                      </Popup.Content>
                    </Popup>

                    <Table.Row>
                      <Table.Cell>Importance</Table.Cell>
                      <Table.Cell>
                        {(() => {
                          let colored = 'grey';
                          switch (currentDetails?.data.importance) {
                            case "critical": colored = 'red'; break;
                            case "major": colored = 'orange'; break;
                            case "minor": colored = 'yellow'; break;
                            case "trivial": colored = 'grey'; break;
                            default: colored = 'black';
                          }
                          return (
                            <Statistic size='mini' color={colored}>
                              <Statistic.Value>{currentDetails?.data.importance}</Statistic.Value>
                            </Statistic>
                          )
                        })()}
                      </Table.Cell>
                    </Table.Row>

                    <Table.Row>
                      <Table.Cell>Primary DC</Table.Cell>
                      <Table.Cell> {currentDetails?.data.primaryDC} </Table.Cell>
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