import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from "next-auth/react";
import { Tab, Grid } from "semantic-ui-react";
import { UserRequestFetcher } from "../../components/request-details/UserRequestFetcher";

const RequestDetails: NextPage = () => {
  const session = useSession();

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  const panes = [
    {
      menuItem: {
        key: "UsersRequest",
        content: "User's Request",
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
        <title>Request Details</title>
        <meta name="description" content="Panel to Request Details on different items, like user request, producer, consumers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tab menu={{ pointing: false }} panes={panes} />
    </>
  )

}

export default RequestDetails