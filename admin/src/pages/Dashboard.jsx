import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import RecentOrders from "../components/RecentOrders";
import TopProducts from "../components/TopProducts";
import LowStock from "../components/LowStock";

// import StatCard from "../components/dashboard/StatCard";
// import SalesChart from "../components/dashboard/SalesChart";
// import RecentOrders from "../components/dashboard/RecentOrders";

const Dashboard = ({ token }) => {
    const [data, setData] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
    });

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(
                backendUrl + "/api/admin/dashboard",
            );

            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(backendUrl + "/api/product/list");
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        fetchProducts();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Products" value={data.totalProducts} />
                <StatCard title="Orders" value={data.totalOrders} />
                <StatCard
                    title="Revenue"
                    value={`${currency} ${data.totalRevenue}`}
                />
                <StatCard title="Users" value={data.totalUsers} />
            </div>

            {/* Chart */}
            <SalesChart />

            {/* Orders */}
            <RecentOrders token={token} />

            {/* Widgets Row */}
            <div className="grid md:grid-cols-2 gap-4">
                <TopProducts products={products} />
                <LowStock products={products} />
            </div>
        </div>
    );
};

export default Dashboard;
