// File: pages/_app.jsx
import '../styles/globals.css'
import 'reactflow/dist/style.css'
import { SessionProvider } from 'next-auth/react'
import { useEffect }      from 'react'
import { useRouter }      from 'next/router'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // If Facebook appended '#_=_', remove it without reloading
    if (typeof window !== 'undefined' && window.location.hash === '#_=_') {
      const { pathname, search } = window.location
      history.replaceState(null, document.title, pathname + search)
    }
  }, [router])

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
