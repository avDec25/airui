import React from 'react'
import { Grid, Progress, Table, Card, Container, TableBody, TableCell } from 'semantic-ui-react';
import { useQuery } from 'react-query';
import SyntaxHighlighter from 'react-syntax-highlighter';
import axios from 'axios';

const backend_service = process.env.NEXT_PUBLIC_AIRBUS_SERVICE_SUPPORT

function getAllKycDetails() {
  return axios.get(`${backend_service}/kyc/details`)
}

export function KycProgress() {
  const kycDetails = useQuery('all-kyc-details', getAllKycDetails, {
    refetchInterval: 10000
  });
  if (kycDetails.isLoading) {
    return (<>Loading Data...</>);
  }
  const kycData = kycDetails.data.data

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={8}>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Producer Application</Table.HeaderCell>
                <Table.HeaderCell>Produced Event</Table.HeaderCell>
                <Table.HeaderCell>Kyc Record</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {kycData.details.map(item => {
                let jsonKyc = 'No KYC';
                if (item.kyc) {
                  jsonKyc = JSON.parse(item.kyc)
                  jsonKyc = JSON.stringify(jsonKyc, null, 2)
                }
                return (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.appName}</Table.Cell>
                    <Table.Cell>{item.eventName}</Table.Cell>
                    <Table.Cell width={4}>
                      <SyntaxHighlighter language={"JSON"}>
                        {jsonKyc}
                      </SyntaxHighlighter>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Column width={4}>
          <Container>
            <Progress active total={kycData.completed + kycData.pending} progress precision={1} color='green' value={kycData.completed} />
          </Container>

          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={3}>Completed</Table.Cell>
                <Table.Cell positive>{kycData.completed} Records</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell width={3}>Pending</Table.Cell>
                <Table.Cell negative>{kycData.pending} Records</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}