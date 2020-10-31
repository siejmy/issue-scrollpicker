import { Issue, validateIssue } from './Issue'
import { Logo, validateLogo } from './Logo'
import { SeeMore, validateSeeMore } from './SeeMore'

export interface Configuration {
  seeMore?: SeeMore
  logo: Logo
  superTitle: string
  downloadButtonText: string
  issues: Issue[]
}

export function validateConfiguration(c: Configuration) {
  validateLogo(c.logo)
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
  if (c.seeMore) {
    validateSeeMore(c.seeMore)
  }
}
