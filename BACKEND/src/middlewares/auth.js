const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // 1. Obtenemos la cabecera de manera segura
    const authHeader = req.header("Authorization");

    // 2. Si no existe la cabecera o no empieza con "Bearer ", frenamos aquí
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token found or invalid format" });
    }

    // 3. Extraemos el token limpiamente
    const token = authHeader.replace("Bearer ", "");

    // 4. Verificamos el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Buscamos al usuario pasando el ID directamente (Corregido)
    // Nota: Asegúrate de que al firmar el token usaste '_id' y no 'id'
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Agregamos el usuario al objeto de la solicitud
    req.user = user;
    next();
  } catch (error) {
    // Si el token expiró o está mal manipulado, caerá aquí
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
