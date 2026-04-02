import { ArithmeticProblem } from "../types/Worksheet";
import { operationSymbol } from "../utils/generators";

interface Props {
  problems: ArithmeticProblem[];
  showAnswers: boolean;
}

export const ArithmeticWorksheet = ({ problems, showAnswers }: Props) => {
  return (
    <div className="worksheet-grid arithmetic-grid">
      {problems.map((p, i) => (
        <div key={i} className="problem">
          <span className="problem-number">{i + 1}.</span>
          <span className="problem-text">
            {p.a} {operationSymbol(p.operation)} {p.b} ={" "}
            {showAnswers ? (
              <span className="answer">{p.answer}</span>
            ) : (
              <span className="answer-blank">____</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};
