
export type GitHubSecurityFeatureState = 'enabled' | 'disabled' | 'not_set'

export type Enforcement = 'enforced' | 'unenforced';

export type GitHubSecurityConfigurationOptions = {
  advanced_security: GitHubSecurityFeatureState;
  dependency_graph: GitHubSecurityFeatureState;
  dependabot_alerts: GitHubSecurityFeatureState;
  dependabot_security_updates: GitHubSecurityFeatureState;
  code_scanning_default_setup: GitHubSecurityFeatureState;
  secret_scanning: GitHubSecurityFeatureState;
  secret_scanning_push_protection: GitHubSecurityFeatureState;
  secret_scanning_validity_checks: GitHubSecurityFeatureState;
  private_vulnerability_reporting: GitHubSecurityFeatureState;
}

export type GitHubSecurityConfiguration = GitHubSecurityConfigurationOptions & {
  name: string;
  description: string;
  enforcement: Enforcement;
}

export type GitHubSecurityConfigurationData = GitHubSecurityConfiguration & {
  id: number;
  target_type: string
  url: string;
  html_url: string;
  createdAt: string;
  updatedAt: string;
};


export class SecurityConfiguration {

  private config: GitHubSecurityConfigurationData;

  constructor(config: GitHubSecurityConfigurationData) {
    this.config = config;
  }

  get id(): number {
    return this.config.id;
  }

  get name(): string {
    return this.config.name;
  }

  get description(): string {
    return this.config.description;
  }

  get isEnforced(): boolean {
    return this.config.enforcement === 'enforced';
  }

  get configuration(): GitHubSecurityConfigurationOptions {
    return {
      advanced_security: this.config.advanced_security,
      dependency_graph: this.config.dependency_graph,
      dependabot_alerts: this.config.dependabot_alerts,
      dependabot_security_updates: this.config.dependabot_security_updates,
      code_scanning_default_setup: this.config.code_scanning_default_setup,
      secret_scanning: this.config.secret_scanning,
      secret_scanning_push_protection: this.config.secret_scanning_push_protection,
      secret_scanning_validity_checks: this.config.secret_scanning_validity_checks,
      private_vulnerability_reporting: this.config.private_vulnerability_reporting,
    }
  }
}