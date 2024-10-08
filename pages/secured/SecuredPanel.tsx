import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from "next-auth/react";
import { Grid, Tab, Segment } from "semantic-ui-react";
import { AuthorizeApp } from "../../components/secured/AuthorizeApp";
import { OnBoardApplication } from "../../components/secured/OnBoardApplication";
import { SecureTopic } from "../../components/secured/SecureTopic";

const SecuredPanel: NextPage = () => {
  const session = useSession();

  if (session.status != "authenticated") {
    return (<Segment>Cannot continue for an arbitrary client, please sign in first</Segment>)
  }

  const panes = [
    {
      menuItem: {
        key: "OnBoard",
        icon: "handshake outline",
        content: "1. OnBoard Application",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                <OnBoardApplication />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "TopicSecured",
        icon: "lock",
        content: "2. Secure Topic",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                <SecureTopic />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "AuthorizeApplication",
        icon: "shield",
        content: "3. Authorize Application",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                <AuthorizeApp />
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
        <title>Secured</title>
        <meta name="description" content="Registeration of user principals, topics, and acl generation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tab menu={{ pointing: false }} panes={panes} />
    </>
  )
}

export default SecuredPanel