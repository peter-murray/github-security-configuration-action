import { Octokit } from '@octokit/rest';
import { GitHubSecurityConfiguration, GitHubSecurityConfigurationOptions, SecurityConfiguration } from './SecurityConfiguration.js';

export const DEFAULT_SECURITY_CONFIGURATION: GitHubSecurityConfigurationOptions = {
  advanced_security: 'disabled',
  dependency_graph: 'enabled',
  dependabot_alerts: 'disabled',
  dependabot_security_updates: 'disabled',
  code_scanning_default_setup: 'disabled',
  secret_scanning: 'disabled',
  secret_scanning_push_protection: 'disabled',
  secret_scanning_validity_checks: 'disabled',
  private_vulnerability_reporting: 'disabled',
}

export class GitHub {

  private octokit: Octokit;

  private apiUrl: string;

  constructor(token?: string, baseUrl?: string) {
    this.apiUrl = baseUrl || process.env.GITHUB_API_URL || 'https://api.github.com';

    this.octokit = getOctokit(this.apiUrl, token);
  }

  async getAllSecurityConfigurations(org: string): Promise<SecurityConfiguration[]> {
    const response = await this.octokit.request('GET /orgs/{org}/code-security/configurations', {
      org: org,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return response.data.map((config: any) => { return new SecurityConfiguration(config) });
  }

  async getSecurityConfiguration(org: string, id: number): Promise<SecurityConfiguration | undefined> {
    try {
      const response = await this.octokit.request('GET /orgs/{org}/code-security/configurations/{configuration_id}', {
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

    if (configurations.length > 0) {
      return configurations.find((config) => config.name === name);
    }

    return undefined;
  }

  async createSecurityConfiguration(org: string, config: GitHubSecurityConfiguration): Promise<boolean> {
    const result = await this.octokit.request('POST /orgs/{org}/code-security/configurations', {
      org: org,
      ...config,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    return result.status === 201;
  }

  async updateSecurityConfiguration(org: string, id: number, config: GitHubSecurityConfiguration) {
    //TODO
    // 200 updated, 204 no changes made
  }

  getSecurityConfigurationObject(name: string, description: string, config: Partial<GitHubSecurityConfigurationOptions>, enforced: boolean = false): GitHubSecurityConfiguration {
    const mergedConfig: GitHubSecurityConfiguration = {
      ...DEFAULT_SECURITY_CONFIGURATION,
      ...config,
      name: name,
      description: description,
      enforcement: enforced ? 'enforced' : 'unenforced'
    };

    if (this.isMultiTenant()) {
      //@ts-ignore 
      delete mergedConfig?.secret_scanning_validity_checks;
    }

    return mergedConfig;
  }

  private isMultiTenant() {
    return this.apiUrl.indexOf('ghe.com') > -1;
  }
}


function getOctokit(baseUrl: string, token?: string, ): Octokit {
  let octokitToken = token || process.env.GITHUB_TOKEN;
  return new Octokit({ auth: octokitToken, baseUrl: baseUrl });
}