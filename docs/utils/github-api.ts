export const getLatestReleaseVersion = async (owner: string, repo: string): Promise<string> => {
  return await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  )
    .then((response) => response.json())
    .then((latestRelease) => {
      if (latestRelease.tag_name) {
        return latestRelease.tag_name.match(/(\d+\.\d+)[\-\.\da-zA-Z]+/)[0] ?? ""
      } else {
        return fetch(
          `https://api.github.com/repos/${owner}/${repo}/tags`
        )
          .then((response) => response.json())
          .then((tags: any[]) => {
            if (tags.length) {
              // get latest tag version
              return tags[0].name.match(/(\d+\.\d+)[\-\.\da-zA-Z]+/)[0] ?? ""
            }
            return ""
          })
      }
    })
};

export const getLatestRelease = async (owner: string, repo: string): Promise<string> => {
  return await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  )
    .then((response) => response.json())
    .then((latestRelease) => {
      if (latestRelease.prerelease === false) {
        return "latest"
      } else {
        return fetch(
          `https://api.github.com/repos/${owner}/${repo}/tags`
        )
          .then((response) => response.json())
          .then((tags: any[]) => {
            if (tags.length) {
              // get prerelease name (e.g. alpha) from the latest tag name
              return tags[0].name.match(/(?<=\.\d-)[^.]+/)[0] ?? ""
            }
            return ""
          })
      }
    })
};