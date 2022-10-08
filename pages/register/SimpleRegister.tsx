import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from "next-auth/react";
import { Segment, Tab, Grid } from "semantic-ui-react";
import { SimpleRegisterApplication } from "../../components/register/SimpleRegisterApplication";
import { SimpleRegisterProducer } from "../../components/register/SimpleRegisterProducer";
import { SimpleRegisterConsumer } from "../../components/register/SimpleRegisterConsumer";

const SimpleRegister: NextPage = () => {
  const session = useSession();

  if (session.status != "authenticated") {
    return (<Segment>Cannot continue for an arbitrary client, please sign in first</Segment>)
  }

  const panes = [
    {
      menuItem: {
        key: "Application",
        content: "Application",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <SimpleRegisterApplication />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "Producer",
        content: "Producer",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <SimpleRegisterProducer />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "Consumer",
        content: "Consumer",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <SimpleRegisterConsumer />
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
        <title>Register</title>
        <meta name="description" content="Registeration of non-secured Application, Producer and Consumer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tab menu={{ pointing: false }} panes={panes} />
    </>
  )
}

export default SimpleRegister