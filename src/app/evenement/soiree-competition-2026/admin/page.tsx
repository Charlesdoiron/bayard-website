import type { Metadata } from "next";

const TALLY_FORM_ID = "b5BvoL";

export const metadata: Metadata = {
  title: "Inscriptions soirée compétition 2026",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface TallyQuestion {
  id: string;
  type: string;
  title: string;
  isDeleted: boolean;
}

interface TallySubmission {
  id: string;
  isCompleted: boolean;
  submittedAt: string;
  responses: Array<{ questionId: string; answer: unknown }>;
}

interface TallySubmissionsPage {
  hasMore: boolean;
  questions: TallyQuestion[];
  submissions: TallySubmission[];
}

async function fetchSubmissions(apiKey: string) {
  const submissions: TallySubmission[] = [];
  let questions: TallyQuestion[] = [];

  for (let page = 1; ; page++) {
    const res = await fetch(
      `https://api.tally.so/forms/${TALLY_FORM_ID}/submissions?filter=completed&limit=100&page=${page}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) throw new Error(`Tally API ${res.status}`);

    const data: TallySubmissionsPage = await res.json();
    questions = data.questions;
    submissions.push(...data.submissions);
    if (!data.hasMore) break;
  }

  return {
    questions: questions.filter((q) => !q.isDeleted),
    submissions,
  };
}

function formatAnswer(answer: unknown): string {
  if (answer == null) return "";
  if (Array.isArray(answer)) return answer.map(formatAnswer).join(", ");
  if (typeof answer === "object") return JSON.stringify(answer);
  return String(answer);
}

export default async function AdminInscriptions() {
  const apiKey = process.env.TALLY_API_KEY;
  if (!apiKey) {
    return (
      <p className="bg-gray-50 px-4 pt-40 pb-24 text-center text-gray-600">
        TALLY_API_KEY n&apos;est pas configurée.
      </p>
    );
  }

  const { questions, submissions } = await fetchSubmissions(apiKey);

  const numberQuestions = questions.filter((q) => q.type === "INPUT_NUMBER");
  const totals = numberQuestions.map((q) => ({
    title: q.title,
    total: submissions.reduce((sum, s) => {
      const answer = s.responses.find((r) => r.questionId === q.id)?.answer;
      return sum + (Number(answer) || 0);
    }, 0),
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-black px-4 pt-40 pb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Inscriptions soirée compétition 2026
        </h1>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap gap-4">
          <div className="rounded-lg bg-white px-6 py-4 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">Inscriptions</p>
            <p className="text-2xl font-semibold text-gray-900">
              {submissions.length}
            </p>
          </div>
          {totals.map((t) => (
            <div
              key={t.title}
              className="rounded-lg bg-white px-6 py-4 shadow-sm ring-1 ring-gray-200"
            >
              <p className="text-sm text-gray-500">{t.title} (total)</p>
              <p className="text-2xl font-semibold text-gray-900">{t.total}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Date
                </th>
                {questions.map((q) => (
                  <th
                    key={q.id}
                    className="px-4 py-3 text-left font-semibold text-gray-900"
                  >
                    {q.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {new Date(s.submittedAt).toLocaleString("fr-FR", {
                      timeZone: "Europe/Paris",
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  {questions.map((q) => (
                    <td key={q.id} className="px-4 py-3 text-gray-900">
                      {formatAnswer(
                        s.responses.find((r) => r.questionId === q.id)?.answer,
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {submissions.length === 0 && (
            <p className="px-4 py-8 text-center text-gray-500">
              Aucune inscription pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
