import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
// import { backendUrl, currency } from "../../App";


const RecentOrders = ({ token }) => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axios.post(
                backendUrl + "/api/order/list",
                {},
                { headers: { Authorization: `Bearer ${token}` } },
            );

            if (res.data.success) {
                setOrders(res.data.orders.slice(0, 5));
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="bg-white p-5 rounded-xl shadow mt-6">
            <h3 className="font-semibold mb-3">Recent Orders</h3>

            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left bg-gray-100">
                        <th className="p-2">Order</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o, i) => (
                        <tr key={i} className="border-t">
                            <td className="p-2">{o._id.slice(0, 6)}</td>
                            <td className="p-2">
                                {currency}
                                {o.amount}
                            </td>
                            <td className="p-2">{o.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecentOrders;
