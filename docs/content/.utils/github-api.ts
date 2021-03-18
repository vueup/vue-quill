
import { Octokit } from '@octokit/core';

export const getLatestReleaseVersion = async (owner: string, repo: string) => {
  const octokit = new Octokit();
  const res = await octokit.request(`GET /repos/${owner}/${repo}/releases/latest`, {
    owner,
    repo
  })
  return res.data.tag_name.replace('v', '')
}