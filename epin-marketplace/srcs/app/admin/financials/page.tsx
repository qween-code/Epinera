'use client';
import { Card, Title, BarChart, DonutChart, Grid, Col } from '@tremor/react';

const revenueData = [
    { name: 'Jan', 'Revenue': 123000 },
    { name: 'Feb', 'Revenue': 234000 },
    { name: 'Mar', 'Revenue': 345000 },
    { name: 'Apr', 'Revenue': 234000 },
    { name: 'May', 'Revenue': 456000 },
    { name: 'Jun', 'Revenue': 567000 },
];

const revenueSourceData = [
    { name: 'Commissions', value: 125045 },
    { name: 'Listing Fees', value: 45678 },
    { name: 'Withdrawal Fees', value: 23456 },
];

const dataFormatter = (number: number) => {
    return "$ " + new Intl.NumberFormat("us").format(number).toString();
};


export default function FinancialReportingPage() {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Financial Reporting</h1>

            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mb-8">
                <Card>
                    <Title>Gross Merchandise Value</Title>
                    <p className="text-4xl font-bold mt-2">$1,250,450</p>
                </Card>
                <Card>
                    <Title>Net Revenue</Title>
                    <p className="text-4xl font-bold mt-2">$875,315</p>
                </Card>
                <Card>
                    <Title>Chargeback Losses</Title>
                    <p className="text-4xl font-bold mt-2 text-red-400">$5,120</p>
                </Card>
            </Grid>

            <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
                <Col numColSpanMd={2} numColSpanLg={2}>
                    <Card>
                        <Title>Revenue Trend</Title>
                        <BarChart
                            className="mt-6"
                            data={revenueData}
                            index="name"
                            categories={["Revenue"]}
                            colors={["blue"]}
                            valueFormatter={dataFormatter}
                            yAxisWidth={48}
                        />
                    </Card>
                </Col>
                <Card>
                    <Title>Revenue by Source</Title>
                    <DonutChart
                        className="mt-6"
                        data={revenueSourceData}
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
