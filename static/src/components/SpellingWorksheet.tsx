import { SpellingConfig, SpellingWord } from "../types/Worksheet";

interface Props {
  words: SpellingWord[];
  config: SpellingConfig;
  showAnswers: boolean;
}

export const SpellingWorksheet = ({ words, config, showAnswers }: Props) => {
  return (
    <div className="spelling-list">
      {words.map((w, i) => (
        <div key={i} className="spelling-item">
          <span className="problem-number">{i + 1}.</span>
          <div className="spelling-content">
            {config.mode === "word-scramble" && (
              <>
                <span className="spelling-prompt">
                  Unscramble: <strong>{w.scrambled}</strong>
                </span>
                <span className="spelling-hint">Hint: {w.hint}</span>
                {showAnswers ? (
                  <span className="answer">{w.word}</span>
                ) : (
                  <span className="answer-line" />
                )}
              </>
            )}
            {config.mode === "fill-in-blank" && (
              <>
                <span className="spelling-prompt">
                  Fill in: <strong className="blanked-word">{w.blanked}</strong>
                </span>
                <span className="spelling-hint">Hint: {w.hint}</span>
                {showAnswers && <span className="answer">{w.word}</span>}
              </>
            )}
            {config.mode === "write-word" && (
              <>
                <span className="spelling-hint">{w.hint}</span>
                {showAnswers ? (
                  <span className="answer">{w.word}</span>
                ) : (
                  <span className="answer-line" />
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
