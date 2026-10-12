import { donationService } from '@/services/donation.service';
import { supabase } from '@/lib/supabase';

// Mock supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn(),
    },
}));

describe('donationService', () => {
    let mockSupabaseQuery: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSupabaseQuery = {
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            not: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnThis(),
        };
        (supabase.from as jest.Mock).mockReturnValue(mockSupabaseQuery);
    });

    describe('getStats', () => {
        test('should return correct stats for completed donations', async () => {
            const mockData = [
                { amount: 100000, donor_id: 'user1' },
                { amount: 200000, donor_id: 'user2' },
                { amount: 50000, donor_id: null }, // Anonymous
            ];

            mockSupabaseQuery.eq.mockResolvedValue({ data: mockData, error: null });

            const result = await donationService.getStats();

            expect(supabase.from).toHaveBeenCalledWith('financial_donations');
            expect(mockSupabaseQuery.select).toHaveBeenCalledWith('amount, donor_id');
            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('status', 'completed');

            expect(result.totalAmount).toBe(350000);
            expect(result.totalDonors).toBe(3); // 2 unique + 1 anonymous
            expect(result.totalTransactions).toBe(3);
        });

        test('should return zero stats when no donations', async () => {
            mockSupabaseQuery.eq.mockResolvedValue({ data: [], error: null });

            const result = await donationService.getStats();

            expect(result).toEqual({ totalAmount: 0, totalDonors: 0, totalTransactions: 0 });
        });

        test('should return default stats on error', async () => {
            mockSupabaseQuery.eq.mockResolvedValue({ data: null, error: { message: 'DB Error' } });

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const result = await donationService.getStats();

            expect(result).toEqual({ totalAmount: 0, totalDonors: 0, totalTransactions: 0 });
            consoleSpy.mockRestore();
        });
    });

    describe('getRecentDonations', () => {
        test('should return recent donations with default limit', async () => {
            const mockData = [
                { id: '1', donor_name: 'User 1', amount: 100000 },
                { id: '2', donor_name: 'User 2', amount: 200000 },
            ];

            mockSupabaseQuery.limit.mockResolvedValue({ data: mockData, error: null });

            const result = await donationService.getRecentDonations();

            expect(supabase.from).toHaveBeenCalledWith('financial_donations');
            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('status', 'completed');
            expect(mockSupabaseQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
            expect(mockSupabaseQuery.limit).toHaveBeenCalledWith(5);
            expect(result).toEqual(mockData);
        });

        test('should return recent donations with custom limit', async () => {
            const mockData = [{ id: '1', donor_name: 'User 1', amount: 100000 }];
            mockSupabaseQuery.limit.mockResolvedValue({ data: mockData, error: null });

            const result = await donationService.getRecentDonations(1);

            expect(mockSupabaseQuery.limit).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockData);
        });

        test('should return empty array on error', async () => {
            mockSupabaseQuery.limit.mockResolvedValue({ data: null, error: { message: 'Error' } });

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const result = await donationService.getRecentDonations();

            expect(result).toEqual([]);
            consoleSpy.mockRestore();
        });
    });

    describe('getLeaderboard', () => {
        test('should return sorted leaderboard by total amount', async () => {
            const mockData = [
                { donor_id: 'user1', donor_name: 'Alice', amount: 100000 },
                { donor_id: 'user1', donor_name: 'Alice', amount: 50000 },
                { donor_id: 'user2', donor_name: 'Bob', amount: 200000 },
            ];

            // Mock returns this for both .eq() calls, then resolves on the second one
            const mockChain = {
                ...mockSupabaseQuery,
                eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
            };
            mockSupabaseQuery.eq.mockReturnValue(mockChain);

            const result = await donationService.getLeaderboard(10);

            expect(result.length).toBe(2);
            expect(result[0].donor_name).toBe('Bob');
            expect(result[0].total_amount).toBe(200000);
            expect(result[1].donor_name).toBe('Alice');
            expect(result[1].total_amount).toBe(150000);
            expect(result[1].donation_count).toBe(2);
        });

        test('should exclude anonymous donations', async () => {
            const mockData = [
                { donor_id: 'user1', donor_name: 'Alice', amount: 100000 },
                { donor_id: null, donor_name: 'Ẩn danh', amount: 500000 },
            ];

            const mockChain = {
                ...mockSupabaseQuery,
                eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
            };
            mockSupabaseQuery.eq.mockReturnValue(mockChain);

            const result = await donationService.getLeaderboard();

            expect(result.length).toBe(1);
            expect(result[0].donor_name).toBe('Alice');
        });

        test('should limit results', async () => {
            const mockData = Array.from({ length: 20 }, (_, i) => ({
                donor_id: `user${i}`,
                donor_name: `User ${i}`,
                amount: 10000 * (20 - i),
            }));

            const mockChain = {
                ...mockSupabaseQuery,
                eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
            };
            mockSupabaseQuery.eq.mockReturnValue(mockChain);

            const result = await donationService.getLeaderboard(5);

            expect(result.length).toBe(5);
        });

        test('should return empty array on error', async () => {
            const mockChain = {
                ...mockSupabaseQuery,
                eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
            };
            mockSupabaseQuery.eq.mockReturnValue(mockChain);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const result = await donationService.getLeaderboard();

            expect(result).toEqual([]);
            consoleSpy.mockRestore();
        });
    });

    describe('createDonation', () => {
        test('should create donation with correct data', async () => {
            const donationData = {
                donorId: 'user-123',
                donorName: 'John Doe',
                amount: 100000,
                isAnonymous: false,
            };

            const mockCreatedDonation = {
                id: 'donation-1',
                donor_id: 'user-123',
                donor_name: 'John Doe',
                amount: 100000,
                payment_method: 'vietqr',
                status: 'pending',
                transaction_code: 'RH123456',
                is_anonymous: false,
            };

            mockSupabaseQuery.single.mockResolvedValue({ data: mockCreatedDonation, error: null });

            const result = await donationService.createDonation(donationData);

            expect(supabase.from).toHaveBeenCalledWith('financial_donations');
            expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(
                expect.objectContaining({
                    donor_id: 'user-123',
                    donor_name: 'John Doe',
                    amount: 100000,
                    payment_method: 'vietqr',
                    status: 'pending',
                    is_anonymous: false,
                })
            );
            expect(result).toEqual(mockCreatedDonation);
        });

        test('should set donor_name to "Ẩn danh" when anonymous', async () => {
            const donationData = {
                donorName: 'John Doe',
                amount: 50000,
                isAnonymous: true,
            };

            mockSupabaseQuery.single.mockResolvedValue({ data: { id: 'donation-2' }, error: null });

            await donationService.createDonation(donationData);

            expect(mockSupabaseQuery.insert).toHaveBeenCalledWith(
                expect.objectContaining({
                    donor_name: 'Ẩn danh',
                    is_anonymous: true,
                })
            );
        });

        test('should throw error when creation fails', async () => {
            const donationData = {
                donorName: 'John',
                amount: 100000,
                isAnonymous: false,
            };

            const dbError = { message: 'Database error' };
            mockSupabaseQuery.single.mockResolvedValue({ data: null, error: dbError });

            await expect(donationService.createDonation(donationData)).rejects.toEqual(dbError);
        });
    });

    describe('getDonationStatus', () => {
        test('should return status correctly', async () => {
            mockSupabaseQuery.single.mockResolvedValue({ data: { status: 'completed' }, error: null });

            const result = await donationService.getDonationStatus('donation-1');

            expect(supabase.from).toHaveBeenCalledWith('financial_donations');
            expect(mockSupabaseQuery.select).toHaveBeenCalledWith('status');
            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('id', 'donation-1');
            expect(result).toBe('completed');
        });

        test('should return null on error', async () => {
            mockSupabaseQuery.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const result = await donationService.getDonationStatus('invalid-id');

            expect(result).toBeNull();
            consoleSpy.mockRestore();
        });
    });

    describe('confirmPayment', () => {
        test('should update donation status to completed', async () => {
            const mockUpdatedDonation = {
                id: 'donation-1',
                status: 'completed',
            };

            mockSupabaseQuery.single.mockResolvedValue({ data: mockUpdatedDonation, error: null });

            const result = await donationService.confirmPayment('donation-1');

            expect(supabase.from).toHaveBeenCalledWith('financial_donations');
            expect(mockSupabaseQuery.update).toHaveBeenCalledWith({ status: 'completed' });
            expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('id', 'donation-1');
            expect(result).toEqual(mockUpdatedDonation);
        });

        test('should throw error when confirmation fails', async () => {
            const dbError = { message: 'Not found' };
            mockSupabaseQuery.single.mockResolvedValue({ data: null, error: dbError });

            await expect(donationService.confirmPayment('invalid-id')).rejects.toEqual(dbError);
        });
    });
});
// In-memory Supabase database mock verified by Phat
