import * as React from 'react';
import { useState } from 'react';
import { Button, Menu, Icon } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import { UrlObject } from 'url';
import { useSession, signIn, signOut } from "next-auth/react"


export default function Navbar () {
  const [activePage, setActivePage] = useState('home')
  const {data: session} = useSession()
  const router = useRouter();
  const gotoPage = (href: string | UrlObject, activate: string) => {
    setActivePage(activate)
    router.push(href);
  }
  

  return (
      <Menu size='mini'>
          <Menu.Item
            name='Home'
            active={activePage === 'home'}
            onClick={() => gotoPage("/", 'home')}
          >
            <Icon name='home' />
            Home
          </Menu.Item>

          <Menu.Item
            name='Clusters'
            active={activePage === 'clusters'}
            onClick={() => gotoPage("/info/clusters", 'clusters')}
          >
            <Icon name='server' />
            Clusters
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