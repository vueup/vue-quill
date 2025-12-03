const SESSION_EXPIRY_IN_SECONDS = 30

interface CachedItem {
  value: string
  expiry: number
}

interface GitHubRelease {
  tag_name?: string
  prerelease?: boolean
}

interface GitHubTag {
  name: string
}

function setWithExpiry(key: string, value: string, ttl: number): void {
  const item: CachedItem = {
    value,
    expiry: Date.now() + ttl * 1000,
  }
  sessionStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key: string): string | null {
  const itemStr = sessionStorage.getItem(key)
  if (!itemStr) return null

  const item: CachedItem = JSON.parse(itemStr)
  if (Date.now() > item.expiry) {
    sessionStorage.removeItem(key)
    return null
  }

  return item.value
}

export async function getLatestReleaseVersion(
  owner: string,
  repo: string
): Promise<string> {
  const cached = getWithExpiry('latestVersion')
  if (cached) return cached

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`
    )
    const release: GitHubRelease = await response.json()

    if (release.tag_name) {
      const match = release.tag_name.match(/(\d+\.\d+)[-.\da-zA-Z]+/)
      const latestVersion = match?.[0] ?? ''
      if (latestVersion) {
        setWithExpiry('latestVersion', latestVersion, SESSION_EXPIRY_IN_SECONDS)
      }
      return latestVersion
    }

    const tagsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/tags`
    )
    const tags: GitHubTag[] = await tagsResponse.json()

    if (tags.length) {
      const match = tags[0].name.match(/(\d+\.\d+)[-.\da-zA-Z]+/)
      const latestVersion = match?.[0] ?? ''
      if (latestVersion) {
        setWithExpiry('latestVersion', latestVersion, SESSION_EXPIRY_IN_SECONDS)
      }
      return latestVersion
    }

    return ''
  } catch {
    return ''
  }
}

export async function getLatestRelease(
  owner: string,
  repo: string
): Promise<string> {
  const cached = getWithExpiry('latestRelease')
  if (cached) return cached

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`
    )
    const release: GitHubRelease = await response.json()

    if (release.prerelease === false) {
      setWithExpiry('latestRelease', 'latest', SESSION_EXPIRY_IN_SECONDS)
      return 'latest'
    }

    const tagsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/tags`
    )
    const tags: GitHubTag[] = await tagsResponse.json()

    if (tags.length) {
      const match = tags[0].name.match(/(?<=\.\d-)[^.]+/)
      const latestRelease = match?.[0] ?? ''
      if (latestRelease) {
        setWithExpiry('latestRelease', latestRelease, SESSION_EXPIRY_IN_SECONDS)
      }
      return latestRelease
    }

    return ''
  } catch {
    return ''
  }
}
