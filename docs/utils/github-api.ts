const SESSION_EXPIRY_IN_SECOND = 30

export const getLatestReleaseVersion = async (
  owner: string,
  repo: string
): Promise<string> => {
  if (getWithExpiry('latestVersion')) return getWithExpiry('latestVersion')
  return await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  )
    .then((response) => response.json())
    .then((release) => {
      if (release.tag_name) {
        const latestVersion =
          release.tag_name.match(/(\d+\.\d+)[\-\.\da-zA-Z]+/)[0] ?? ''
        if (latestVersion !== '') {
          setWithExpiry(
            'latestVersion',
            latestVersion,
            SESSION_EXPIRY_IN_SECOND
          )
        }
        return latestVersion
      } else {
        return fetch(`https://api.github.com/repos/${owner}/${repo}/tags`)
          .then((response) => response.json())
          .then((tags: any[]) => {
            if (tags.length) {
              // get latest tag version
              const latestVersion =
                tags[0].name.match(/(\d+\.\d+)[\-\.\da-zA-Z]+/)[0] ?? ''
              if (latestVersion !== '') {
                setWithExpiry(
                  'latestVersion',
                  latestVersion,
                  SESSION_EXPIRY_IN_SECOND
                )
              }
              return latestVersion
            }
            return ''
          })
      }
    })
}

export const getLatestRelease = async (
  owner: string,
  repo: string
): Promise<string> => {
  if (getWithExpiry('latestRelease')) return getWithExpiry('latestRelease')
  return await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  )
    .then((response) => response.json())
    .then((release) => {
      if (release.prerelease === false) {
        const latestRelease = 'latest'
        setWithExpiry('latestRelease', latestRelease, SESSION_EXPIRY_IN_SECOND)
        return latestRelease
      } else {
        return fetch(`https://api.github.com/repos/${owner}/${repo}/tags`)
          .then((response) => response.json())
          .then((tags: any[]) => {
            if (tags.length) {
              // get prerelease name (e.g. alpha) from the latest tag name
              const latestRelease =
                tags[0].name.match(/(?<=\.\d-)[^.]+/)[0] ?? ''
              if (latestRelease !== '') {
                setWithExpiry(
                  'latestRelease',
                  latestRelease,
                  SESSION_EXPIRY_IN_SECOND
                )
              }
              return latestRelease
            }
            return ''
          })
      }
    })
}

function setWithExpiry(key: string, value: string, ttl: number) {
  const now = new Date()

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl * 1000,
  }
  sessionStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key: string) {
  const itemStr = sessionStorage.getItem(key)

  // if the item doesn't exist, return null
  if (!itemStr) {
    return null
  }

  const item = JSON.parse(itemStr)
  const now = new Date()

  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    sessionStorage.removeItem(key)
    return null
  }
  return item.value
}
