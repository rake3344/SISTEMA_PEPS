import { pool } from "../db.js";

export const ingresarEntrada = async (req, res) => {
  try {
    const { cantidad, costo } = req.body;
    const total = cantidad * costo;
    const [newEntrada] = await pool.query(
      "INSERT INTO entrada (cantidad, costo, total, fecha_entrada) VALUES (?, ?, ?, NOW())",
      [cantidad, costo, total]
    );
    if (newEntrada.affectedRows === 1) {
      await pool.query(
        "INSERT INTO saldo (cantidad, costo, total, activo) VALUES (?, ?, ?, 1)",
        [cantidad, costo, total]
      );
      res.status(200).json({ message: "Saldo ingresado correctamente" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const ingresarSalida = async (req, res) => {
  try {
    const { cantidad } = req.body;
    const [saldos] = await pool.query(
      "SELECT * FROM saldo WHERE activo = 1 ORDER BY id_saldo ASC"
    );
    const saldo = saldos[0];
    const cantidadAnterior = saldo.cantidad;
    const costAnterior = saldo.costo;
    const totalAnterior = saldo.total;
    if (cantidadAnterior < cantidad) {
      await pool.query(
        "INSERT INTO salidas (cantidad, costo, total, fecha_salida) VALUES (?, ?, ?, NOW())",
        [cantidadAnterior, costAnterior, totalAnterior]
      );
      await pool.query("UPDATE saldo SET activo = 0 WHERE id_saldo = ?", [
        saldo.id_saldo,
      ]);
      const restante = cantidad - cantidadAnterior;
      const saldoSiguiente = saldos[1];
      const cantidadSiguiente = saldoSiguiente.cantidad;
      const costoSiguiente = saldoSiguiente.costo;
      const cantidadActual = cantidadSiguiente - restante;
      const totalActual = cantidadActual * costoSiguiente;
      // la otra salida
      const cantidadSalida = cantidadSiguiente - cantidadActual;
      const totalSalida = cantidadSalida * costoSiguiente;
      await pool.query(
        "INSERT INTO salidas (cantidad, costo, total, fecha_salida) VALUES (?, ?, ?, NOW())",
        [cantidadSalida, costoSiguiente, totalSalida]
      );
      await pool.query(
        "INSERT INTO saldo (cantidad, costo, total, activo) VALUES (?, ?, ?, 1)",
        [cantidadActual, costoSiguiente, totalActual]
      );
      await pool.query("UPDATE saldo SET activo = 0 WHERE id_saldo = ?", [
        saldoSiguiente.id_saldo,
      ]);
      res.status(200).json({ message: "Saldo ingresado correctamente" });
    }

    if (cantidadAnterior === cantidad) {
      const cantidadActual = cantidadAnterior - cantidad;
      const totalActual = cantidadActual * costAnterior;
      // la otra salida
      const cantidadSalida = cantidadAnterior - cantidadActual;
      const totalSalida = cantidadSalida * costAnterior;
      await pool.query(
        "INSERT INTO salidas (cantidad, costo, total, fecha_salida) VALUES (?, ?, ?, NOW())",
        [cantidadAnterior, costAnterior, totalAnterior]
      );
      await pool.query(
        "INSERT INTO saldo (cantidad, costo, total, activo) VALUES (?, ?, ?, 1)",
        [cantidadActual, costAnterior, totalActual]
      );
      await pool.query("UPDATE saldo SET activo = 0 WHERE id_saldo = ?", [
        saldo.id_saldo,
      ]);
      res.status(200).json({ message: "Saldo ingresado correctamente" });
    }

    if (cantidadAnterior > cantidad) {
      const cantidadActual = cantidadAnterior - cantidad;
      const totalActual = cantidadActual * costAnterior;
      // la otra salida
      const cantidadSalida = cantidadAnterior - cantidadActual;
      const totalSalida = cantidadSalida * costAnterior;
      await pool.query(
        "INSERT INTO salidas (cantidad, costo, total, fecha_salida) VALUES (?, ?, ?, NOW())",
        [cantidadSalida, costAnterior, totalSalida]
      );
      await pool.query(
        "INSERT INTO saldo (cantidad, costo, total, activo) VALUES (?, ?, ?, 1)",
        [cantidadActual, costAnterior, totalActual]
      );
      await pool.query("UPDATE saldo SET activo = 0 WHERE id_saldo = ?", [
        saldo.id_saldo,
      ]);
      res.status(200).json({ message: "Saldo ingresado correctamente" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarRegistros = async (req, res) => {
  try {
    const [entradas] = await pool.query("TRUNCATE TABLE entrada");
    const [salidas] = await pool.query("TRUNCATE TABLE salidas");
    const [saldos] = await pool.query("TRUNCATE TABLE saldo");
    if (
      entradas.serverStatus === 2 &&
      salidas.serverStatus === 2 &&
      saldos.serverStatus === 2
    ) {
      res.status(200).json({ message: "datos eliminados" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEntradas = async (req, res) => {
  try {
    const [entradas] = await pool.query("SELECT * FROM entrada");
    res.status(200).json(entradas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSaldo = async (req, res) => {
  try {
    const [saldo] = await pool.query("SELECT * FROM saldo");
    res.status(200).json(saldo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalidas = async (req, res) => {
  try {
    const [salidas] = await pool.query("SELECT * FROM salidas");
    res.status(200).json(salidas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
