'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, subDays } from 'date-fns';

interface ModerationStats {
    totalReviewed: number;
    approved: number;
    rejected: number;
    pending: number;
    appealsReceived: number;
}

interface TimeSeriesData {
    date: string;
    approved: number;
    rejected: number;
    pending: number;
}

export default function ModerationAnalyticsPage() {
    const [stats, setStats] = useState<ModerationStats>({
        totalReviewed: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
        appealsReceived: 0,
    });
    const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
    const [dateRange, setDateRange] = useState(7); // days
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login?redirect=/admin/moderation-analytics');
                return;
            }

            // Check admin role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (!profile || profile.role !== 'admin') {
                router.push('/');
                return;
            }

            // Calculate date range
            const startDate = subDays(new Date(), dateRange).toISOString();

            // Fetch stats from reviews
            const { data: reviewStats } = await supabase
                .from('reviews')
                .select('moderation_status, created_at')
                .gte('created_at', startDate);

            // Fetch stats from products
            const { data: productStats } = await supabase
                .from('products')
                .select('moderation_status, created_at')
                .gte('created_at', startDate);

            // Fetch appeals
            const { data: appealsData } = await supabase
                .from('moderation_appeals')
                .select('id, created_at')
                .gte('created_at', startDate);

            // Combine stats
            const allItems = [...(reviewStats || []), ...(productStats || [])];
            const approved = allItems.filter((item) => item.moderation_status === 'approved').length;
            const rejected = allItems.filter((item) => item.moderation_status === 'rejected').length;
            const pending = allItems.filter((item) => item.moderation_status === 'pending').length;

            setStats({
                totalReviewed: approved + rejected,
                approved,
                rejected,
                pending,
                appealsReceived: appealsData?.length || 0,
            });

            // Generate time series data
            const timeData: TimeSeriesData[] = [];
            for (let i = dateRange - 1; i >= 0; i--) {
                const date = subDays(new Date(), i);
                const dateStr = format(date, 'MM/dd');

                const dayItems = allItems.filter((item) => {
                    const itemDate = new Date(item.created_at);
                    return format(itemDate, 'MM/dd') === dateStr;
                });

                timeData.push({
                    date: dateStr,
                    approved: dayItems.filter((i) => i.moderation_status === 'approved').length,
                    rejected: dayItems.filter((i) => i.moderation_status === 'rejected').length,
                    pending: dayItems.filter((i) => i.moderation_status === 'pending').length,
                });
            }

            setTimeSeriesData(timeData);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const approvalRate = stats.totalReviewed > 0
        ? ((stats.approved / stats.totalReviewed) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Moderation Analytics
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Track and analyze content moderation performance
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {[7, 14, 30].map((days) => (
                                <button
                                    key={days}
                                    onClick={() => setDateRange(days)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${dateRange === days
                                            ? 'bg-primary text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    {days} days
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Total Reviewed</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                            {stats.totalReviewed}
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-primary">fact_check</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Approved</p>
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                                            {stats.approved}
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">
                                        check_circle
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    {approvalRate}% approval rate
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Rejected</p>
                                        <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                                            {stats.rejected}
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
                                        cancel
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
                                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                                            {stats.pending}
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-4xl text-yellow-600 dark:text-yellow-400">
                                        schedule
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Time Series Chart */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Moderation Trend
                            </h2>
                            <div className="h-64 flex items-end justify-between gap-2">
                                {timeSeriesData.map((data, index) => {
                                    const total = data.approved + data.rejected + data.pending;
                                    const maxHeight = 200;
                                    return (
                                        <div key={index} className="flex-1 flex flex-col items-center">
                                            <div className="w-full flex flex-col justify-end" style={{ height: maxHeight }}>
                                                {data.approved > 0 && (
                                                    <div
                                                        className="bg-green-500 rounded-t"
                                                        style={{ height: `${(data.approved / Math.max(...timeSeriesData.map(d => d.approved + d.rejected + d.pending), 1)) * maxHeight}px` }}
                                                        title={`Approved: ${data.approved}`}
                                                    />
                                                )}
                                                {data.rejected > 0 && (
                                                    <div
                                                        className="bg-red-500"
                                                        style={{ height: `${(data.rejected / Math.max(...timeSeriesData.map(d => d.approved + d.rejected + d.pending), 1)) * maxHeight}px` }}
                                                        title={`Rejected: ${data.rejected}`}
                                                    />
                                                )}
                                                {data.pending > 0 && (
                                                    <div
                                                        className="bg-yellow-500"
                                                        style={{ height: `${(data.pending / Math.max(...timeSeriesData.map(d => d.approved + d.rejected + d.pending), 1)) * maxHeight}px` }}
                                                        title={`Pending: ${data.pending}`}
                                                    />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{data.date}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Approved</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link
                                href="/admin/content"
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                            >
                                <span className="material-symbols-outlined text-4xl text-primary mb-3">
                                    moderation
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Review Queue
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {stats.pending} items waiting for review
                                </p>
                            </Link>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <span className="material-symbols-outlined text-4xl text-yellow-600 dark:text-yellow-400 mb-3">
                                    gavel
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Appeals
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {stats.appealsReceived} appeals received
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <span className="material-symbols-outlined text-4xl text-blue-600 dark:text-blue-400 mb-3">
                                    trending_up
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Approval Rate
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {approvalRate}% content approved
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
