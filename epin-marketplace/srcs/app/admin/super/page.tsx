'use client';
import { Card, Title, BarChart, DonutChart, Grid, Col } from '@tremor/react';

const salesData = [
    { name: 'Jan', 'Sales': 1230 },
    { name: 'Feb', 'Sales': 2340 },
    { name: 'Mar', 'Sales': 3450 },
    { name: 'Apr', 'Sales': 2340 },
    { name: 'May', 'Sales': 4560 },
    { name: 'Jun', 'Sales': 5670 },
];

const platformData = [
    { name: 'PC', value: 7567 },
    { name: 'Mobile', value: 4567 },
    { name: 'Console', value: 3456 },
];

const dataFormatter = (number: number) => {
    return "$ " + new Intl.NumberFormat("us").format(number).toString();
};


export default function SuperAdminDashboardPage() {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Super Admin Dashboard</h1>

            <Grid numItemsMd={2} numItemsLg={4} className="gap-6 mb-8">
                <Card>
                    <Title>Total Revenue</Title>
                    <p className="text-4xl font-bold mt-2">$1,250,450</p>
                </Card>
                <Card>
                    <Title>Total Users</Title>
                    <p className="text-4xl font-bold mt-2">12,456</p>
                </Card>
                <Card>
                    <Title>Active Sellers</Title>
                    <p className="text-4xl font-bold mt-2">1,234</p>
                </Card>
                <Card>
                    <Title>Pending Verifications</Title>
                    <p className="text-4xl font-bold mt-2">15</p>
                </Card>
            </Grid>

            <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
                <Col numColSpanMd={2} numColSpanLg={2}>
                    <Card>
                        <Title>Sales Volume</Title>
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
                </Col>
                <Card>
                    <Title>Sales by Platform</Title>
                    <DonutChart
                        className="mt-6"
                        data={platformData}
                        category="value"
                        index="name"
                        valueFormatter={dataFormatter}
                        colors={["cyan", "blue", "indigo"]}
                    />
                </Card>
            </Grid>
        </div>
    );
}
