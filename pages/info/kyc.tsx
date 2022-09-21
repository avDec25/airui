import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from "next-auth/react";
import { Tab, Grid } from "semantic-ui-react";
import { UpdateDetails } from "../../components/kyc/UpdateDetails";
import { KycProgress } from "../../components/kyc/KycProgress";

const Kyc: NextPage = () => {
  const session = useSession();

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  const panes = [
    {
      menuItem: {
        key: "UpdateDetails",
        content: "Update Details",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <UpdateDetails />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: {
        key: "KycProgress",
        content: "Kyc Progress",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <KycProgress />
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
        <title>KYC</title>
        <meta name="description" content="Producer KYC" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tab menu={{ pointing: false }} panes={panes} />
    </>
  )

}

export default Kyc