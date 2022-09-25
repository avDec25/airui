import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Navbar from '../components/navbar/Navbar'
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function AirUi({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>    
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>        
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

          <Grid columns={1} >
            <Grid.Row>
              
              <Grid.Column>
                <Navbar />
              </Grid.Column>

              <Grid.Column>
                <Component {...pageProps} />
              </Grid.Column>
              
            </Grid.Row>
          </Grid>
          {/* <ReactQueryDevtools initialIsOpen={false}/> */}
        </QueryClientProvider>        
      </SessionProvider>
    </>
  )
}

export default AirUi
