import React from 'react'
import { Grid, Progress, Table } from 'semantic-ui-react';
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
  const kycData = kycDetails?.data?.data

  return (
    <Grid>
      <Grid.Row columns={2}>
        <Grid.Column width={10}>
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
                    <Table.Cell>
                      <SyntaxHighlighter language={"JSON"}
                        lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                        wrapLines={true}
                      >
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
          <Progress active total={kycData.completed + kycData.pending} progress precision={1} color='green' value={kycData.completed} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}