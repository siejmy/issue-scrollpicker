import { Issue, validateIssue } from './Issue'

export interface Configuration {
  logoImageUrl: string
  logoLinkUrl: string
  superTitle: string
  downloadButtonText: string
  issues: Issue[]
}

export function validateConfiguration(c: Configuration) {
  if (typeof c.logoImageUrl !== 'string') {
    throw new TypeError('invalid logoImageUrl')
  }
  if (typeof c.logoLinkUrl !== 'string') {
    throw new TypeError('invalid logoLinkUrl')
  }
  if (typeof c.superTitle !== 'string') {
    throw new TypeError('invalid superTitle')
  }
  if (typeof c.downloadButtonText !== 'string') {
    throw new TypeError('invalid downloadButtonText')
  }
  if (!c.issues) {
    throw new TypeError('invalid issues')
  }
  c.issues.forEach(validateIssue)
}
