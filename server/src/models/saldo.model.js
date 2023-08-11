import mongoose from "mongoose";

const { Schema, model } = mongoose;

const saldoSchema = Schema(
  {
    cantidad: {
      type: String,
      required: true,
    },
    costo: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Saldo = model("Saldo", saldoSchema);

export default Saldo;
