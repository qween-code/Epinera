'use client';
import { Card, Title, BarChart, DonutChart } from '@tremor/react';

const salesData = [
    { name: 'Jan', 'Sales': 123 },
    { name: 'Feb', 'Sales': 234 },
    { name: 'Mar', 'Sales': 345 },
    { name: 'Apr', 'Sales': 234 },
    { name: 'May', 'Sales': 456 },
    { name: 'Jun', 'Sales': 567 },
];

const engagementData = [
    { name: 'Twitch', value: 4567 },
    { name: 'YouTube', value: 3456 },
    { name: 'Twitter', value: 2345 },
];

const dataFormatter = (number: number) => {
    return new Intl.NumberFormat("us").format(number).toString();
};

export default function CreatorAnalyticsPage() {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Creator Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <Title>Epin Sales Over Time</Title>
                    <BarChart
                        className="mt-6"
                        data={salesData}
                        index="name"
                        categories={["Sales"]}
                        colors={["blue"]}
                        valueFormatter={dataFormatter}
                        yAxisWidth={48}
                    />
                </Card>
                <Card className="flex flex-col">
                    <Title>Audience Engagement by Platform</Title>
                    <DonutChart
                        className="mt-6"
                        data={engagementData}
                        category="value"
                        index="name"
                        valueFormatter={dataFormatter}
                        colors={["indigo", "rose", "cyan"]}
                    />
                </Card>
            </div>
        </div>
    );
}
