export interface Issue {
  title: string
  coverImageUrl: string
  downloadUrl: string
}

export function validateIssue(i: Issue) {
  if (typeof i.title !== 'string') {
    throw new TypeError('invalid title')
  }
  if (typeof i.coverImageUrl !== 'string') {
    throw new TypeError('invalid coverImageUrl')
  }
  if (typeof i.downloadUrl !== 'string') {
    throw new TypeError('invalid downloadUrl')
  }
}
