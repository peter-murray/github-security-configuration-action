import { describe, expect, it } from 'vitest';
import { getSecurityConfigurationObject, GitHub } from './GitHub';
import { isExportDeclaration } from 'typescript';

describe('GitHub', () => {

  const github = new GitHub(getTestToken())

  function getTestToken(): string {
    return process.env.TEST_GITHUB_TOKEN || '';
  }

  describe('#getAllSecurityConfigurations()', () => {

    it('should return an array of security configurations', async () => {
      const result = await github.getAllSecurityConfigurations('octodemo');

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('#getSecurityConfigurationByName()', () => {

    it('should fetch a configuration that exists', async () => {
      const result = await github.getSecurityConfigurationByName('octodemo', 'GitHub Demo -- Default Security COnfiguration');
    });

    it('should return undefined if the configuration does not exist', async () => {
      const result = await github.getSecurityConfigurationByName('octodemo', 'does-not-exist');
      expect(result).toBeUndefined();
    });
  });

  describe('#getSecurityConfigurationObject()', () => {

    it('should return a GitHubSecurityConfiguration object', () => {
      const result = getSecurityConfigurationObject('name', 'description', {});

      expect(result.name).toBe('name');
      expect(result.description).toBe('description');
      expect(result.advanced_security).toBe('disabled');
      expect(result.dependency_graph).toBe('enabled');
    });

    it('should merge settings', () => {
      const result = getSecurityConfigurationObject('name', 'description', { advanced_security: 'enabled' });

      expect(result.name).toBe('name');
      expect(result.description).toBe('description');
      expect(result.advanced_security).toBe('enabled');
      expect(result.dependency_graph).toBe('enabled');
    });
  });
});