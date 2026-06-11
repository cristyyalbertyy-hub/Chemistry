import { useEffect, useState } from 'react';

interface Question {
  question: string;
  answer: string;
}

interface QuestionnaireProps {
  src: string;
  title: string;
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

export function Questionnaire({ src, title }: QuestionnaireProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setCurrentIndex(0);
    setRevealed(false);

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error('Questionnaire not found');
        return res.text();
      })
      .then((text) => {
        const parsed = parseCsv(text);
        if (parsed.length === 0) throw new Error('No questions found');
        setQuestions(parsed);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [src]);

  if (loading) {
    return <div className="content-placeholder">Loading questionnaire…</div>;
  }

  if (error) {
    return (
      <div className="content-error">
        <p>Could not load questionnaire.</p>
        <p className="content-error-detail">{error}</p>
        <p className="content-error-file">Expected file: {src}</p>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="questionnaire">
      <div className="questionnaire-header">
        <h3>{title}</h3>
        <span className="questionnaire-counter">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="question-card">
        <p className="question-text">{current.question}</p>
        {revealed ? (
          <div className="answer-box">
            <span className="answer-label">Answer</span>
            <p className="answer-text">{current.answer}</p>
          </div>
        ) : (
          <button
            type="button"
            className="reveal-btn"
            onClick={() => setRevealed(true)}
          >
            Reveal Answer
          </button>
        )}
      </div>

      <div className="questionnaire-nav">
        <button
          type="button"
          className="nav-btn"
          disabled={currentIndex === 0}
          onClick={() => {
            setCurrentIndex((i) => i - 1);
            setRevealed(false);
          }}
        >
          Previous
        </button>
        <button
          type="button"
          className="nav-btn primary"
          disabled={currentIndex === questions.length - 1}
          onClick={() => {
            setCurrentIndex((i) => i + 1);
            setRevealed(false);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
