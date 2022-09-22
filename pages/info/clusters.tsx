import React from 'react'
import { Grid, Table, Label, Button } from 'semantic-ui-react';
import { useQuery } from 'react-query';
import SyntaxHighlighter from 'react-syntax-highlighter';
import axios from 'axios';
import type { NextPage } from 'next'
import Head from 'next/head'

const backend_service = process.env.NEXT_PUBLIC_AIRBUS_SERVICE_SUPPORT

function getClusterDetails() {
  return axios.get(`${backend_service}/info/all/clusters`)
}


const Clusters: NextPage = () => {
  const clusterDetails = useQuery('clsuter-details', getClusterDetails);
  if (clusterDetails.isLoading) {
    return <>Loading Data...</>
  }
  const clusterData = clusterDetails?.data?.data.details

  return (
    <React.Fragment>
      <Head>
        <title>Cluster</title>
        <meta name="description" content="Cluster Details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell collapsing>Status</Table.HeaderCell>
                  <Table.HeaderCell collapsing>Cluster Name</Table.HeaderCell>
                  <Table.HeaderCell collapsing>Cluster Id</Table.HeaderCell>
                  <Table.HeaderCell collapsing>Brokers</Table.HeaderCell>
                  <Table.HeaderCell collapsing>ZooKeepers</Table.HeaderCell>
                  <Table.HeaderCell>Operations</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  clusterData.map(item => {
                    let jsonBKs = 'No Data';
                    let jsonZKs = 'No Data';
                    if (item.bootstrapServers) {
                      jsonBKs = JSON.parse(item.bootstrapServers)
                      jsonBKs = JSON.stringify(jsonBKs, null, 2)
                    }
                    if (item.zookeeperServers) {
                      jsonZKs = JSON.parse(item.zookeeperServers)
                      jsonZKs = JSON.stringify(jsonZKs, null, 2)
                    }
                    return (
                      <Table.Row key={item.id}>
                        <Table.Cell collapsing>
                          {item.isActive
                            ? <Label color={'green'} key={'green'}> active </Label>
                            : <Label color={'grey'} key={'grey'}> disabled </Label>}
                        </Table.Cell>
                        <Table.Cell collapsing>{item.name}</Table.Cell>
                        <Table.Cell collapsing>{item.id}</Table.Cell>
                        <Table.Cell collapsing>
                          <SyntaxHighlighter language={"JSON"}>
                            {jsonBKs}
                          </SyntaxHighlighter>
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <SyntaxHighlighter language={"JSON"}>
                            {jsonZKs}
                          </SyntaxHighlighter>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          {item.isActive
                            ? <Button basic color='red'>Disable</Button>
                            : <Button basic color='green'>Enable</Button>
                          }
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                }
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  )
}

export default Clusters