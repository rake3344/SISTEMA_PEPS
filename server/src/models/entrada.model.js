import mongoose from "mongoose";

const { Schema, model } = mongoose;

const entradasSchema = Schema(
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

const Entradas = model("Entradas", entradasSchema);

export default Entradas;
