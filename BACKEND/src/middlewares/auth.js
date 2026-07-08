const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  try {
    // Obtenemos la cabecera de manera segura
    const authHeader = req.header("Authorization");

    // Si no existe la cabecera o no empieza con "Bearer ", frenamos aquí
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token found or invalid format" });
    }

    //  Extraemos el token limpiamente
    const token = authHeader.replace("Bearer ", "");

    //  Verificamos el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Buscamos al usuario pasando el ID directamente

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
