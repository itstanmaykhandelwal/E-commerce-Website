import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesChart = () => {
  const data = [
    { month: "Jan", sales: 400 },
    { month: "Feb", sales: 800 },
    { month: "Mar", sales: 600 },
    { month: "Apr", sales: 1200 },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow mt-6">
      <h3 className="font-semibold mb-3">Sales Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#6366f1" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;