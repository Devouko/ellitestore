'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Charts = ({
  data: { salesData },
}: {
  data: { salesData: { month: string; sales: number }[] };
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={salesData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Bar dataKey="sales" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;