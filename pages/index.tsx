import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from "next-auth/react"
import { Segment, Container } from 'semantic-ui-react'
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const session = useSession()
  return (
    <>
      <Head>
        <title>AirUi</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />      
      </Head>

      {session && 
      <Container className={styles.welcome}>
        <Segment>
          <h1> Welcome {session.data?.user?.name} to AirUi </h1>
          <h3> More Details at <a href='https://confluence.myntracorp.com/confluence/x/QcoeCw'>Airbus L1 Support</a> </h3>
        </Segment>
      </Container>}
    </>
  );
}

export default Home
