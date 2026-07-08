const Task = require('../models/task.model');

const getAnalytics = async (req, res) => {
  try {
    
    const statusDistribution = await Task.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

    const completedOverTime = await Task.aggregate([
      { $match: { status: 'completed', updatedAt: { $gte: sieteDiasAtras } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }, tareas: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
      { $project: { fecha: "$_id", tareas: 1, _id: 0 } }
    ]);

    // Distribución por Prioridad 
    const priorityDistribution = await Task.aggregate([
      { $group: { _id: "$priority", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // Tareas creadas en los últimos 7 días 
    const createdOverTime = await Task.aggregate([
      { $match: { createdAt: { $gte: sieteDiasAtras } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, creadas: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
      { $project: { fecha: "$_id", creadas: 1, _id: 0 } }
    ]);

    // Devolvemos los 4 sets de datos
    res.status(200).json({
      statusDistribution,
      completedOverTime,
      priorityDistribution,
      createdOverTime
    });

  } catch (error) {
    res.status(500).json({ message: "Error al calcular analíticas", error });
  }
};

module.exports = {
  getAnalytics,
};