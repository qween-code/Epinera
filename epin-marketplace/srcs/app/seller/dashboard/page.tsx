import { BarChart, Card, Title } from "@tremor/react";

const chartdata = [
    { name: "Jan", "Sales": 2488 },
    { name: "Feb", "Sales": 1445 },
    { name: "Mar", "Sales": 743 },
    { name: "Apr", "Sales": 281 },
    { name: "May", "Sales": 251 },
    { name: "Jun", "Sales": 732 },
    { name: "Jul", "Sales": 1282 },
];

const dataFormatter = (number: number) => {
    return "$ " + new Intl.NumberFormat("us").format(number).toString();
};


export default function SellerDashboardPage() {

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Seller Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <Title>Total Revenue</Title>
                    <p className="text-4xl font-bold mt-2">$12,845</p>
                </Card>
                <Card>
                    <Title>Total Orders</Title>
                    <p className="text-4xl font-bold mt-2">256</p>
                </Card>
                <Card>
                    <Title>Seller Rating</Title>
                    <p className="text-4xl font-bold mt-2">4.8/5</p>
                </Card>
                <Card>
                    <Title>Product Views</Title>
                    <p className="text-4xl font-bold mt-2">15,209</p>
                </Card>
            </div>
            <Card>
                <Title>Sales Performance</Title>
                <BarChart
                    className="mt-6"
                    data={chartdata}
                    index="name"
                    categories={["Sales"]}
                    colors={["blue"]}
                    valueFormatter={dataFormatter}
                    yAxisWidth={48}
                />
            </Card>
        </div>
    );
}
