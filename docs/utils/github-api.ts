export const getLatestReleaseVersion = async (owner: string, repo: string): Promise<string> => {
  return await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.tag_name) {
        return data.tag_name.replace("v", "")
      } else {
        return fetch(
          `https://api.github.com/repos/${owner}/${repo}/tags`
        )
          .then((response) => response.json())
          .then((data) => {
            try {
              return data[0].name.replace("v", "")
            } catch {
              return "latest"
            }
          })
      }
    })
};