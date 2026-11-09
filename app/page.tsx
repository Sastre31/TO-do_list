"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [filtro, setFiltro] = useState("Todas");
  const [carregou, setCarregou] = useState(false);

  useEffect(() => {
    const salvas = localStorage.getItem("tarefas");

    if (salvas) {
      try {
        setTarefas(JSON.parse(salvas));
      } catch {
        setTarefas([]);
      }
    }

    setCarregou(true);
  }, []);

  useEffect(() => {
    if (carregou) {
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
    }
  }, [tarefas, carregou]);

  function adicionarTarefa(e) {
    e.preventDefault();

    if (!novaTarefa.trim()) return;

    const tarefa = {
      id: Date.now(),
      nome: novaTarefa.trim(),
      feita: false,
    };

    setTarefas((lista) => [...lista, tarefa]);
    setNovaTarefa("");
  }

  function marcarTarefa(id) {
    setTarefas((lista) =>
      lista.map((tarefa) =>
        tarefa.id === id
          ? { ...tarefa, feita: !tarefa.feita }
          : tarefa
      )
    );
  }

  function excluirTarefa(id) {
    setTarefas((lista) =>
      lista.filter((tarefa) => tarefa.id !== id)
    );
  }

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === "Pendentes") return !tarefa.feita;
    if (filtro === "Concluídas") return tarefa.feita;
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-xl">

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            Minha To-Do List
          </h1>
        </header>

        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-8">

          <form
            onSubmit={adicionarTarefa}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={novaTarefa}
              onChange={(e) => setNovaTarefa(e.target.value)}
              placeholder="Digite uma nova tarefa..."
              className="min-w-0 flex-1 rounded-lg border border-slate-300 p-3 text-slate-800 outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-300"
            />

            <button
              type="submit"
              className="rounded-lg bg-slate-800 px-5 py-3 font-medium text-white transition hover:bg-slate-700"
            >
              Adicionar
            </button>
          </form>

          <div className="mb-4 mt-7 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Minhas tarefas
            </h2>

            <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
              Total: {tarefas.length}
            </span>
          </div>

          <div className="mb-5 flex gap-2">
            {["Todas", "Pendentes", "Concluídas"].map((opcao) => (
              <button
                key={opcao}
                type="button"
                onClick={() => setFiltro(opcao)}
                className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition ${
                  filtro === opcao
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {opcao}
              </button>
            ))}
          </div>

          <div className="space-y-3">

            {tarefasFiltradas.length === 0 ? (
              <p className="py-8 text-center text-slate-400">
                Nenhuma tarefa encontrada.
              </p>
            ) : (
              tarefasFiltradas.map((tarefa) => (
                <div
                  key={tarefa.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={tarefa.feita}
                      onChange={() => marcarTarefa(tarefa.id)}
                      className="h-5 w-5 shrink-0 accent-slate-700"
                    />

                    <span
                      className={`break-words ${
                        tarefa.feita
                          ? "text-slate-400 line-through"
                          : "text-slate-700"
                      }`}
                    >
                      {tarefa.nome}
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => excluirTarefa(tarefa.id)}
                    className="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    Excluir
                  </button>
                </div>
              ))
            )}

          </div>
        </section>
      </div>
    </main>
  );
}
