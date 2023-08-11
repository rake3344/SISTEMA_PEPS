import { Router } from "express";
import {
  eliminarRegistros,
  getEntradas,
  getSaldo,
  getSalidas,
  ingresarEntrada,
  ingresarSalida,
} from "../controllers/saldo.js";

const pepsRouter = Router();

pepsRouter.post("/entrada", ingresarEntrada);
pepsRouter.post("/salida", ingresarSalida);
pepsRouter.delete("/clean", eliminarRegistros);
pepsRouter.get("/entradas", getEntradas);
pepsRouter.get("/saldo", getSaldo);
pepsRouter.get("/salida", getSalidas);

export default pepsRouter;
