import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from './AuthService';
import { error } from 'console';

const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('AuthService', () => {

  beforeEach(() => {
    fetchMock.mockClear();
  });

  it('should call the correct login endpoint and return data on success', async () => {
    // Arrange
    const mockResponse = { accessToken: 'fake-jwt', refreshToken: 'fake-refresh', expiresIn: 3600 };

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // Act
    const result = await authService.login('test@test.se', 'Password123!');

    // Assert
    expect(result).toEqual(mockResponse);

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:5131/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.se', password: 'Password123!' }),
    });
  });

  it('should throw formatted error when registration fails', async () => {
    // Arrange
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        errors: {
          Password: ['Passwords must have at least one digit.']
        }
      }),
    });

    // Act & Assert
    await expect(authService.register('test@test.se', 'weak'))
      .rejects
      .toThrow('Passwords must have at least one digit.');
  });



  it('should throw an error when login fails', async () => {
    // ARRANGE
    // Vi simulerar att servern säger "401 Unauthorized"
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    });

    // ACT & ASSERT
    // Vi förväntar oss att anropet kastar ett fel
    await expect(authService.login('wrong@email.com', 'badpass'))
      .rejects
      .toThrow('Inloggning misslyckades');
  });
});