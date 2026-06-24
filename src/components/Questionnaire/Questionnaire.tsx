import { useEffect, useState } from 'react';

interface Question {
  question: string;
  answer: string;
}

interface QuestionnaireProps {
  src: string;
  urlKey: string;
}

function parseCsv(text: string): Question[] {
  const lines = text.trim().split('\n');
  const questions: Question[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const commaIndex = line.indexOf(',');
    if (commaIndex === -1) continue;

    let question = line.slice(0, commaIndex).trim();
    let answer = line.slice(commaIndex + 1).trim();

    if (question.startsWith('"') && question.endsWith('"')) {
      question = question.slice(1, -1);
    }
    if (answer.startsWith('"') && answer.endsWith('"')) {
      answer = answer.slice(1, -1);
    }

    questions.push({ question, answer });
  }

  return questions;
}

export function Questionnaire({ src, urlKey }: QuestionnaireProps) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setQuestions(null);
    setError(null);
    setIndex(0);
    setRevealed(false);

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Could not load questionnaire (${res.status}).`);
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        const parsed = parseCsv(text);
        if (parsed.length === 0) throw new Error('No questions in this file.');
        setQuestions(parsed);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [src, urlKey]);

  if (error) return <p className="muted">{error}</p>;
  if (!questions) return <p className="muted">Loading questions…</p>;
  if (questions.length === 0) return <p className="muted">No questions in this file.</p>;

  const card = questions[index]!;
  const atStart = index === 0;
  const atEnd = index >= questions.length - 1;

  const goPrevious = () => {
    if (atStart) return;
    setIndex((i) => i - 1);
    setRevealed(false);
  };

  const goNext = () => {
    if (atEnd) return;
    setIndex((i) => i + 1);
    setRevealed(false);
  };

  return (
    <div className="questionnaire">
      <p className="questionnaire__progress">
        Question {index + 1} of {questions.length}
      </p>

      <div className="questionnaire__nav-row">
        <button
          type="button"
          className="questionnaire__arrow"
          onClick={goPrevious}
          disabled={atStart}
          aria-label="Previous question"
        >
          ←
        </button>

        <div className="questionnaire__card">
          <p className="questionnaire__question">{card.question}</p>
          {revealed ? (
            <div className="questionnaire__answer">
              <span className="questionnaire__answer-label">Answer</span>
              <p>{card.answer}</p>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="questionnaire__arrow"
          onClick={goNext}
          disabled={atEnd}
          aria-label="Next question"
        >
          →
        </button>
      </div>

      {!revealed ? (
        <button type="button" className="questionnaire__reveal" onClick={() => setRevealed(true)}>
          Show answer
        </button>
      ) : null}
    </div>
  );
}
