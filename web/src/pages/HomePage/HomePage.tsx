// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web';

import { Button } from 'src/components/ui/button';

const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />

      <h1>HomePage</h1>
      <p>
        Find me in <code>./web/src/pages/HomePage/HomePage.tsx</code>
      </p>
      <Button variant="brand">Hello Worlds</Button>
      {/*
          My default route is named `home`, link to me with:
          `<Link to={routes.home()}>Home</Link>`
      */}
    </>
  );
};

export default HomePage;
