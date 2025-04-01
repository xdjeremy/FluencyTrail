import { render } from '@redwoodjs/testing/web';

import DarkModeToggle from './DarkModeToggle';

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DarkModeToggle', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DarkModeToggle />);
    }).not.toThrow();
  });
});
