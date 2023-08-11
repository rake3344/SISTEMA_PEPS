import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [entradas, setEntradas] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [saldo, setSaldo] = useState([]);
  const [entrada, setEntrada] = useState({
    cantidad: "",
    costo: "",
  });

  const [salida, setSalida] = useState({
    cantidad: "",
  });

  const toastDatosEliminados = () => {
    toast.success("Datos Eliminados", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
    });
  };

  const handleEntradaChange = (e) => {
    setEntrada({
      ...entrada,
      [e.target.name]: e.target.value,
    });
  };

  const handleSalidaChange = (e) => {
    setSalida({
      ...salida,
      [e.target.name]: e.target.value,
    });
  };

  const handleEntradaSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/entrada", entrada);
    if (response.data.message === "Saldo ingresado correctamente") {
      toast.success("Saldo ingresado correctamente", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  useEffect(() => {
    const getEntradas = async () => {
      const response = await axios.get("/entradas");
      setEntradas(response.data);
    };
    getEntradas();
  }, []);

  useEffect(() => {
    const getSalidas = async () => {
      const response = await axios.get("/salida");
      setSalidas(response.data);
    };
    getSalidas();
  }, []);

  useEffect(() => {
    const getSaldo = async () => {
      const response = await axios.get("/saldo");
      setSaldo(response.data);
    };
    getSaldo();
  }, []);

  const handleSalidaSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/salida", salida);
    if (response.data.message === "Saldo ingresado correctamente") {
      toast.success("Saldo retirado correctamente", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const maxRows = Math.max(entradas.length, salidas.length, saldo.length);

  let totalCantidad = 0;
  let totalCosto = 0;
  let totalTotal = 0;

  const rows = [];
  for (let i = 0; i < maxRows; i++) {
    let entrada = entradas[i] || {};
    let salida = salidas[i] || {};
    let saldos = saldo[i] || {};

    const fecha = new Date(entrada.fecha_entrada);
    const fechaString = fecha.toLocaleString();

    if (saldos.activo === 1) {
      totalCantidad += saldos.cantidad || 0;
      totalCosto += saldos.costo || 0;
      totalTotal += saldos.total || 0;
    }

    const row = (
      <tr key={i}>
        <td>{fechaString != "Invalid Date" ? fechaString : ""}</td>
        <td>{entrada.cantidad}</td>
        <td>{entrada.costo}</td>
        <td>{entrada.total}</td>
        <td>{salida.cantidad}</td>
        <td>{salida.costo}</td>
        <td>{salida.total}</td>
        <td>{saldos.cantidad}</td>
        <td>{saldos.costo}</td>
        <td>{saldos.total}</td>
      </tr>
    );

    rows.push(row);
  }

  // Fila de stock total
  const totalRow = (
    <tr key="total">
      <td colSpan="7" className="total-title">
        Stock Total
      </td>
      <td className="total-td">{totalCantidad}</td>
      <td className="total-td">{totalCosto}</td>
      <td className="total-td">{totalTotal}</td>
    </tr>
  );

  rows.push(totalRow);

  return (
    <>
      <div className="container">
        <div className="container__inputs">
          <div className="first_input">
            <form className="form_entrada" onSubmit={handleEntradaSubmit}>
              <label>Ingrese Entrada</label>
              <div className="entradas_input">
                <input
                  type="number"
                  min={1}
                  name="cantidad"
                  value={entrada.cantidad}
                  onChange={handleEntradaChange}
                  className="valores_input"
                  placeholder="Ingrese Cantidad"
                />

                <input
                  type="number"
                  min={1}
                  name="costo"
                  value={entrada.costo}
                  onChange={handleEntradaChange}
                  className="valores_input"
                  placeholder="Ingrese Costo"
                />
              </div>
              <button className="btn-entrada">Entrada</button>
            </form>
          </div>
          <div className="second_input">
            <form className="form_salida" onSubmit={handleSalidaSubmit}>
              <label htmlFor="second_input">Ingrese Salida</label>
              <input
                type="number"
                min={1}
                name="cantidad"
                value={salida.cantidad}
                onChange={handleSalidaChange}
                className="valores_input"
                placeholder="Ingrese Cantidad"
              />
              <button className="btn-entrada">Salida</button>
            </form>
          </div>
          <button
            className="btn-clear"
            onClick={async () => {
              const response = await axios.delete("/clean");
              console.log(response.data);
              if (response.data.message === "datos eliminados") {
                toastDatosEliminados();
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              }
            }}
          >
            Limpiar
          </button>
        </div>
        <div className="container_table">
          <table>
            <thead>
              <tr>
                <th className="small_th">Fecha de Entrada</th>
                <th colSpan="3">Entradas</th>
                <th colSpan="3">Salidas</th>
                <th colSpan="3">Saldo</th>
              </tr>
              <tr>
                <th></th>
                <th className="small_th">Cantidad</th>
                <th className="small_th">Costo</th>
                <th className="small_th">Total</th>
                <th className="small_th">Cantidad</th>
                <th className="small_th">Costo</th>
                <th className="small_th">Total</th>
                <th className="small_th">Cantidad</th>
                <th className="small_th">Costo</th>
                <th className="small_th">Total</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
