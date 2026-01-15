'use client';

import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

interface RevenueChartProps {
    data: any[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
    return (
        <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        dy={10}
                    />
                    <YAxis
                        stroke="#64748b"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        tickFormatter={(val) => `R$${val}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                        itemStyle={{ color: '#10b981' }}
                        formatter={(val: number | string | undefined) => [`R$ ${Number(val || 0).toFixed(2)}`, 'Receita']}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
