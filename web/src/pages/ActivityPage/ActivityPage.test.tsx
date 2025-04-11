import { render } from '@redwoodjs/testing/web'

import ActivityPage from './ActivityPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ActivityPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ActivityPage />)
    }).not.toThrow()
  })
})
