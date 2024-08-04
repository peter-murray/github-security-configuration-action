import { Octokit } from '@octokit/rest';
import { SecurityConfiguration } from './SecurityConfiguration.js';


export class GitHub {

  private octokit: Octokit;

  constructor() {
    this.octokit = getOctokit();
  }


  async getAllSecurityConfigurations(org: string): Promise<SecurityConfiguration[]> {
    const response = await this.octokit.request('GET /orgs/{org}/security/configurations', {
      org: org,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data.map((config: any) => { new SecurityConfiguration(config) });
  }

  async getSecurityConfiguration(org: string, id: number): Promise<SecurityConfiguration | undefined> {
    try {
      const response = await this.octokit.request('GET /orgs/{org}/security/configurations/{configuration_id}', {
        org: org,
        configuration_id: id,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      return new SecurityConfiguration(response.data);
    } catch (err: any) {
      if (err.status !== 404) {
        throw err;
      }
      return undefined;
    }
  }

  async getSecurityConfigurationByName(org: string, name: string): Promise<SecurityConfiguration | undefined> {
    const configurations = await this.getAllSecurityConfigurations(org);
    return configurations.find((config) => config.name === name);
  }

  async createSecurityConfiguration(org: string, config: SecurityConfiguration): Promise<boolean> {
    const result = await this.octokit.request('POST /orgs/{org}/security/configurations', {
      org: org,
      ...config,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return result.status === 201;
  }

  async updateSecurityConfiguration(org: string, id: number, config: SecurityConfiguration) {
    //TODO
    // 200 updated, 204 no changes made
  }
}


function getOctokit(token?: string, baseUrl?: string): Octokit {
  let octokitToken = token || process.env.GITHUB_TOKEN;
  let resolvedUrl = baseUrl || process.env.GITHUB_API_URL || 'https://api.github.com';
  return new Octokit({ auth: octokitToken, baseUrl: resolvedUrl });
}