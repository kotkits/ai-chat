// File: components/ReactFacebookLoginButton.jsx

import FacebookLogin from '@greatsumini/react-facebook-login'
import { signIn }    from 'next-auth/react'

export default function ReactFacebookLoginButton() {
  return (
    <FacebookLogin
      appId={process.env.NEXT_PUBLIC_FACEBOOK_ID}
      fields="name,email,picture"
      callback={resp => {
        if (resp.accessToken) {
          signIn('credentials', {
            accessToken: resp.accessToken,
            callbackUrl: '/dashboard'
          })
        } else {
          console.error('Facebook login failed', resp)
        }
      }}
      render={({ onClick }) => (
        <button
          onClick={onClick}
          className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <img src="/fb-logo.svg" alt="" className="w-5 h-5 mr-2" />
          Continue with Facebook
        </button>
      )}
    />
  )
}
