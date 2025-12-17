import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Jan", value: 200 },
  { name: "Feb", value: 280 },
  { name: "Mar", value: 250 },
  { name: "Apr", value: 330 },
  { name: "May", value: 420 },
  { name: "Jun", value: 390 },
];

export default function AnimatedGraph() {
  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
