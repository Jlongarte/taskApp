import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Componente Base: Tarjeta contenedora
export function AnalyticsCard({ title, subtitle, isPie = false, children }) {
  return (
    <div className="analytics-card">
      <h2 className="card-title">{title}</h2>
      <p className="card-subtitle">{subtitle}</p>
      <div className={isPie ? "chart-wrapper-pie" : "chart-wrapper"}>
        {children}
      </div>
    </div>
  );
}

// Componente Secundario: Leyenda adaptativa
export function CustomLegend({ items }) {
  return (
    <div className="custom-legend">
      {items.map((item, index) => (
        <span key={index} className="legend-item">
          <span className="bullet" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

// Gráfico 1: Barras
export function BarChartWidget({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="fecha" stroke="#6b7280" fontSize={12} tickLine={false} />
        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ backgroundColor: '#1f1f2e', borderColor: '#374151', color: '#fff' }} />
        <Bar dataKey="tareas" fill="#a855f7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Gráficos 2 y 3: Tarta / Donut genérico
export function PieChartWidget({ data, colors, innerRadius = 0 }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={65} paddingAngle={innerRadius ? 5 : 0} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1f1f2e', borderColor: '#374151', color: '#fff' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Gráfico 4: Líneas comparativas
export function LineChartWidget({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="fecha" stroke="#6b7280" fontSize={12} tickLine={false} />
        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ backgroundColor: '#1f1f2e', borderColor: '#374151', color: '#fff' }} />
        <Line type="monotone" dataKey="creadas" name="Created" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="completadas" name="Completed" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}