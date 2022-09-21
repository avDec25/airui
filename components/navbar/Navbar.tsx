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
        active={router.pathname.includes('home')}
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
        <Icon name='address card' />
        Register
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