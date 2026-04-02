import {
  WorksheetConfig,
  WorksheetSection,
  GradeLevel,
  WorksheetType,
  ArithmeticOperation,
} from "../types/Worksheet";
import { GRADE_LABELS, DEFAULT_ARITHMETIC_BY_GRADE } from "../utils/generators";

interface Props {
  config: WorksheetConfig;
  onChange: (config: WorksheetConfig) => void;
  onRegenerate: () => void;
  onPrint: (withAnswers: boolean) => void;
}

let nextSectionId = 1;

function createSection(type: WorksheetType, grade: GradeLevel): WorksheetSection {
  const id = `section-${nextSectionId++}`;
  switch (type) {
    case "arithmetic":
      return { id, type, arithmetic: { ...DEFAULT_ARITHMETIC_BY_GRADE[grade] } };
    case "tracing":
      return { id, type, tracing: { content: "uppercase", repetitions: 4 } };
    case "spelling":
      return { id, type, spelling: { wordCount: 8, mode: "fill-in-blank" } };
  }
}

const TYPE_LABELS: Record<WorksheetType, string> = {
  arithmetic: "Arithmetic",
  tracing: "Tracing",
  spelling: "Spelling",
};

export const ConfigPanel = ({ config, onChange, onRegenerate, onPrint }: Props) => {
  const updateSection = (id: string, updated: Partial<WorksheetSection>) => {
    onChange({
      ...config,
      sections: config.sections.map((s) =>
        s.id === id ? { ...s, ...updated } : s
      ),
    });
  };

  const removeSection = (id: string) => {
    onChange({
      ...config,
      sections: config.sections.filter((s) => s.id !== id),
    });
  };

  const addSection = (type: WorksheetType) => {
    onChange({
      ...config,
      sections: [...config.sections, createSection(type, config.grade)],
    });
  };

  const updateGrade = (grade: GradeLevel) => {
    onChange({
      ...config,
      grade,
      sections: config.sections.map((s) =>
        s.type === "arithmetic"
          ? { ...s, arithmetic: { ...DEFAULT_ARITHMETIC_BY_GRADE[grade] } }
          : s
      ),
    });
  };

  return (
    <div className="config-panel">
      <h2>Configure Worksheet</h2>

      <label>
        Title
        <input
          type="text"
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          placeholder="My Worksheet"
        />
      </label>

      <label>
        Grade Level
        <select
          value={config.grade}
          onChange={(e) => updateGrade(e.target.value as GradeLevel)}
        >
          {Object.entries(GRADE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </label>

      <div className="sections-header">
        <h3>Sections</h3>
        <div className="add-section-buttons">
          {(["arithmetic", "tracing", "spelling"] as WorksheetType[]).map((type) => (
            <button
              key={type}
              className="btn btn-small"
              onClick={() => addSection(type)}
            >
              + {TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {config.sections.length === 0 && (
        <p className="empty-hint">Add a section to get started.</p>
      )}

      {config.sections.map((section) => (
        <div key={section.id} className="section-config">
          <div className="section-header">
            <span className="section-type-badge">{TYPE_LABELS[section.type]}</span>
            <button
              className="btn-remove"
              onClick={() => removeSection(section.id)}
              title="Remove section"
            >
              &times;
            </button>
          </div>

          {section.type === "arithmetic" && section.arithmetic && (
            <SectionArithmetic
              config={section.arithmetic}
              onChange={(arithmetic) => updateSection(section.id, { arithmetic })}
            />
          )}
          {section.type === "tracing" && section.tracing && (
            <SectionTracing
              config={section.tracing}
              onChange={(tracing) => updateSection(section.id, { tracing })}
            />
          )}
          {section.type === "spelling" && section.spelling && (
            <SectionSpelling
              config={section.spelling}
              onChange={(spelling) => updateSection(section.id, { spelling })}
            />
          )}
        </div>
      ))}

      <div className="button-group">
        <button onClick={onRegenerate} className="btn btn-secondary">
          Regenerate
        </button>
      </div>
      <div className="button-group">
        <button onClick={() => onPrint(false)} className="btn btn-primary">
          Print
        </button>
        <button onClick={() => onPrint(true)} className="btn btn-primary">
          Print with Answers
        </button>
      </div>
    </div>
  );
};

function SectionArithmetic({
  config,
  onChange,
}: {
  config: NonNullable<WorksheetSection["arithmetic"]>;
  onChange: (c: NonNullable<WorksheetSection["arithmetic"]>) => void;
}) {
  return (
    <div className="section-options">
      <label>
        Problems
        <input
          type="number"
          min={1}
          max={50}
          value={config.problemCount}
          onChange={(e) => onChange({ ...config, problemCount: parseInt(e.target.value) || 10 })}
        />
      </label>
      <div className="inline-fields">
        <label>
          Min
          <input
            type="number"
            min={0}
            value={config.minNumber}
            onChange={(e) => onChange({ ...config, minNumber: parseInt(e.target.value) || 0 })}
          />
        </label>
        <label>
          Max
          <input
            type="number"
            min={1}
            value={config.maxNumber}
            onChange={(e) => onChange({ ...config, maxNumber: parseInt(e.target.value) || 10 })}
          />
        </label>
      </div>
      <div className="checkbox-group">
        <span>Operations</span>
        {(["addition", "subtraction", "multiplication", "division"] as ArithmeticOperation[]).map((op) => (
          <label key={op} className="checkbox-label">
            <input
              type="checkbox"
              checked={config.operations.includes(op)}
              onChange={(e) => {
                const ops = e.target.checked
                  ? [...config.operations, op]
                  : config.operations.filter((o) => o !== op);
                if (ops.length === 0) return;
                onChange({ ...config, operations: ops });
              }}
            />
            {op}
          </label>
        ))}
      </div>
    </div>
  );
}

function SectionTracing({
  config,
  onChange,
}: {
  config: NonNullable<WorksheetSection["tracing"]>;
  onChange: (c: NonNullable<WorksheetSection["tracing"]>) => void;
}) {
  return (
    <div className="section-options">
      <label>
        Content
        <select
          value={config.content}
          onChange={(e) =>
            onChange({ ...config, content: e.target.value as typeof config.content })
          }
        >
          <option value="uppercase">Uppercase Letters</option>
          <option value="lowercase">Lowercase Letters</option>
          <option value="numbers">Numbers 0-9</option>
          <option value="shapes">Shapes</option>
        </select>
      </label>
      <label>
        Repetitions
        <input
          type="number"
          min={1}
          max={10}
          value={config.repetitions}
          onChange={(e) => onChange({ ...config, repetitions: parseInt(e.target.value) || 4 })}
        />
      </label>
    </div>
  );
}

function SectionSpelling({
  config,
  onChange,
}: {
  config: NonNullable<WorksheetSection["spelling"]>;
  onChange: (c: NonNullable<WorksheetSection["spelling"]>) => void;
}) {
  return (
    <div className="section-options">
      <label>
        Words
        <input
          type="number"
          min={1}
          max={10}
          value={config.wordCount}
          onChange={(e) => onChange({ ...config, wordCount: parseInt(e.target.value) || 8 })}
        />
      </label>
      <label>
        Mode
        <select
          value={config.mode}
          onChange={(e) =>
            onChange({ ...config, mode: e.target.value as typeof config.mode })
          }
        >
          <option value="fill-in-blank">Fill in the Blank</option>
          <option value="word-scramble">Word Scramble</option>
          <option value="write-word">Write the Word</option>
        </select>
      </label>
    </div>
  );
}
