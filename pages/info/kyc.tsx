import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from "next-auth/react"


const Kyc: NextPage = () => {
  const session = useSession();
  if ( session.status != "authenticated" ) {
    return (<div>cannot continue for an arbitrary client, please sign in first</div>)
  }
  return (
    <div>
      <Head>
        <title>Kyc Page</title>
        <meta name="description" content="Topic level kyc details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <h1> Welcome to Topic Level Kyc </h1>
      </main>
    </div>
  )
}

export default Kyc