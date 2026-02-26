import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  nro: String,
  metodo: String,
  prioridad: Boolean,
  estado: { type: String, default: "PENDIENTE" },
  items: [
    {
      pizza: String,
      cantidad: Number,
    },
  ],
  notas: String,
  hora: String,
  creado: { type: Date, default: Date.now },
});

export default mongoose.model("Ticket", TicketSchema);