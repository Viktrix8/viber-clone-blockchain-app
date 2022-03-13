import { ViberProvider } from '../context/ViberContext'
import type { AppProps } from 'next/app'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ViberProvider>
      <Component {...pageProps} />
    </ViberProvider>
  )
}

export default MyApp
