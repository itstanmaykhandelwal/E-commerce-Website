import React from "react";

const StatCard = ({ title, value }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-500">{title}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
        </div>
    );
};

export default StatCard;
