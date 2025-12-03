import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './AuthService';
import apiClient from './axiosClient';
import { storage } from '../utils/storage';

vi.mock('./axiosClient');

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call the correct login endpoint and return data on success', async () => {
    // Arrange
    const mockResponse = {
      accessToken: 'fake-jwt',
      refreshToken: 'fake-refresh',
      expiresIn: 3600
    };
    (apiClient.post as any).mockResolvedValue({
      data: mockResponse,
    });

    // Act
    const result = await authService.login('test@test.se', 'Password123!');

    // Assert
    expect(result).toEqual(mockResponse);

    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.se',
      password: 'Password123!',
    });
  });

  it('should throw formatted error when registration fails', async () => {
    // Arrange
    const mockError = {
      isAxiosError: true,
      response: {
        data: {
          errors: {
            Password: ['Passwords must have at least one digit.'],
          },
        },
      },
    };

    (apiClient.post as any).mockRejectedValue(mockError);

    // Act & Assert
    await expect(authService.register('test@test.se', 'weak'))
      .rejects
      .toThrow('Passwords must have at least one digit.');
  });

  it('should throw an error when login fails', async () => {
    // Arrange
    const mockError = {
      isAxiosError: true,
      response: {
        status: 401,
        statusText: 'Unauthorized',
        data: { message: 'Inloggning misslyckades' }
      },
    };

    (apiClient.post as any).mockRejectedValue(mockError);

    // Act & Assert
    await expect(authService.login('wrong@email.com', 'badpass')).rejects.toThrow();
  });

  it('should remove tokens from the storage on logout', () => {

    const removeTokenSpy = vi.spyOn(storage, 'removeToken').mockImplementation(() => { });
    const removeRefreshTokenSpy = vi.spyOn(storage, 'removeRefreshToken').mockImplementation(() => { });

    //act
    authService.logout();

    //assert
    expect(removeTokenSpy).toHaveBeenCalled();
    expect(removeRefreshTokenSpy).toHaveBeenCalled();

  });

});