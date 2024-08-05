import * as core from '@actions/core';

export function getRequiredInput(name: string): string {
  return core.getInput(name, {required: true});
}