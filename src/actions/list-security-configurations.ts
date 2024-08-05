import * as core from '@actions/core';
import { getRequiredInput } from '../action-utils.js';
import { inspect } from 'util';
import { GitHub } from '../GitHub.js';

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
  const org = getRequiredInput('organization');

  const github = new GitHub();
  const data = await github.getAllSecurityConfigurations(org);

  core.startGroup('Security Configurations');
  data.forEach((config) => {
    core.info(`Name: ${config.name}`);
    core.info(`-----------------------------------------------------------------------------`);
    core.info(`  Description:    ${config.description}`);
    core.info(`  Configuration:  ${config.configuration}`);
    core.info(`  Enforced:       ${config.isEnforced}`);
  });
  core.endGroup();
}