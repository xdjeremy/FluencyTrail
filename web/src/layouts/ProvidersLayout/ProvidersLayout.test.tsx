import { render } from '@redwoodjs/testing/web'

import ProvidersLayout from './ProvidersLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ProvidersLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProvidersLayout />)
    }).not.toThrow()
  })
})
