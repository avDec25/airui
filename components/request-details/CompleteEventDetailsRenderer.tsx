import React from 'react'
import { Grid, Item, Segment, List, Label, Container, Table } from 'semantic-ui-react'
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import axios from "axios";
import SyntaxHighlighter from 'react-syntax-highlighter';
import styles from '../../styles/UserRequestFetcher.module.css';
import { SchemaRenderer } from './SchemaRenderer';

export function CompleteEventDetailsRenderer({ completeEventDetails }) {
  // const [data, setData] = useState(completeEventDetails);
  let data = completeEventDetails;


  if (data == null || data == undefined) {
    return <></>;
  }
  console.log("after");
  console.log(data);
  console.log("after");

  return (
    <React.Fragment>
      <Grid>
        <Grid.Row columns={1}>
          <Grid.Column width={5}>
            <Container>
              <Table celled striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan='2'> Topic Summary </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>

                  <Table.Row>
                    <Table.Cell collapsing> Producer App Name </Table.Cell>
                    <Table.Cell> {data.producerAppName} [{data.producerAppId}] </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing> Event Name </Table.Cell>
                    <Table.Cell> {data.eventName} [{data.eventId}] </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing> Status </Table.Cell>
                    <Table.Cell> {data.status} </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing> Is BCP Compliant </Table.Cell>
                    <Table.Cell> {data.isBCPCompliant} </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing> Cluster </Table.Cell>
                    <Table.Cell> {data.clusterName} [{data.clusterId}] </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing> Delayed Queue </Table.Cell>
                    <Table.Cell> {data.isDelayedQueue}  </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing> Decoupling Priority </Table.Cell>
                    <Table.Cell> {data.decouplingPriority}  </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing> Consumers </Table.Cell>
                    <Table.Cell>
                      <List>
                        {data.consumingApps.map((item: string) => {
                          console.log(item);
                          return (<List.Item key={item}>{item}</List.Item>)
                        })}
                      </List>
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing> Schema </Table.Cell>
                    <Table.Cell> <SchemaRenderer schemaId={data.schemaId} schemaType={data.schemaType} currentSchema={data.currentSchema} /> </Table.Cell>
                  </Table.Row>

                </Table.Body>
              </Table>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  )
}