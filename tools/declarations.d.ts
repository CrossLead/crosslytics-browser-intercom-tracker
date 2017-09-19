// Based off of https://github.com/esperco/intercom-typings/blob/master/index.d.ts
// TODO: PR to DefinitelyTyped
interface IntercomSettings {
  app_id?: string,  
  email?: string,
  created_at?: number,
  name?:  string,
  user_id?: string,
  user_hash?: string,
  widget?: {
    activator?: string;
  },
  company?: {
    id: string|number,
    name?: string,
    created_at?: number,
    plan?: string,
    monthly_spend?: number,
    [index: string]: any;
  },
  [index: string]: any
}

type IntercomCommand =
  |'boot'
  |'shutdown'
  |'update'
  |'hide'
  |'show'
  |'showMessages'
  |'showNewMessage'
  |'onHide'
  |'onShow'
  |'onActivatorClick'
  |'trackEvent'
  |'reattach_activator' // private cmd from init snippet
  ;

interface Intercom {
  (command: 'boot', param: IntercomSettings): void;
  (command: 'shutdown'): void;
  (command: 'update', param?: IntercomSettings): void;
  (command: 'hide'): void;
  (command: 'show'): void;
  (command: 'showMessages'): void;
  (command: 'showNewMessage', param?: string): void;
  (command: 'onHide', param?: () => void): void;
  (command: 'onShow', param?: () => void): void;
  (command: 'onActivatorClick', param?: () => void): void;
  (command: 'trackEvent', tag?: string, metadata?: any): void;
  (command: 'reattach_activator'): void;
}

interface Window {
  Intercom: Intercom
}