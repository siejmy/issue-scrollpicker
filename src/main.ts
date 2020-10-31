import { createApp } from 'vue'
import App from './App.vue'
import { Configuration, validateConfiguration } from './domain'

export function mountIssueScrollpicker(tag: string, config: Configuration) {
  validateConfiguration(config)
  createApp(App, { config }).mount(tag)
}

window.mountIssueScrollpicker = mountIssueScrollpicker

declare global {
  interface Window {
    mountIssueScrollpicker: typeof mountIssueScrollpicker
  }
}
