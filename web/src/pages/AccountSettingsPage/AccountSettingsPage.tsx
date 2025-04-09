// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const AccountSettingsPage = () => {
  return (
    <>
      <Metadata title="AccountSettings" description="AccountSettings page" />

      <h1>AccountSettingsPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/AccountSettingsPage/AccountSettingsPage.tsx</code>
      </p>
      {/*
          My default route is named `accountSettings`, link to me with:
          `<Link to={routes.accountSettings()}>AccountSettings</Link>`
      */}
    </>
  )
}

export default AccountSettingsPage
