/**
 * Shared mock for @/lib/auth-helpers
 * Used by all API route tests to bypass auth checks
 */
export const MOCK_AUTH_USER = {
    id: 'user-001',
    email: 'test@redhope.vn',
    role: 'admin',
};

export const mockGetAuthenticatedUser = jest.fn().mockResolvedValue({
    user: MOCK_AUTH_USER,
    error: null,
});

export const mockRequireRole = jest.fn().mockResolvedValue({
    user: MOCK_AUTH_USER,
    error: null,
});

export function setupAuthMock(overrides?: Partial<typeof MOCK_AUTH_USER>) {
    const user = { ...MOCK_AUTH_USER, ...overrides };
    mockGetAuthenticatedUser.mockResolvedValue({ user, error: null });
    mockRequireRole.mockResolvedValue({ user, error: null });
    return user;
}
    