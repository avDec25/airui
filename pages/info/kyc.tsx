import type { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from "next-auth/react";

const Kyc: NextPage = () => {
  const session = useSession();
  
  if ( session.status != "authenticated" ) {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  return (
    <div>hello kyc</div>
  )
}

export default Kyc