import { IntercomTracker } from '../src'

/**
 * Tracker test
 */
describe('IntercomTracker tests', () => {
  it('IntercomTracker should throw if window context invalid', () => {
    expect(() => new IntercomTracker('accountId')).toThrow()
  })
})
