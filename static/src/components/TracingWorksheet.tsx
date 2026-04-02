import { TracingConfig } from "../types/Worksheet";

interface Props {
  config: TracingConfig;
}

const TRACING_CONTENT = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  lowercase: "abcdefghijklmnopqrstuvwxyz".split(""),
  numbers: "0123456789".split(""),
  shapes: ["●", "■", "▲", "◆", "★", "♥", "⬠", "⬡"],
};

export const TracingWorksheet = ({ config }: Props) => {
  const items = TRACING_CONTENT[config.content];

  return (
    <div className="tracing-grid">
      {items.map((item, i) => (
        <div key={i} className="tracing-row">
          <span className="tracing-model">{item}</span>
          <div className="tracing-practice">
            {Array.from({ length: config.repetitions }).map((_, j) => (
              <span key={j} className="tracing-ghost">{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
