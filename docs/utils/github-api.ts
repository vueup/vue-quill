export const getLatestReleaseVersion = async (owner: string, repo: string): Promise<string> => {
  return await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`
  )
    .then((response) => response.json())
    .then((data) => data.tag_name.replace("v", ""));
};