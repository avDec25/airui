import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from "next-auth/react";
import { Grid, Tab } from "semantic-ui-react";
import  { SinglePartitionTransfer }  from "../../components/kafkaruns/SinglePartitionTransfer";

const Partitions: NextPage = () => {
  const session = useSession();

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  const panes = [
    {
      menuItem: {
        key: "PartitionTransfer",
        content: "Partition Transfer",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <SinglePartitionTransfer />
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
        <title>Partitions</title>
        <meta name="description" content="Utility which alters partitions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tab menu={{ pointing: false }} panes={panes} />
    </>
  )
}

export default Partitions