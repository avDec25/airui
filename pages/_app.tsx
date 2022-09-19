import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Stack from '@mui/material/Stack'
import Navbar from '../components/navbar/Navbar'
import React from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function AirUi({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <>
      <SessionProvider session={session}>
        <ToastContainer 
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Stack>
          <Navbar />
          <Component {...pageProps} />
        </Stack>
      
      </SessionProvider>
    </>
  )
}

export default AirUi
