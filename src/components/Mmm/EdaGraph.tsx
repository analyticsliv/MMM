'use client';
import React, { useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Legend,
    Line,
    LabelList,
} from 'recharts';
import { useMMMStore } from '@/store/useMMMStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const EdaGraph = () => {
    const { campaigns } = useMMMStore();
        console.log("campaign-",campaigns)

    const pieData = campaigns?.eda_plot_json_values?.pie_chart_data;
    const lineChartRaw = campaigns?.eda_plot_json_values?.line_chart_data;

    const [selectedPieCampaigns, setSelectedPieCampaigns] = useState(
        pieData?.map((d) => d.Campaign_Name.replace(/_Spend$/, '')) || []
    );
    const [selectedLineCampaigns, setSelectedLineCampaigns] = useState(
        Object.keys(lineChartRaw || {})
    );

    if (!pieData || pieData.length === 0) return null;

    const togglePieCampaign = (campaign: string) => {
        setSelectedPieCampaigns((prev) =>
            prev.includes(campaign)
                ? prev.filter((c) => c !== campaign)
                : [...prev, campaign]
        );
    };

    const toggleLineCampaign = (campaign: string) => {
        setSelectedLineCampaigns((prev) =>
            prev.includes(campaign)
                ? prev.filter((c) => c !== campaign)
                : [...prev, campaign]
        );
    };

    const filteredPieData = pieData.filter((entry: any) =>
        selectedPieCampaigns.includes(entry.Campaign_Name.replace(/_Spend$/, ''))
    );

    const allDates = new Set<string>();
    Object.values(lineChartRaw || {}).forEach((camp: any) =>
        camp?.Date?.forEach((d: string) => allDates.add(d))
    );
    const sortedDates = Array.from(allDates).sort();

    const lineChartData = sortedDates.map((date) => {
        const point: any = { date };
        for (const [campaignName, data] of Object.entries(lineChartRaw || {})) {
            if (!selectedLineCampaigns.includes(campaignName)) continue;
            const index = data.Date.indexOf(date);
            if (index !== -1) {
                point[`${campaignName} - Spend`] = data.Spend[index];
                point[`${campaignName} - Clicks`] = data.Clicks[index];
            }
        }
        return point;
    });

    const lines = selectedLineCampaigns.flatMap((campaignName, i) => [
        <Line
            key={`${campaignName}-Spend`}
            type="monotone"
            dataKey={`${campaignName} - Spend`}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
        />,
        <Line
            key={`${campaignName}-Clicks`}
            type="monotone"
            dataKey={`${campaignName} - Clicks`}
            stroke={COLORS[(i + 1) % COLORS.length]}
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
        />,
    ]);

    return (
        <div id="eda-graph-section" className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Exploratory Data Analysis</h2>

            <div className="bg-white shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Spend Share by Campaign</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {pieData.map((entry: any) => {
                        const name = entry.Campaign_Name.replace(/_Spend$/, '');
                        return (
                            <button
                                key={name}
                                onClick={() => togglePieCampaign(name)}
                                className={`border px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${selectedPieCampaigns.includes(name)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={filteredPieData}
                            dataKey="Spend_Share"
                            nameKey="Campaign_Name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            label={({ name, value }) => (
                                `${name.replace(/_Spend$/, '')}\n${value.toFixed(3)}`
                            )}
                        >
                            {filteredPieData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
                <h3 className="text-lg font-semibold mb-2">Toggle Campaigns for Line Chart</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {Object.keys(lineChartRaw || {}).map((name, i) => (
                        <button
                            key={name}
                            onClick={() => toggleLineCampaign(name)}
                            className={`border px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${selectedLineCampaigns.includes(name)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
                <h3 className="text-lg font-semibold mb-4">Campaign Spend & Clicks Over Time</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={lineChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {lines}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EdaGraph;









// 'use client';
// import React from 'react';
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Legend, Line } from 'recharts';
// import { useMMMStore } from '@/store/useMMMStore';
// import { response } from '@/utils/const';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

// const EdaGraph = () => {
//     const { campaigns } = useMMMStore();
//     // const response = {
//     //     "eda_plot_json_values": {
//     //         "pie_chart_data": [
//     //             {
//     //                 "Campaign_Name": "SHO005_2022_Google-Display_Conversion_US_English_Dynamic-Retargeting-Visitors_Spend",
//     //                 "Spend_Share": 0.19358121083942748
//     //             },
//     //             {
//     //                 "Campaign_Name": "SHO005_2022_Google-PMax_Conversion_US_HighValueProducts_Spend",
//     //                 "Spend_Share": 0.17931633709163247
//     //             },
//     //             {
//     //                 "Campaign_Name": "SHO005_2022_Google-PMax_Conversion_US_Men-High-AOV_Brands_Spend",
//     //                 "Spend_Share": 0.19065777595297267
//     //             },
//     //             {
//     //                 "Campaign_Name": "SHO005_2022_Google-PMax_Conversion_US_Non-Clearance_Spend",
//     //                 "Spend_Share": 0.23940322360504185
//     //             },
//     //             {
//     //                 "Campaign_Name": "SHO005_2022_Google-PMax_Conversion_US_Women-High-AOV_Brands_Spend",
//     //                 "Spend_Share": 0.1970414525109254
//     //             }
//     //         ],
//     //     }
//     // }

//     const pieData = response?.eda_plot_json_values?.pie_chart_data;
//     const lineChartRaw = response?.eda_plot_json_values?.line_chart_data;

//     if (!pieData || pieData.length === 0) return null;



//     const allDates = new Set<string>();
//     Object.values(lineChartRaw || {}).forEach((camp: any) =>
//         camp?.Date?.forEach((d: string) => allDates.add(d))
//     );

//     const sortedDates = Array.from(allDates).sort();

//     const lineChartData = sortedDates.map((date) => {
//         const point: any = { date };
//         for (const [campaignName, data] of Object.entries(lineChartRaw || {})) {
//             const index = data.Date.indexOf(date);
//             if (index !== -1) {
//                 point[`${campaignName} - Spend`] = data.Spend[index];
//                 point[`${campaignName} - Clicks`] = data.Clicks[index];
//             }
//         }
//         return point;
//     });



//     const lines = Object.keys(lineChartRaw || {}).flatMap((campaignName, i) => [
//         <Line
//             key={`${campaignName}-Spend`}
//             type="monotone"
//             dataKey={`${campaignName} - Spend`}
//             stroke={COLORS[i % COLORS.length]}
//             strokeWidth={2}
//             dot={false}
//         />,
//         <Line
//             key={`${campaignName}-Clicks`}
//             type="monotone"
//             dataKey={`${campaignName} - Clicks`}
//             stroke={COLORS[(i + 1) % COLORS.length]}
//             strokeDasharray="5 5"
//             strokeWidth={2}
//             dot={false}
//         />,
//     ]);

//     return (
//         <div id="eda-graph-section" className="mt-10">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Exploratory Data Analysis</h2>

//             <div className="bg-white shadow-lg rounded-xl p-6">
//                 <h3 className="text-lg font-semibold mb-2">Spend Share by Campaign</h3>
//                 <ResponsiveContainer width="100%" height={400}>
//                     <PieChart>
//                         <Pie
//                             data={pieData}
//                             dataKey="Spend_Share"
//                             nameKey="Campaign_Name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={150}
//                             label={({ name, value }) =>
//                                 // `${name.split('_Spend')[0]} (${(percent * 100).toFixed(1)}%)`
//                                 `${name.replace(/_Spend$/, '')}: ${value.toFixed(3)}`
//                             }
//                         >
//                             {pieData.map((_, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                         </Pie>

//                         <Tooltip />
//                     </PieChart>
//                 </ResponsiveContainer>
//             </div>

//             {lineChartData?.length > 0 && (
//                 <div className="bg-white shadow-lg rounded-xl p-6">
//                     <h3 className="text-lg font-semibold mb-4">Campaign Spend & Clicks Over Time</h3>
//                     <ResponsiveContainer width="100%" height={400}>
//                         <LineChart data={lineChartData}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="date" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             {lines}
//                         </LineChart>
//                     </ResponsiveContainer>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default EdaGraph;
