
"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [filtro, setFiltro] = useState("Todas");
  const [carregado, setCarregado] = useState(false);

  // Carregar tarefas do LocalStorage
  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("minhas-tarefas");

    if (tarefasSalvas) {
      try {
        const dados = JSON.parse(tarefasSalvas);
        if (Array.isArray(dados)) {
          setTarefas(dados);
        }
      } catch {
        setTarefas([]);
      }
    }

    setCarregado(true);
  }, []);

  // Salvar tarefas no LocalStorage
  useEffect(() => {
    if (carregado) {
      localStorage.setItem("minhas-tarefas", JSON.stringify(tarefas));
    }
  }, [tarefas, carregado]);

  // Adicionar tarefa
  function adicionarTarefa(e) {
    e.preventDefault();

    if (!novaTarefa.trim()) return;

    const tarefa = {
      id: crypto.randomUUID(),
      texto: novaTarefa.trim(),
      concluida: false,
    };

    setTarefas((anterior) => [...anterior, tarefa]);
    setNovaTarefa("");
  }

  // Concluir tarefa
  function concluirTarefa(id) {
    setTarefas((anterior) =>
      anterior.map((tarefa) =>
        tarefa.id === id
          ? { ...tarefa, concluida: !tarefa.concluida }
          : tarefa
      )
    );
  }

  // Excluir tarefa
  function excluirTarefa(id) {
    setTarefas((anterior) =>
      anterior.filter((tarefa) => tarefa.id !== id)
    );
  }

  // Excluir todas as tarefas concluídas
  function limparConcluidas() {
    setTarefas((anterior) =>
      anterior.filter((tarefa) => !tarefa.concluida)
    );
  }

  // Filtrar tarefas
  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === "Pendentes") return !tarefa.concluida;
    if (filtro === "Concluídas") return tarefa.concluida;
    return true;
  });

  const totalConcluidas = tarefas.filter(
    (tarefa) => tarefa.concluida
  ).length;

  const totalPendentes = tarefas.length - totalConcluidas;

  const filtros = ["Todas", "Pendentes", "Concluídas"];

  if (!carregado) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500">Carregando tarefas...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">

        {/* Cabeçalho */}
        <header className="mb-8 text-center">
          <div className="mb-3 text-5xl">📝</div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Minha To-Do List
          </h1>

          <p className="mt-2 text-slate-500">
            Organize suas tarefas e acompanhe seu progresso.
          </p>
        </header>

        {/* Container principal */}
        <section className="rounded-2xl bg-white p-5 shadow-lg sm:p-8">

          {/* Formulário */}
          <form
            onSubmit={adicionarTarefa}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={novaTarefa}
              onChange={(e) => setNovaTarefa(e.target.value)}
              placeholder="O que você precisa fazer?"
              maxLength={150}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={!novaTarefa.trim()}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Adicionar
            </button>
          </form>

          {/* Estatísticas */}
          <div className="mt-7 grid grid-cols-3 gap-3">

            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {tarefas.length}
              </p>
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Total
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {totalPendentes}
              </p>
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Pendentes
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-center">
              <p className="text-2xl font-bold text-green-600">
                {totalConcluidas}
              </p>
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Concluídas
              </p>
            </div>

          </div>

          {/* Barra de progresso */}
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-slate-600">
                Seu progresso
              </span>

              <span className="font-bold text-blue-600">
                {tarefas.length > 0
                  ? Math.round((totalConcluidas / tarefas.length) * 100)
                  : 0}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${
                    tarefas.length > 0
                      ? (totalConcluidas / tarefas.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-800">
              Minhas tarefas
            </h2>

            <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
              {filtros.map((opcao) => (
                <button
                  key={opcao}
                  onClick={() => setFiltro(opcao)}
                  className={`rounded-md px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                    filtro === opcao
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {opcao}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de tarefas */}
          <div className="mt-5 space-y-3">

            {tarefasFiltradas.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-200 py-12 text-center">
                <div className="mb-3 text-4xl">📋</div>

                <p className="font-medium text-slate-600">
                  {tarefas.length === 0
                    ? "Nenhuma tarefa cadastrada."
                    : "Nenhuma tarefa encontrada."}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Adicione uma nova tarefa para começar!
                </p>
              </div>
            ) : (
              tarefasFiltradas.map((tarefa) => (
                <div
                  key={tarefa.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200"
                >
                  <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={tarefa.concluida}
                      onChange={() => concluirTarefa(tarefa.id)}
                      className="h-5 w-5 shrink-0 cursor-pointer accent-blue-600"
                    />

                    <span
                      className={`break-words text-sm font-medium sm:text-base ${
                        tarefa.concluida
                          ? "text-slate-400 line-through"
                          : "text-slate-700"
                      }`}
                    >
                      {tarefa.texto}
                    </span>
                  </label>

                  <button
                    onClick={() => excluirTarefa(tarefa.id)}
                    aria-label={`Excluir tarefa: ${tarefa.texto}`}
                    title="Excluir tarefa"
                    className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-700"
                  >
                    Excluir
                  </button>
                </div>
              ))
            )}

          </div>

          {/* Limpar concluídas */}
          {totalConcluidas > 0 && (
            <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
              <button
                onClick={limparConcluidas}
                className="text-sm font-semibold text-red-500 transition hover:text-red-700"
              >
                Limpar tarefas concluídas
              </button>
            </div>
          )}

        </section>

        {/* Rodapé */}
        <footer className="mt-6 text-center text-sm text-slate-400">
          Suas tarefas ficam salvas automaticamente no navegador.
        </footer>

      </div>
    </main>
  );
}
