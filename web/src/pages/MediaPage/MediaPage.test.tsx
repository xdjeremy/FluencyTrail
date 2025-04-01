import { render } from '@redwoodjs/testing/web';

import MediaPage from './MediaPage';

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MediaPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MediaPage />);
    }).not.toThrow();
  });
});
