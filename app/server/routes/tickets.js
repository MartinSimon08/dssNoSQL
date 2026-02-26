import express from "express";
import Ticket from "../models/Ticket.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ creado: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo tickets" });
  }
});

router.post("/", async (req, res) => {
  const ticket = await Ticket.create(req.body);
  res.json(ticket);
});

router.put("/:id", async (req, res) => {
  const actualizado = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(actualizado);
});

router.delete("/:id", async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;