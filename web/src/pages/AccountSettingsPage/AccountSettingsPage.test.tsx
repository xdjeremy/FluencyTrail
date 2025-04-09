import { render } from '@redwoodjs/testing/web'

import AccountSettingsPage from './AccountSettingsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AccountSettingsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AccountSettingsPage />)
    }).not.toThrow()
  })
})
