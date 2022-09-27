import React from 'react'
import { Grid, List, Container, Table, Icon, Label, Statistic } from 'semantic-ui-react'
import { SchemaRenderer } from './SchemaRenderer';

export default function CompleteEventDetailsRenderer({ completeEventDetails }) {
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
        <Grid.Row columns={2}>
          <Grid.Column width={6}>
            <Container>
              <Table celled striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan='2'> Event Summary </Table.HeaderCell>
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
                    <Table.Cell> {
                      data.isBCPCompliant
                        ? <Icon color='green' name='checkmark' size='large' />
                        : <Icon color='red' name='close' size='large' />
                    } </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing> Cluster </Table.Cell>
                    <Table.Cell> {data.clusterName} [{data.clusterId}] </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing> Delayed Queue </Table.Cell>
                    <Table.Cell> {
                      data.isDelayedQueue
                        ? <Icon color='green' name='checkmark' size='large' />
                        : <Icon color='red' name='close' size='large' />
                    } </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell collapsing> Decoupling Priority </Table.Cell>
                    <Table.Cell> <Label horizontal> {data.decouplingPriority} </Label>
                    </Table.Cell>
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

          <Grid.Column width={5}>
            <Container>
              {data.kyc && <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan='2'>Kyc Details</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Event Description</Table.Cell>
                    <Table.Cell> {data.kyc.description} </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Importance</Table.Cell>
                    <Table.Cell>
                      {(() => {
                        let colored = 'grey';
                        switch (data.kyc.importance) {
                          case "critical": colored = 'red'; break;
                          case "major": colored = 'orange'; break;
                          case "minor": colored = 'yellow'; break;
                          case "trivial": colored = 'grey'; break;
                          default: colored = 'black';
                        }
                        return (
                          <Statistic size='mini' color={colored}>
                            <Statistic.Value>{data.kyc.importance}</Statistic.Value>
                          </Statistic>
                        )
                      })()}
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Primary DC</Table.Cell>
                    <Table.Cell> {data.kyc.primaryDC} </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>BRD Load</Table.Cell>
                    <Table.Cell> {data.kyc.brdLoad} </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>BAU Load</Table.Cell>
                    <Table.Cell> {data.kyc.bauLoad} </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Airbus SDK</Table.Cell>
                    <Table.Cell> {data.kyc.sdkLang} </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>SDK Version</Table.Cell>
                    <Table.Cell> {data.kyc.sdkVersion} </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Manager Email</Table.Cell>
                    <Table.Cell> {data.kyc.managerEmail} </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Team</Table.Cell>
                    <Table.Cell> {data.kyc.team} </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Last Updated By</Table.Cell>
                    <Table.Cell> {data.kyc.lastUpdatedBy} </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>}
            </Container>
          </Grid.Column>

        </Grid.Row>
      </Grid>
    </React.Fragment>
  )
}