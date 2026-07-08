import { useEffect, useState } from 'react';
import { AnalyticsCard, BarChartWidget, PieChartWidget, LineChartWidget, CustomLegend } from '../../components/Analitycs/AnalyticsWidgets';
import './AnalyticsView.css';

const STATUS_COLORS = ['#6366f1', '#eab308', '#22c55e']; 
const PRIORITY_COLORS = ['#ef4444', '#f97316', '#3b82f6']; 

export function AnalyticsView() {
  const [data, setData] = useState({ statusDistribution: [], completedOverTime: [], priorityDistribution: [], balanceData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/analytics')
      .then((res) => res.json())
      .then((backendData) => {
        setData({
          statusDistribution: backendData.statusDistribution?.length > 0 ? backendData.statusDistribution : [{ name: "Pending", value: 4 }, { name: "In Progress", value: 2 }, { name: "Completed", value: 5 }],
          completedOverTime: backendData.completedOverTime?.length > 0 ? backendData.completedOverTime : [{ fecha: "Mon", tareas: 2 }, { fecha: "Tue", tareas: 4 }, { fecha: "Wed", tareas: 1 }, { fecha: "Thu", tareas: 5 }, { fecha: "Fri", tareas: 3 }],
          priorityDistribution: backendData.priorityDistribution?.length > 0 ? backendData.priorityDistribution : [{ name: "High", value: 3 }, { name: "Medium", value: 5 }, { name: "Low", value: 3 }],
          balanceData: backendData.createdOverTime?.length > 0 ? backendData.createdOverTime : [{ fecha: "Mon", creadas: 3, completadas: 2 }, { fecha: "Tue", creadas: 5, completadas: 4 }, { fecha: "Wed", creadas: 2, completadas: 1 }, { fecha: "Thu", creadas: 4, completadas: 5 }, { fecha: "Fri", creadas: 1, completadas: 3 }]
        });
        setLoading(false);
      })
      .catch(() => {
        setData({
          statusDistribution: [{ name: "Pending", value: 4 }, { name: "In Progress", value: 2 }, { name: "Completed", value: 5 }],
          completedOverTime: [{ fecha: "Mon", tareas: 2 }, { fecha: "Tue", tareas: 4 }, { fecha: "Wed", tareas: 1 }, { fecha: "Thu", tareas: 5 }],
          priorityDistribution: [{ name: "High", value: 3 }, { name: "Medium", value: 6 }, { name: "Low", value: 2 }],
          balanceData: [{ fecha: "Mon", creadas: 3, completadas: 2 }, { fecha: "Tue", creadas: 4, completadas: 3 }, { fecha: "Wed", creadas: 2, completadas: 4 }, { fecha: "Thu", creadas: 5, completadas: 2 }]
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="custom-spinner"></div>
        <p className="loader-text">Calculating analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-content">
        {/*  Encabezado */}
        <h1 className="analytics-title">Productivity Analytics</h1>
        <p className="analytics-subtitle">Advanced insight into your board performance.</p>

        {/*  Cuadrícula de Gráficos */}
        <div className="analytics-grid">
          
          <AnalyticsCard title="Weekly Performance" subtitle="Tasks marked as 'Completed' per day">
            <BarChartWidget data={data.completedOverTime} />
          </AnalyticsCard>

          <AnalyticsCard title="Board Status" subtitle="Distribution by workflow stages" isPie>
            <PieChartWidget data={data.statusDistribution} colors={STATUS_COLORS} innerRadius={45} />
            <CustomLegend items={[
              { label: 'Pending', color: '#6366f1' },
              { label: 'In Progress', color: '#eab308' },
              { label: 'Completed', color: '#22c55e' }
            ]} />
          </AnalyticsCard>

          <AnalyticsCard title="Urgency Level" subtitle="Distribution of tasks by priority" isPie>
            <PieChartWidget data={data.priorityDistribution} colors={PRIORITY_COLORS} />
            <CustomLegend items={[
              { label: 'High', color: '#ef4444' },
              { label: 'Medium', color: '#f97316' },
              { label: 'Low', color: '#3b82f6' }
            ]} />
          </AnalyticsCard>

          <AnalyticsCard title="Workflow Balance" subtitle="Created Tasks vs Completed Tasks">
            <LineChartWidget data={data.balanceData} />
          </AnalyticsCard>

        </div>
      </div>
    </div>
  );
}