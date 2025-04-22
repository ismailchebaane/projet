import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, Legend,
  LineChart, Line, ResponsiveContainer,
} from "recharts";
import { FaCogs, FaFileAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im"; // Spinner icon

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const ICONS = {
  "Added Equipment": <FaCogs className="text-blue-500 text-2xl" />,
  "Added Documents": <FaFileAlt className="text-green-500 text-2xl" />,
  "Approved Equipment": <FaCheckCircle className="text-purple-500 text-2xl" />,
  "Pending Equipment": <FaClock className="text-yellow-500 text-2xl" />,
};

const SummaryCard = ({ title, value = 0, change = "0" }) => (
  <div className="bg-white p-4 rounded-2xl shadow flex items-center justify-between">
    <div className="flex items-start gap-2">
      {ICONS[title]}
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 relative">
        <svg className="absolute top-0 left-0" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="2"
            strokeDasharray={`${Math.abs(parseInt(change))}, 100`}
          />
        </svg>
      </div>
      <span className={`text-sm font-semibold ${change?.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>{change ?? '0'}</span>
    </div>
  </div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white p-4 rounded-2xl shadow ${className}`}>
    <h2 className="text-sm font-semibold mb-2 text-gray-700">{title}</h2>
    <div className="w-full h-64">{children}</div>
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [goodMachines, setGoodMachines] = useState({ good: 0, total: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true); // 🔹 Loading state
const token=localStorage.getItem("token")
  const config=[ {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }]
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          summaryRes,
          pieRes,
          barRes,
          lineRes,
          goodRes,
          activityRes,
        ] = await Promise.all([
          axios.get("http://localhost:8080/api/dashboard/summary",config),
          axios.get("http://localhost:8080/api/dashboard/pie",config),
          axios.get("http://localhost:8080/api/dashboard/bar",config),
          axios.get("http://localhost:8080/api/dashboard/line",config),
          axios.get("http://localhost:8080/api/dashboard/good-machines",config),
          axios.get("http://localhost:8080/api/dashboard/recent-activity",config),
        ]);

        setSummary(summaryRes.data);
        setPieData(pieRes.data);
        setBarData(barRes.data);
        setLineData(lineRes.data);
        setGoodMachines(goodRes.data);
        setRecentActivity(activityRes.data);
      } catch (error) {
        console.error("Dashboard loading failed:", error);
      } finally {
        setLoading(false); // ✅ Done loading
      }
    };

    fetchData();
  }, []);

  const summaryCards = [
    { title: "Added Equipment", value: summary.addedEquipment, change: summary.addedEquipmentChange },
    { title: "Added Documents", value: summary.addedDocuments, change: summary.addedDocumentsChange },
    { title: "Approved Equipment", value: summary.approvedEquipment, change: summary.approvedEquipmentChange },
    { title: "Pending Equipment", value: summary.pendingEquipment, change: summary.pendingEquipmentChange },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ImSpinner2 className="animate-spin text-5xl text-blue-500" />
        <span className="ml-4 text-gray-600 text-xl font-medium">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 mt-16 bg-gray-100 min-h-screen">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      {/* Pie + Line */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Equipment by Type">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                label
                labelLine={false}
              >
                {pieData.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Plants and Process">
          <ResponsiveContainer>
            <LineChart data={lineData}>
              <XAxis dataKey="process" style={{ fontSize: '10px' }} />
              <YAxis style={{ fontSize: '10px' }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bar + Donut + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ChartCard title="Equipment Count by Process and Plant" className="xl:col-span-2">
          <ResponsiveContainer>
            <BarChart data={barData}>
              <XAxis dataKey="process" style={{ fontSize: '10px' }} />
              <YAxis style={{ fontSize: '10px' }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              {Object.keys(barData[0] || {})
                .filter((key) => key !== "process")
                .map((plant, idx) => (
                  <Bar key={plant} dataKey={plant} stackId="a" fill={COLORS[idx % COLORS.length]} />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Machines in Good Condition">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={[
                  { name: "Good", value: goodMachines.good },
                  { name: "Others", value: goodMachines.total - goodMachines.good },
                ]}
                innerRadius={50}
                outerRadius={70}
                dataKey="value"
                label
                labelLine={false}
              >
                <Cell fill="#82ca9d" />
                <Cell fill="#f4f4f4" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Activity Section */}
      <div className="mt-6 bg-white p-4 rounded-2xl shadow">
        <h2 className="text-sm font-semibold mb-4 text-gray-700">Recent Activities</h2>
        <ul className="space-y-3">
          {recentActivity.map((act, idx) => (
            <li key={idx} className="border-b pb-2">
              <p className="text-sm font-semibold text-blue-600">{act.code}</p>
              <p className="text-xs">{act.machine}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{act.date}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{act.plant}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
