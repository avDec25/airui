import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from "next-auth/react";
import { Tab, Grid } from "semantic-ui-react";
import { RequestReplication } from "../../components/replication/RequestReplication";
import { ApproveReplication } from "../../components/replication/ApproveReplication";

const ReplicationPanel: NextPage = () => {
  const session = useSession();

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  const panes = [
    {
      menuItem: {
        key: "RequestReplication",
        content: "Request Replication",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                <RequestReplication />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "ApproveReplication",
        content: "Approve Replication",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                <ApproveReplication />
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
        <title>Replication</title>
        <meta name="description" content="Replication Self Serve" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tab menu={{ pointing: false }} panes={panes} />
    </>
  )
}

export default ReplicationPanel