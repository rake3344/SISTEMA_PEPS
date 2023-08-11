import mongoose from "mongoose";

const { Schema, model } = mongoose;

const salidasSchema = Schema(
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

const Salidas = model("Salidas", salidasSchema);

export default Salidas;
