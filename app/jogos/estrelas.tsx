"use client";

// Componente de nota em estrelas (0-5). Sem onChange = só leitura
// (usado no card quando status === "terminado"); com onChange = seletor
// interativo (usado no formulário inline de conclusão).

const TOTAL_ESTRELAS = 5;

interface EstrelasProps {
  valor?: number;
  onChange?: (valor: number) => void;
}

export function Estrelas({ valor = 0, onChange }: EstrelasProps) {
  const interativo = typeof onChange === "function";

  return (
    <div
      className="flex items-center gap-0.5"
      role={interativo ? "radiogroup" : undefined}
      aria-label={
        interativo ? "Nota, de 0 a 5 estrelas" : `Nota: ${valor} de 5 estrelas`
      }
    >
      {Array.from({ length: TOTAL_ESTRELAS }, (_, indice) => {
        const numero = indice + 1;
        const preenchida = numero <= valor;

        if (!interativo) {
          return (
            <span
              key={numero}
              aria-hidden="true"
              className={preenchida ? "text-status-terminado" : "text-border"}
            >
              ★
            </span>
          );
        }

        return (
          <button
            key={numero}
            type="button"
            role="radio"
            aria-checked={numero === valor}
            aria-label={`${numero} estrela${numero > 1 ? "s" : ""}`}
            onClick={() => onChange?.(numero === valor ? 0 : numero)}
            className={`text-lg leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando ${
              preenchida
                ? "text-status-terminado"
                : "text-border hover:text-ink-muted"
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
