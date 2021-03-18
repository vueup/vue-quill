import { request } from '@octokit/request';

export const getLatestReleaseVersion = async (owner: string, repo: string) => {
  const res = await request(`GET /repos/${owner}/${repo}/releases/latest`, {
    owner,
    repo
  })
  // return res.data.tag_name.replace('v', '')
}