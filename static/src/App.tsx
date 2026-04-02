import { useCallback, useState } from "react";
import { WorksheetConfig } from "./types/Worksheet";
import { DEFAULT_ARITHMETIC_BY_GRADE } from "./utils/generators";
import { ConfigPanel } from "./components/ConfigPanel";
import { WorksheetPreview } from "./components/WorksheetPreview";
import "./css/app.css";

const defaultConfig: WorksheetConfig = {
  grade: "1",
  title: "Math Practice",
  sections: [
    {
      id: "default-1",
      type: "arithmetic",
      arithmetic: { ...DEFAULT_ARITHMETIC_BY_GRADE["1"] },
    },
  ],
};

export const App = () => {
  const [config, setConfig] = useState<WorksheetConfig>(defaultConfig);
  const [regenerateKey, setRegenerateKey] = useState(0);

  const handleRegenerate = useCallback(() => {
    setRegenerateKey((k) => k + 1);
  }, []);

  const [printWithAnswers, setPrintWithAnswers] = useState(false);

  const handlePrint = useCallback((withAnswers: boolean) => {
    setPrintWithAnswers(withAnswers);
    // Wait for state to apply before printing
    requestAnimationFrame(() => {
      window.print();
    });
  }, []);

  return (
    <div className={`app ${printWithAnswers ? "print-with-answers" : "print-without-answers"}`}>
      <header className="app-header no-print">
        <h1>KidCharts</h1>
        <p>Printable worksheets for kids</p>
      </header>
      <main className="app-main">
        <aside className="no-print">
          <ConfigPanel
            config={config}
            onChange={setConfig}
            onRegenerate={handleRegenerate}
            onPrint={handlePrint}
          />
        </aside>
        <section className="preview-area">
          <WorksheetPreview config={config} regenerateKey={regenerateKey} />
        </section>
      </main>
    </div>
  );
};
