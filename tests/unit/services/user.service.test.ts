import { userService } from '@/services/user.service';
import { supabase } from '@/lib/supabase';

// Mock supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn(),
        rpc: jest.fn(),
        storage: {
            from: jest.fn(),
        },
    },
}));

describe('userService', () => {
    let mockSupabaseQuery: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSupabaseQuery = {
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            upsert: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            or: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnThis(),
            maybeSingle: jest.fn().mockReturnThis(),
        };
        (supabase.from as jest.Mock).mockReturnValue(mockSupabaseQuery);
    });

    describe('getAll', () => {
        test('should return all users ordered by created_at', async () => {
            const mockUsers = [
                { id: '1', full_name: 'User 1', role: 'donor' },
                { id: '2', full_name: 'User 2', role: 'hospital' },
            ];

            mockSupabaseQuery.order.mockResolvedValue({ data: mockUsers, error: null });

            const result = await userService.getAll();

            expect(supabase.from).toHaveBeenCalledWith('users');
            expect(mockSupabaseQuery.select).toHaveBeenCalledWith('*');
            expect(mockSupabaseQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
            expect(result).toEqual(mockUsers);
        });

        test('should throw error on database error', async () => {
            const dbError = { message: 'Database error' };
            mockSupabaseQuery.order.mockResolvedValue({ data: null, error: dbError });

            await expect(userService.getAll()).rejects.toEqual(dbError);
        });
    });

    describe('getDonors', () => {
        test('should return only users with role donor', async () => {
            const mockDonors = [
                { id: '1', full_name: 'Donor 1', role: 'donor' },
                { id: '2', full_name: 'Donor 2', role: 'donor' },
            ];

            mockSupabaseQuery.order.mockResolvedValue({ data: mockDonors, error: null });

            const result = await userService.getDonors();

            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('role', 'donor');
            expect(result).toEqual(mockDonors);
        });
    });

    describe('getCount', () => {
        test('should return count of donors', async () => {
            mockSupabaseQuery.eq.mockResolvedValue({ count: 42, error: null });

            const result = await userService.getCount();

            expect(mockSupabaseQuery.select).toHaveBeenCalledWith('*', { count: 'exact', head: true });
            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('role', 'donor');
            expect(result).toBe(42);
        });

        test('should return 0 when count is null', async () => {
            mockSupabaseQuery.eq.mockResolvedValue({ count: null, error: null });

            const result = await userService.getCount();
            expect(result).toBe(0);
        });
    });

    describe('getRecent', () => {
        test('should return recent users with default limit', async () => {
            const mockUsers = [{ id: '1' }, { id: '2' }];
            mockSupabaseQuery.limit.mockResolvedValue({ data: mockUsers, error: null });

            const result = await userService.getRecent();

            expect(mockSupabaseQuery.limit).toHaveBeenCalledWith(5);
            expect(result).toEqual(mockUsers);
        });

        test('should return recent users with custom limit', async () => {
            const mockUsers = [{ id: '1' }];
            mockSupabaseQuery.limit.mockResolvedValue({ data: mockUsers, error: null });

            const result = await userService.getRecent(1);

            expect(mockSupabaseQuery.limit).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockUsers);
        });
    });

    describe('getById', () => {
        test('should return user when found', async () => {
            const mockUser = { id: 'user-1', full_name: 'Test User' };
            mockSupabaseQuery.maybeSingle.mockResolvedValue({ data: mockUser, error: null });

            const result = await userService.getById('user-1');

            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('id', 'user-1');
            expect(result).toEqual(mockUser);
        });

        test('should return null when user not found', async () => {
            mockSupabaseQuery.maybeSingle.mockResolvedValue({
                data: null,
                error: null,
            });

            const result = await userService.getById('non-existent');

            expect(result).toBeNull();
        });
    });

    describe('getByEmail', () => {
        test('should return user when found', async () => {
            const mockUser = { id: 'user-1', email: 'test@example.com' };
            mockSupabaseQuery.maybeSingle.mockResolvedValue({ data: mockUser, error: null });

            const result = await userService.getByEmail('test@example.com');

            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('email', 'test@example.com');
            expect(result).toEqual(mockUser);
        });

        test('should return null when email not found', async () => {
            mockSupabaseQuery.maybeSingle.mockResolvedValue({ data: null, error: null });

            const result = await userService.getByEmail('notfound@example.com');

            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        test('should create user and return it', async () => {
            const newUser = { full_name: 'New User', email: 'new@test.com', role: 'donor' };
            const createdUser = { id: 'new-id', ...newUser };

            mockSupabaseQuery.single.mockResolvedValue({ data: createdUser, error: null });

            const result = await userService.create(newUser as any);

            expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(newUser);
            expect(result).toEqual(createdUser);
        });

        test('should throw error on creation failure', async () => {
            const dbError = { message: 'Duplicate email' };
            mockSupabaseQuery.single.mockResolvedValue({ data: null, error: dbError });

            await expect(userService.create({} as any)).rejects.toEqual(dbError);
        });
    });

    describe('update', () => {
        test('should update user and return updated data', async () => {
            const updates = { full_name: 'Updated Name' };
            const updatedUser = { id: 'user-1', full_name: 'Updated Name' };

            mockSupabaseQuery.maybeSingle.mockResolvedValue({ data: updatedUser, error: null });

            const result = await userService.update('user-1', updates as any);

            expect(mockSupabaseQuery.update).toHaveBeenCalledWith(updates);
            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('id', 'user-1');
            expect(result).toEqual(updatedUser);
        });

        test('should throw error when user not found', async () => {
            mockSupabaseQuery.maybeSingle.mockResolvedValue({ data: null, error: null });

            await expect(userService.update('invalid', {} as any)).rejects.toThrow('User record not found to update.');
        });
    });

    describe('upsert', () => {
        test('should upsert user', async () => {
            const userData = { full_name: 'Upserted User' };
            const result = { id: 'user-1', ...userData };

            mockSupabaseQuery.maybeSingle.mockResolvedValue({ data: result, error: null });

            const upserted = await userService.upsert('user-1', userData as any);

            expect(mockSupabaseQuery.upsert).toHaveBeenCalledWith(
                { ...userData, id: 'user-1' },
                { onConflict: 'id' }
            );
            expect(upserted).toEqual(result);
        });
    });

    describe('delete', () => {
        let globalFetch: typeof fetch;

        beforeEach(() => {
            // Save original fetch
            globalFetch = global.fetch;
            // Mock fetch
            global.fetch = jest.fn();
        });

        afterEach(() => {
            // Restore original fetch
            global.fetch = globalFetch;
        });

        test('should delete user without error', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true })
            });

            await expect(userService.delete('user-1')).resolves.not.toThrow();
            expect(global.fetch).toHaveBeenCalledWith('/api/manage-users/user-1', {
                method: 'DELETE',
            });
        });

        test('should throw error on deletion failure', async () => {
            const dbError = { error: 'Cannot delete' };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: 'Internal Server Error',
                json: async () => dbError
            });

            await expect(userService.delete('user-1')).rejects.toThrow('Cannot delete');
        });
    });

    describe('getByBloodGroup', () => {
        test('should return users with matching blood group', async () => {
            const mockUsers = [
                { id: '1', blood_group: 'O+' },
                { id: '2', blood_group: 'O+' },
            ];
            mockSupabaseQuery.order.mockResolvedValue({ data: mockUsers, error: null });

            const result = await userService.getByBloodGroup('O+');

            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('blood_group', 'O+');
            expect(result).toEqual(mockUsers);
        });
    });

    describe('getByCity', () => {
        test('should return users in the city', async () => {
            const mockUsers = [{ id: '1', city: 'Hà Nội' }];
            mockSupabaseQuery.order.mockResolvedValue({ data: mockUsers, error: null });

            const result = await userService.getByCity('Hà Nội');

            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('city', 'Hà Nội');
            expect(result).toEqual(mockUsers);
        });
    });

    describe('search', () => {
        test('should return users matching query', async () => {
            const mockUsers = [{ id: '1', full_name: 'John Doe' }];
            mockSupabaseQuery.order.mockResolvedValue({ data: mockUsers, error: null });

            const result = await userService.search('John');

            expect(mockSupabaseQuery.or).toHaveBeenCalledWith(
                'full_name.ilike.%John%,email.ilike.%John%'
            );
            expect(result).toEqual(mockUsers);
        });

        test('should return empty array for empty query', async () => {
            const result = await userService.search('');
            expect(result).toEqual([]);
        });

        test('should sanitize query and return empty for special chars only', async () => {
            const result = await userService.search('%%%');
            expect(result).toEqual([]);
        });
    });

    describe('searchDonors', () => {
        test('should return only donors matching query', async () => {
            const mockDonors = [{ id: '1', full_name: 'Jane', role: 'donor' }];
            mockSupabaseQuery.order.mockResolvedValue({ data: mockDonors, error: null });

            const result = await userService.searchDonors('Jane');

            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('role', 'donor');
            expect(mockSupabaseQuery.or).toHaveBeenCalledWith(
                'full_name.ilike.%Jane%,email.ilike.%Jane%'
            );
            expect(result).toEqual(mockDonors);
        });

        test('should return empty array for empty query', async () => {
            const result = await userService.searchDonors('');
            expect(result).toEqual([]);
        });
    });

    describe('addPoints', () => {
        test('should call RPC and return updated user', async () => {
            (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: null });

            const updatedUser = { id: 'user-1', current_points: 200 };
            mockSupabaseQuery.maybeSingle.mockResolvedValue({ data: updatedUser, error: null });

            const result = await userService.addPoints('user-1', 100);

            expect(supabase.rpc).toHaveBeenCalledWith('increment_points', {
                row_id: 'user-1',
                count: 100,
            });
            expect(result).toEqual(updatedUser);
        });

        test('should throw error when RPC fails', async () => {
            const rpcError = { message: 'RPC Failed' };
            (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: rpcError });

            await expect(userService.addPoints('user-1', 100)).rejects.toEqual(rpcError);
        });
    });

    describe('uploadImage', () => {
        test('should upload image and return public URL', async () => {
            const mockFile = new File(['test'], 'avatar.png', { type: 'image/png' });
            const mockPublicUrl = 'https://storage.example.com/avatars/123.png';

            const mockStorage = {
                upload: jest.fn().mockResolvedValue({ error: null }),
                getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: mockPublicUrl } }),
            };
            (supabase.storage.from as jest.Mock).mockReturnValue(mockStorage);

            const result = await userService.uploadImage(mockFile, 'avatars');

            expect(supabase.storage.from).toHaveBeenCalledWith('avatars');
            expect(mockStorage.upload).toHaveBeenCalled();
            expect(result).toBe(mockPublicUrl);
        });

        test('should throw error on upload failure', async () => {
            const mockFile = new File(['test'], 'avatar.png', { type: 'image/png' });
            const uploadError = { message: 'Upload failed' };

            const mockStorage = {
                upload: jest.fn().mockResolvedValue({ error: uploadError }),
            };
            (supabase.storage.from as jest.Mock).mockReturnValue(mockStorage);

            await expect(userService.uploadImage(mockFile)).rejects.toEqual(uploadError);
        });
    });

    describe('uploadAvatar', () => {
        test('should call uploadImage with avatars folder', async () => {
            const mockFile = new File(['test'], 'avatar.png', { type: 'image/png' });
            const mockPublicUrl = 'https://storage.example.com/avatars/abc.png';

            const mockStorage = {
                upload: jest.fn().mockResolvedValue({ error: null }),
                getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: mockPublicUrl } }),
            };
            (supabase.storage.from as jest.Mock).mockReturnValue(mockStorage);

            const result = await userService.uploadAvatar(mockFile);

            expect(supabase.storage.from).toHaveBeenCalledWith('avatars');
            expect(result).toBe(mockPublicUrl);
        });
    });
});
// UserService Test Suite verified by Hoang
