import { Identity, Page, TrackedEvent, Tracker } from 'crosslytics'

export class IntercomTracker implements Tracker {
  /**
   * Direct reference to the Intercom API
   */
  public get intercom(): Intercom {
    return this.w.Intercom
  }

  /**
   * Store window reference since Intercom snippet will overwrite the property
   */
  protected w: Window

  /**
   * Initialize Intercom. Equivalent to pasting Intercom JS single page app snippet into your markup.
   * Note that Intercom does NOT support instantiation of multiple widgets on the same page (window.Intercom
   * will get overwritten), so the behavior when instantiating multiple IntercomTrackers is undefined.
   *
   * @param appId your Intercom App ID
   * @param win the browser window context
   * @see {@link https://developers.intercom.com/docs/single-page-app}
   */
  constructor(public id: string, win = window) {
    ;((w, d, appId, settings: IntercomSettings = {}) => {
      const ic = w.Intercom
      if (typeof ic === 'function') {
        ic('reattach_activator')
        ic('update', settings)
      } else {
        // tslint:disable-next-line:only-arrow-functions
        const i: any = function() {
          i.c(arguments)
        }
        i.q = []
        i.c = (args: any) => {
          i.q.push(args)
        }
        w.Intercom = i
        // No event listener since we're not instantiating on window load
        const s = d.createElement('script')
        s.type = 'text/javascript'
        s.async = true
        s.src = `https://widget.intercom.io/widget/${appId}`
        const x = d.getElementsByTagName('script')[0]
        if (x && x.parentNode) {
          x.parentNode.insertBefore(s, x)
        } else {
          throw Error('Invalid window context: Cannot inject Intercom snippet.')
        }
      }
    })(win, win.document, id)
    this.w = win
    this.w.Intercom('boot', { app_id: id })
  }

  public identify(identity: Identity) {
    const t = identity.traits
    const settings: IntercomSettings = {
      user_id: identity.userId,
      ...identity.traits // keys happen to match up
    }
    if (identity.organization) {
      const org = identity.organization
      const orgT = org.traits
      settings.company = {
        id: org.organizationId,
        ...orgT // keys happen to match up
      }
    }
    this.w.Intercom('update', settings)
  }

  /**
   * Intercom currently does not support manual pageview tracking,
   * so this method is a noop.
   * @param page 
   */
  public async page(page: Page) {
    return
  }

  public async track<T>(event: TrackedEvent<T>) {
    this.w.Intercom('trackEvent', event.name, event.args)
  }
}
