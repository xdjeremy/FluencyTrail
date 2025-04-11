// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const ActivityPage = () => {
  return (
    <>
      <Metadata title="Activity" description="Activity page" />

      <h1>ActivityPage</h1>
      <p>
        Find me in <code>./web/src/pages/ActivityPage/ActivityPage.tsx</code>
      </p>
      {/*
          My default route is named `activity`, link to me with:
          `<Link to={routes.activity()}>Activity</Link>`
      */}
    </>
  )
}

export default ActivityPage
