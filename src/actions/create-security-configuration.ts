import * as core from '@actions/core';
import { getSecurityConfigurationObject, GitHub } from 'src/GitHub.js';
import { GitHubSecurityConfigurationOptions } from 'src/SecurityConfiguration.js';
import { getRequiredInput } from '../action-utils.js';
import { inspect } from 'util';

async function run() {
  try {
    await exec();
  } catch (err: any) {
    core.debug(inspect(err))
    core.setFailed(err);
  }
}
run();


async function exec() {
  const inputs = {
    token: getRequiredInput('github_token'),
    apiUrl: getRequiredInput('github_api_url'),
    org: getRequiredInput('organization'),
    name: getRequiredInput('name'),
    description: getRequiredInput('description'),
    configuration: getRequiredInput('configuration'),
  };

  let parsedConfig: GitHubSecurityConfigurationOptions;
  try {
    //TODO use VineJS for this
    parsedConfig = JSON.parse(inputs.configuration);
  } catch (err: any) {
    core.error(err);
    core.setFailed(`The provided configuration was not valid JSON, ${err.message}`);
    return;
  }

  const github = new GitHub(inputs.token, inputs.apiUrl);

  const existing = await github.getSecurityConfigurationByName(inputs.org, inputs.name);
  if (existing) {
    core.setFailed(`An existing security group exists with the name: ${inputs.name} in organization: ${inputs.org}`);
    return;
  }

  const configuration = getSecurityConfigurationObject(inputs.name, inputs.description, parsedConfig);
  await github.createSecurityConfiguration(inputs.org, configuration);
}