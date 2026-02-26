"use client";
import React, { useState, useEffect } from "react";
import "./styles.css";

const API = "http://localhost:4000/api/tickets";

const ESTADOS = ["PENDIENTE", "EN_PREPARACION", "LISTO", "DESPACHADO"];
const PIZZAS = [
  "Muzzarella",
  "Fugazzetta",
  "Napolitana",
  "Jamon y Morrones",
  "Calabresa",
  "Rucula y Parmesano",
  "Roquefort",
  "4 Quesos",
  "Provolone",
  "Especial",
];
const METODOS = [
  "Particular",
  "Rappi",
  "PedidosYa",
  "Delivery propio",
  "Retiro en local",
];

interface Item {
  pizza: string;
  cantidad: number;
}

interface Ticket {
  _id: string;
  nro: string;
  metodo: string;
  prioridad: boolean;
  estado: string;
  items: Item[];
  notas?: string;
  hora?: string;
  creado: string;
}

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [nuevo, setNuevo] = useState({
    nro: "",
    metodo: "Particular",
    prioridad: false,
    items: [] as Item[],
    notas: "",
    hora: "",
  });


  const obtenerTickets = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTickets(data);
  };

  useEffect(() => {
    obtenerTickets();
  }, []);


  const handleHoraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + ":" + val.slice(2);
    }
    setNuevo({ ...nuevo, hora: val });
  };

  const sumarPizza = (pizza: string) => {
    setNuevo((prev) => {
      const existe = prev.items.find((i) => i.pizza === pizza);
      if (existe) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.pizza === pizza ? { ...i, cantidad: i.cantidad + 1 } : i
          ),
        };
      }
      return { ...prev, items: [...prev.items, { pizza, cantidad: 1 }] };
    });
  };

  const restarPizza = (pizza: string) => {
    setNuevo((prev) => {
      const item = prev.items.find((i) => i.pizza === pizza);
      if (!item) return prev;
      if (item.cantidad === 1) {
        return { ...prev, items: prev.items.filter((i) => i.pizza !== pizza) };
      }
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.pizza === pizza ? { ...i, cantidad: i.cantidad - 1 } : i
        ),
      };
    });
  };


  const crearTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevo.nro || nuevo.items.length === 0) return;

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });

    setNuevo({
      nro: "",
      metodo: "Particular",
      prioridad: false,
      items: [],
      notas: "",
      hora: "",
    });

    obtenerTickets();
  };

  const avanzarEstado = async (ticket: Ticket) => {
    const idx = ESTADOS.indexOf(ticket.estado);
    if (idx >= ESTADOS.length - 1) return;

    await fetch(`${API}/${ticket._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: ESTADOS[idx + 1] }),
    });

    obtenerTickets();
  };


  const eliminar = async (id: string) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    obtenerTickets();
  };

  return (
    <div className="app">
      <div className="layout">
        <form className="card" onSubmit={crearTicket}>
          <h2>Nueva Comanda</h2>

          <input
            placeholder="Número de pedido"
            value={nuevo.nro}
            onChange={(e) => setNuevo({ ...nuevo, nro: e.target.value })}
          />

          <select
            value={nuevo.metodo}
            onChange={(e) => setNuevo({ ...nuevo, metodo: e.target.value })}
          >
            {METODOS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <div className="pizza-grid">
            {PIZZAS.map((p) => {
              const seleccionada = nuevo.items.find((i) => i.pizza === p);
              return (
                <div key={p} className="pizza-item">
                  <button type="button" onClick={() => sumarPizza(p)}>
                    {p}
                  </button>
                  {seleccionada && (
                    <div className="contador">
                      <button type="button" onClick={() => restarPizza(p)}>
                        -
                      </button>
                      <span>{seleccionada.cantidad}</span>
                      <button type="button" onClick={() => sumarPizza(p)}>
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <textarea
            placeholder="Notas..."
            value={nuevo.notas}
            onChange={(e) => setNuevo({ ...nuevo, notas: e.target.value })}
          />

          <input
            type="text"
            placeholder="Hora entrega (HH:MM)"
            maxLength={5}
            value={nuevo.hora}
            onChange={handleHoraChange}
          />

          <label className="switch">
            <input
              type="checkbox"
              checked={nuevo.prioridad}
              onChange={(e) =>
                setNuevo({ ...nuevo, prioridad: e.target.checked })
              }
            />
            Prioridad alta
          </label>

          <button className="primary">Crear Pedido</button>
        </form>

        <div className="board">
          {tickets.map((t) => (
            <div
              key={t._id}
              className={`ticket ${t.prioridad ? "priority" : ""}`}
            >
              <div className="ticket-header">
                <strong>#{t.nro}</strong>
                <span className="estado">{t.estado}</span>
              </div>

              <div className="ticket-meta">
                <span>{t.metodo}</span>
                {t.hora && (
                  <span className="hora-despacho">Hora: {t.hora}</span>
                )}
              </div>

              <div className="items">
                {t.items.map((i) => (
                  <div key={i.pizza}>
                    {i.pizza} x{i.cantidad}
                  </div>
                ))}
              </div>

              {t.notas && <div className="notas">{t.notas}</div>}

              <div className="actions">
                {t.estado !== "DESPACHADO" && (
                  <button onClick={() => avanzarEstado(t)}>
                    Avanzar
                  </button>
                )}
                <button onClick={() => eliminar(t._id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}