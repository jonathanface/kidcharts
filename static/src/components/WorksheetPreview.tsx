import { useMemo } from "react";
import { WorksheetConfig, WorksheetSection, ArithmeticProblem, SpellingWord } from "../types/Worksheet";
import {
  generateArithmeticProblems,
  generateSpellingWords,
  GRADE_LABELS,
} from "../utils/generators";
import { ArithmeticWorksheet } from "./ArithmeticWorksheet";
import { TracingWorksheet } from "./TracingWorksheet";
import { SpellingWorksheet } from "./SpellingWorksheet";

interface Props {
  config: WorksheetConfig;
  regenerateKey: number;
}

interface GeneratedData {
  arithmetic: Map<string, ArithmeticProblem[]>;
  spelling: Map<string, SpellingWord[]>;
}

export const WorksheetPreview = ({ config, regenerateKey }: Props) => {
  const generated = useMemo<GeneratedData>(() => {
    const arithmetic = new Map<string, ArithmeticProblem[]>();
    const spelling = new Map<string, SpellingWord[]>();

    for (const section of config.sections) {
      if (section.type === "arithmetic" && section.arithmetic) {
        arithmetic.set(section.id, generateArithmeticProblems(section.arithmetic));
      }
      if (section.type === "spelling" && section.spelling) {
        spelling.set(section.id, generateSpellingWords(section.spelling, config.grade));
      }
    }

    return { arithmetic, spelling };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.sections, config.grade, regenerateKey]);

  const hasAnswers = config.sections.some(
    (s) => s.type === "arithmetic" || s.type === "spelling"
  );

  return (
    <div className="worksheet-preview" id="worksheet-print-area">
      <div className="worksheet-header">
        <h1 className="worksheet-title">{config.title || "Worksheet"}</h1>
        <p className="worksheet-grade">{GRADE_LABELS[config.grade]}</p>
        <div className="worksheet-name-line">
          Name: <span className="name-underline" />
          Date: <span className="name-underline short" />
        </div>
      </div>

      <div className="worksheet-body">
        {config.sections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            arithmeticProblems={generated.arithmetic.get(section.id)}
            spellingWords={generated.spelling.get(section.id)}
            showAnswers={false}
          />
        ))}
        {config.sections.length === 0 && (
          <p className="empty-worksheet">Add sections from the config panel to build your worksheet.</p>
        )}
      </div>

      {hasAnswers && (
        <div className="answer-key">
          <h2>Answer Key</h2>
          {config.sections.map((section) => {
            if (section.type === "tracing") return null;
            return (
              <SectionRenderer
                key={`answer-${section.id}`}
                section={section}
                arithmeticProblems={generated.arithmetic.get(section.id)}
                spellingWords={generated.spelling.get(section.id)}
                showAnswers={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

function SectionRenderer({
  section,
  arithmeticProblems,
  spellingWords,
  showAnswers,
}: {
  section: WorksheetSection;
  arithmeticProblems?: ArithmeticProblem[];
  spellingWords?: SpellingWord[];
  showAnswers: boolean;
}) {
  return (
    <div className="worksheet-section">
      {section.type === "arithmetic" && section.arithmetic && arithmeticProblems && (
        <ArithmeticWorksheet problems={arithmeticProblems} showAnswers={showAnswers} />
      )}
      {section.type === "tracing" && section.tracing && (
        <TracingWorksheet config={section.tracing} />
      )}
      {section.type === "spelling" && section.spelling && spellingWords && (
        <SpellingWorksheet
          words={spellingWords}
          config={section.spelling}
          showAnswers={showAnswers}
        />
      )}
    </div>
  );
}
