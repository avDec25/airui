import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Menu, Icon } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import { UrlObject } from 'url';
import { useSession, signIn, signOut } from "next-auth/react"


export default function Navbar () {
  const [activePage, setActivePage] = useState('home')
  const {data: session} = useSession()
  const router = useRouter();

  return (
      <Menu >
          <Menu.Item
            name='home'
            active={activePage === 'home'}
            onClick={() => {router.push('/'); setActivePage('home')}}
          >
            <Icon name='home' />
            Airbus UI
          </Menu.Item>

          <Menu.Item
            name='Clusters'
            active={activePage === 'clusters'}
            onClick={() => {router.push('/info/clusters'); setActivePage('clusters')}}
          >
            <Icon name='server' />
            Clusters
          </Menu.Item>

          <Menu.Item
            name='KYC'
            active={activePage === 'kyc'}
            onClick={() => {router.push('/info/kyc'); setActivePage('kyc')}}
          >
            <Icon name='address card' />
            KYC
          </Menu.Item>

          <Menu.Menu position='right'>
            <Menu.Item>
            {session ? (
                <Button icon='sign-out' labelPosition='right' content='Sign Out' onClick={() => signOut()}/>
              ) : (
                <Button icon='sign-in' labelPosition='left' content='Sign In' onClick={() => signIn("google")} />
              )}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
  );
}