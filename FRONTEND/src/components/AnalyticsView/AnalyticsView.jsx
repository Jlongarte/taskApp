import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import './AnalyticsView.css';

const STATUS_COLORS = ['#6366f1', '#eab308', '#22c55e']; // Indigo, Amarillo, Verde
const PRIORITY_COLORS = ['#ef4444', '#f97316', '#3b82f6']; // Rojo (Alta), Naranja (Media), Azul (Baja)

export function AnalyticsView() {
  const [data, setData] = useState({ statusDistribution: [], completedOverTime: [], priorityDistribution: [], createdOverTime: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/analytics')
      .then((res) => res.json())
      .then((backendData) => {
        // Fallbacks por si vienen vacíos de la BBDD
        const statusDistribution = backendData.statusDistribution?.length > 0 ? backendData.statusDistribution : 
          [{ name: "Pending", value: 4 }, { name: "In Progress", value: 2 }, { name: "Completed", value: 5 }];

        const completedOverTime = backendData.completedOverTime?.length > 0 ? backendData.completedOverTime : 
          [{ fecha: "Lun", tareas: 2 }, { fecha: "Mar", tareas: 4 }, { fecha: "Mié", tareas: 1 }, { fecha: "Jue", tareas: 5 }, { fecha: "Vie", tareas: 3 }];

        const priorityDistribution = backendData.priorityDistribution?.length > 0 ? backendData.priorityDistribution : 
          [{ name: "Alta", value: 3 }, { name: "Media", value: 5 }, { name: "Baja", value: 3 }];

        // Mezclamos creadas y completadas para el gráfico de líneas comparativo
        const balanceData = backendData.createdOverTime?.length > 0 ? backendData.createdOverTime : 
          [{ fecha: "Lun", creadas: 3, completadas: 2 }, { fecha: "Mar", creadas: 5, completadas: 4 }, { fecha: "Mié", creadas: 2, completadas: 1 }, { fecha: "Jue", creadas: 4, completadas: 5 }, { fecha: "Vie", creadas: 1, completadas: 3 }];

        setData({ statusDistribution, completedOverTime, priorityDistribution, balanceData });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Usando mock data completo:", err);
        setData({
          statusDistribution: [{ name: "Pending", value: 4 }, { name: "In Progress", value: 2 }, { name: "Completed", value: 5 }],
          completedOverTime: [{ fecha: "Lun", tareas: 2 }, { fecha: "Mar", tareas: 4 }, { fecha: "Mié", tareas: 1 }, { fecha: "Jue", tareas: 5 }],
          priorityDistribution: [{ name: "Alta", value: 3 }, { name: "Media", value: 6 }, { name: "Baja", value: 2 }],
          balanceData: [{ fecha: "Lun", creadas: 3, completadas: 2 }, { fecha: "Mar", creadas: 4, completadas: 3 }, { fecha: "Mié", creadas: 2, completadas: 4 }, { fecha: "Jue", creadas: 5, completadas: 2 }]
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="custom-spinner"></div>
        <p className="loader-text">Calculando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-content">
        <h1 className="analytics-title">Estadísticas de Productividad</h1>
        <p className="analytics-subtitle">Análisis avanzado de tu rendimiento del tablero.</p>

        <div className="analytics-grid">
          
          {/* GRÁFICO 1: BAR_CHART */}
          <div className="analytics-card">
            <h2 className="card-title">Rendimiento Semanal</h2>
            <p className="card-subtitle">Tareas marcadas como 'Completed' por día</p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.completedOverTime}>
                  <XAxis dataKey="fecha" stroke="#6b7280" fontSize={12} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f1f2e', borderColor: '#374151', color: '#fff' }} />
                  <Bar dataKey="tareas" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRÁFICO 2: DONUT_CHART (ESTADOS) */}
          <div className="analytics-card">
            <h2 className="card-title">Estado del Tablero</h2>
            <p className="card-subtitle">Distribución por estados de trabajo</p>
            <div className="chart-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={data.statusDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={5} dataKey="value">
                    {data.statusDistribution.map((entry, index) => <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f1f2e', borderColor: '#374151', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="custom-legend">
                <span className="legend-item"><span className="bullet bg-pending" /> Pending</span>
                <span className="legend-item"><span className="bullet bg-progress" /> In Progress</span>
                <span className="legend-item"><span className="bullet bg-completed" /> Completed</span>
              </div>
            </div>
          </div>

          {/* 🆕 GRÁFICO 3: PIE_CHART (PRIORIDADES) */}
          <div className="analytics-card">
            <h2 className="card-title">Nivel de Urgencia</h2>
            <p className="card-subtitle">Distribución de tareas por prioridad</p>
            <div className="chart-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={data.priorityDistribution} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                    {data.priorityDistribution.map((entry, index) => <Cell key={index} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f1f2e', borderColor: '#374151', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="custom-legend">
                <span className="legend-item"><span className="bullet" style={{backgroundColor: '#ef4444'}} /> Alta</span>
                <span className="legend-item"><span className="bullet" style={{backgroundColor: '#f97316'}} /> Media</span>
                <span className="legend-item"><span className="bullet" style={{backgroundColor: '#3b82f6'}} /> Baja</span>
              </div>
            </div>
          </div>

          {/* 🆕 GRÁFICO 4: LINE_CHART COMPARATIVO */}
          <div className="analytics-card">
            <h2 className="card-title">Balance de Flujo de Trabajo</h2>
            <p className="card-subtitle">Tareas Creadas (Azul) vs Completadas (Morado)</p>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.balanceData}>
                  <XAxis dataKey="fecha" stroke="#6b7280" fontSize={12} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f1f2e', borderColor: '#374151', color: '#fff' }} />
                  <Line type="monotone" dataKey="creadas" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="completadas" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}