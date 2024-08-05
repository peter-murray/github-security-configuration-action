import { describe, expect, it } from 'vitest';
import { getSecurityConfigurationObject } from './GitHub';

describe('GitHub', () => {

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
  })

});