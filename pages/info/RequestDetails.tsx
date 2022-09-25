import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from "next-auth/react";
import { Segment, Tab, Grid } from "semantic-ui-react";
import { UserRequestFetcher } from "../../components/request-details/UserRequestFetcher";
import { ProducerRequestHandler } from "../../components/request-details/ProducerRequestHandler";
import { ConsumerRequestHandler } from "../../components/request-details/ConsumerRequestHandler";

const RequestDetails: NextPage = () => {
  const session = useSession();

  if (session.status != "authenticated") {
    return (<Segment>Cannot continue for an arbitrary client, please sign in first</Segment>)
  }

  const panes = [
    {
      menuItem: {
        key: "UserRequest",
        content: "User Request",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid columns={1}>
            <Grid.Row columns={1}>
              <Grid.Column>
                <UserRequestFetcher />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "ProducerRequest",
        content: "Producer Request",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid columns={1}>
            <Grid.Row columns={1}>
              <Grid.Column>
                <ProducerRequestHandler />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "ConsumerRequest",
        content: "Consumer Request",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid columns={1}>
            <Grid.Row columns={1}>
              <Grid.Column>
                <ConsumerRequestHandler />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Request Details</title>
        <meta name="description" content="Panel to Request Details on different items, like user request, producer, consumers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tab menu={{ pointing: false }} panes={panes} />
    </>
  )

}

export default RequestDetails