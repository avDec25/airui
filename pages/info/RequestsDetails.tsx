import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from "next-auth/react";
import { Tab, Grid } from "semantic-ui-react";
import { UserRequestFetcher } from "../../components/requests-details/UserRequestFetcher";

const RequestsDetails: NextPage = () => {
  const session = useSession();

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  const panes = [
    {
      menuItem: {
        key: "UserRequestFetcher",
        content: "User's Request Fetcher",
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
  ];

  return (
    <>
      <Head>
        <title>Requests Details</title>
        <meta name="description" content="User Requests Details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tab menu={{ pointing: false }} panes={panes} />
    </>
  )

}

export default RequestsDetails