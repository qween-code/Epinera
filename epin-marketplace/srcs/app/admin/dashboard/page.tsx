'use client';
import { Card, Title, BarChart } from '@tremor/react';

const ticketData = [
    { name: 'Jan', 'New Tickets': 150, 'Resolved Tickets': 140 },
    { name: 'Feb', 'New Tickets': 180, 'Resolved Tickets': 175 },
    { name: 'Mar', 'New Tickets': 220, 'Resolved Tickets': 210 },
    { name: 'Apr', 'New Tickets': 190, 'Resolved Tickets': 185 },
];

const dataFormatter = (number: number) => {
    return new Intl.NumberFormat("us").format(number).toString();
};

export default function AdminDashboardPage() {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                    <Title>Pending Verifications</Title>
                    <p className="text-4xl font-bold mt-2">15</p>
                </Card>
                <Card>
                    <Title>Open Support Tickets</Title>
                    <p className="text-4xl font-bold mt-2">8</p>
                </Card>
                <Card>
                    <Title>Flagged Content</Title>
                    <p className="text-4xl font-bold mt-2">12</p>
                </Card>
            </div>

            <Card>
                <Title>Support Ticket Volume</Title>
                <BarChart
                    className="mt-6"
                    data={ticketData}
                    index="name"
                    categories={["New Tickets", "Resolved Tickets"]}
                    colors={["blue", "green"]}
                    valueFormatter={dataFormatter}
                    yAxisWidth={48}
                />
            </Card>
        </div>
    );
}
