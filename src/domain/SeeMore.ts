export interface SeeMore {
  url: string
  text: string
}

export function validateSeeMore(s: SeeMore) {
  if (typeof s.url !== 'string') {
    throw new TypeError('invalid url')
  }
  if (typeof s.text !== 'string') {
    throw new TypeError('invalid text')
  }
}
