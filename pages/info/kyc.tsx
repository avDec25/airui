import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from "next-auth/react";
import { Tab, Grid } from "semantic-ui-react";
import { UpdateDetails } from "../../components/kyc/UpdateDetails";
import { ViewDetails } from "../../components/kyc/ViewDetails";

const Kyc: NextPage = () => {
  const session = useSession();

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  function callTheAPI() {
    console.log("hello from the API and get results");
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
        key: "ViewDetails",
        content: "View Details",
      },
      render: () => (
        <Tab.Pane attached={false}>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <ViewDetails />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      <Tab menu={{ pointing: false }} panes={panes} />
    </>
  )

}

export default Kyc