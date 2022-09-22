import React from 'react'
import { Grid, Form, Segment, List, Label, Container, Table } from 'semantic-ui-react'
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useMutation } from 'react-query';
import SyntaxHighlighter from 'react-syntax-highlighter';
import styles from '../../styles/UserRequestFetcher.module.css';

const backend_service = process.env.NEXT_PUBLIC_AIRBUS_SERVICE_SUPPORT

const requestDetails = (formData: { [key: string]: string }) => {
  const promise = axios.post(`${backend_service}/user-request-detail/list`, formData)
  toast.promise(
    promise,
    {
      pending: 'Requesting Details on User Requests',
      success: {
        render({ data }) {
          if (data?.data.details.length > 0) {
            return "Found " + data?.data.details.length + " requests";
          } else {
            return "No Requests found"
          }
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


export function UserRequestFetcher() {
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const mutation = useMutation(requestDetails);
  const [userRequestsData, setUserRequestsData] = useState({ details: [] });

  const [formData, setFormData] = useState({
    "requesterEmail": userEmail,
    "requesterTeamEmail": ""
  });

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  const handleFormChange = (event: object, item: { [key: string]: any }) => {
    formData[item.id] = item.value
    setFormData(formData)
  }

  const validateAndSubmitRequest = () => {
    mutation.mutate(formData, {
      onSuccess: (data, variables, context) => {
        setUserRequestsData(data.data);
      }
    });
  }

  return (
    <React.Fragment>

      <Form>
        <Form.Group widths='equal'>
          <Form.Input id="requesterEmail" fluid type='email' label='POC Email' placeholder='Point Of Contact Email' onChange={handleFormChange} />
          <Form.Input id="requesterTeamEmail" fluid type='email' label='Team Email' placeholder='Team Email or Manager Email' onChange={handleFormChange} />
        </Form.Group>

        <Form.Button onClick={validateAndSubmitRequest}>Search</Form.Button>
      </Form>

      {userRequestsData?.details.length > 0 &&
        <Grid columns={3}>
          <Grid.Row></Grid.Row>
          <Grid.Row className={styles.headerRow}>
            <Grid.Column width={3}>Creation</Grid.Column>
            <Grid.Column width={7}>Response to User Request</Grid.Column>
            <Grid.Column width={6}>Request Payload</Grid.Column>
          </Grid.Row>

          {userRequestsData?.details?.map(
            (detail) => {
              let requestColor = 'grey';
              if (detail.request_type == 'enable-topic-replication') {
                requestColor = 'blue';
              } else if (detail.request_type == 'create-topic') {
                requestColor = 'teal';
              } else if (detail.request_type == 'onboard-application') {
                requestColor = 'green';
              } else if (detail.request_type == 'authorize-application') {
                requestColor = 'pink';
              }

              return (
                <>
                  <Grid.Row>
                    <Grid.Column width={3} className={styles.pre}>
                      <Segment>
                        <List>
                          <List.Item>{detail.created_on}</List.Item>
                          <List.Item>{detail.created_by.replaceAll("@myntra.com", "")}</List.Item>
                          <List.Item><Label color={requestColor}>{detail.request_type}</Label></List.Item>
                        </List>
                      </Segment>
                    </Grid.Column>

                    <Grid.Column width={7}>
                      <SyntaxHighlighter>
                        {detail?.response?.responses[0] ? detail.response.responses[0] : "No Response Yet"}
                      </SyntaxHighlighter>
                    </Grid.Column>

                    <Grid.Column width={6}>
                      <SyntaxHighlighter language={"JSON"}>
                        {JSON.stringify(detail.request_payload, null, 2)}
                      </SyntaxHighlighter>
                    </Grid.Column>
                  </Grid.Row>
                </>
              );
            }
          )}

        </Grid>}
    </React.Fragment>
  )
}