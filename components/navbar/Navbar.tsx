import React from 'react';
import { Button, Menu, Icon } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from "next-auth/react"


export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter();

  return (
    <Menu>
      <Menu.Item
        name='home'
        onClick={() => { router.push('/') }}
      >
        <Icon name='home' />
        Air UI
      </Menu.Item>

      <Menu.Item
        name='Clusters'
        active={router.pathname.includes('clusters')}
        onClick={() => { router.push('/info/clusters') }}
      >
        <Icon name='server' />
        Clusters
      </Menu.Item>

      <Menu.Item
        name='KYC'
        active={router.pathname.includes('kyc')}
        onClick={() => { router.push('/info/kyc') }}
      >
        <Icon name='address card' />
        KYC
      </Menu.Item>

      <Menu.Item
        name='Register'
        active={router.pathname.includes('register')}
        onClick={() => { router.push('/register/SimpleRegister') }}
      >
        <Icon name='signup' />
        Register
      </Menu.Item>

      <Menu.Item
        name='Secured'
        active={router.pathname.includes('secured')}
        onClick={() => { router.push('/secured/SecuredPanel') }}
      >
        <Icon name='shield' />
        Secured
      </Menu.Item>

      <Menu.Item
        name='Replication'
        active={router.pathname.includes('replication')}
        onClick={() => { router.push('/replication/ReplicationPanel') }}
      >
        <Icon name='copy' />
        Replication
      </Menu.Item>

      <Menu.Item
        name='RequestDetails'
        active={router.pathname.includes('info/RequestDetails')}
        onClick={() => { router.push('/info/RequestDetails') }}
      >
        <Icon name='tasks' />
        Request Details
      </Menu.Item>

      <Menu.Item
        name='KafkaRuns'
        active={router.pathname.includes('kafkaruns')}
        onClick={() => { router.push('/kafkaruns/Partitions') }}
      >
        <Icon name='wrench' />
        KafkaRuns
      </Menu.Item>

      <Menu.Menu position='right'>
        <Menu.Item>
          {session ? (
            <Button icon='sign-out' labelPosition='right' content='Sign Out' onClick={() => signOut()} />
          ) : (
            <Button icon='sign-in' labelPosition='left' content='Sign In' onClick={() => signIn("google")} />
          )}
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}