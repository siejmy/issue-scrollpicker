export interface Logo {
  imageUrl: string
  linkUrl: string
  imageAlt: string
}

export function validateLogo(l: Logo) {
  if (typeof l.imageUrl !== 'string') {
    throw new TypeError('invalid imageUrl')
  }
  if (typeof l.linkUrl !== 'string') {
    throw new TypeError('invalid linkUrl')
  }
  if (typeof l.imageAlt !== 'string') {
    throw new TypeError('invalid imageAlt')
  }
}
