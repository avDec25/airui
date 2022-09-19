import * as React from 'react';
import { ButtonGroup, Button, Box } from '@mui/material';
import { useRouter } from 'next/router'
import { UrlObject } from 'url';
import { useSession, signIn, signOut } from "next-auth/react"
import styles from '../../styles/Navbar.module.css';

export default function Navbar () {
  const { data: session } = useSession()  
  const router = useRouter();
  const gotoPage = (href: string | UrlObject) => {
    router.push(href);
  }

  return (
    <div className={styles.nav}>
      <div>
        <Button onClick={() => gotoPage("/")}> Home </Button>
        <Button onClick={() => gotoPage("/info/clusters")}> Cluster </Button>
        <Button onClick={() => gotoPage("/info/kyc")}> Kyc </Button>
      </div>
      <ButtonGroup variant="outlined" aria-label="sign in out group">
        {session ? (
          <Button onClick={() => signOut()}> Sign Out </Button>
        ) : (
          <Button onClick={() => signIn("google")}> Sign In </Button>
        )}
      </ButtonGroup>
    </div>
  );
}