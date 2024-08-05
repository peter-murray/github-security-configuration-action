import * as core from '@actions/core';
import { inspect } from 'util';
import { GitHub } from '../GitHub.js';
import { getRequiredInput } from 'src/util.js';

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
  }

  const github = new GitHub(inputs.token, inputs.apiUrl);
  const matched = await github.getSecurityConfigurationByName(inputs.org, inputs.name);

  if (matched) {
    core.startGroup(`Security Configuration: ${inputs.org}/${inputs.name}`);

    setOutput('id', matched.id);
    setOutput('name', matched.name);
    setOutput('description', matched.description);
    setOutput('configuration', JSON.stringify(matched.configuration));
    setOutput('is_enforced', matched.isEnforced);
    core.endGroup();
  } else {
    core.info(`No security configuration found with name: ${inputs.name} in organization: ${inputs.org}`);
  }
}

function setOutput(name: string, value: string | number | boolean) {
  core.info(`  ${name}: ${value}`);
  core.setOutput(name, `${value}`);
}