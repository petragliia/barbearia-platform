'use client';

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

interface ClientDistributionChartProps {
    data: any[];
    total: number;
}

export default function ClientDistributionChart({ data, total }: ClientDistributionChartProps) {
    return (
        <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white">
                    {total}
                </span>
                <span className="text-xs text-slate-500 uppercase tracking-widest">Total</span>
            </div>
        </div>
    );
}
