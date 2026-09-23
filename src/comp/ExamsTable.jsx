import React from "react";
import { useAppData } from "../context/AppDataContext";

const fontStyle = {
  fontFamily: "'antsValley', sans-serif"
};

function ExamsTable() {
  const { getSubjects, loading } = useAppData();

  if (loading) {
    return (
      <div>
        <h2
          className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
          style={fontStyle}
        >
          Exams & Works
        </h2>
        <p className="text-center mt-4 text-gray-500">
          Loading exam schedule...
        </p>
      </div>
    );
  }

  const subjects = getSubjects();

  // helper to calculate remaining time
  const getTimeLeft = (dateString) => {
    if (!dateString) return "—";
    const now = new Date();
    const target = new Date(dateString);
    const diff = target - now;

    if (isNaN(target.getTime())) return "Invalid date";
    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  return (
    <div>
      <h2
        className="text-center text-[22px] font-bold mb-2 capitalize text-black tracking-wider border-b-4 border-black pb-2 md:text-start md:text-[40px]"
        style={fontStyle}
      >
        Exams & Works
      </h2>
      <div className="px-2 pb-10 md:px-0">
        {subjects.length === 0 ? (
          <p className="text-center text-gray-400">No subjects found.</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">#</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">Subject</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">Exam/Work</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">Date/Due</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">Time Left</th>
                  <th className="py-3 px-4 text-left text-gray-700 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, subjectIndex) =>
                  subject.exams.map((exam, examIndex) => {
                    if (exam.works) {
                      return exam.works.map((work, workIndex) => (
                        <tr
                          key={`${subject.name}-${work.name}`}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="py-3 px-4">
                            {`${subjectIndex + 1}.${examIndex + 1}.${workIndex + 1}`}
                          </td>
                          <td className="py-3 px-4">{subject.name}</td>
                          <td className="py-3 px-4">{work.name}</td>
                          <td className="py-3 px-4">{work.due}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {getTimeLeft(work.due)}
                          </td>
                          <td className="py-3 px-4">
                            {work.status === "true" || work.status === "done" ? (
                              <span className="text-green-600 font-semibold">✔ Done</span>
                            ) : (
                              <span className="text-red-600 font-semibold">✘ Pending</span>
                            )}
                          </td>
                        </tr>
                      ));
                    }

                    return (
                      <tr
                        key={`${subject.name}-${exam.name}`}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="py-3 px-4">{`${subjectIndex + 1}.${examIndex + 1}`}</td>
                        <td className="py-3 px-4">{subject.name}</td>
                        <td className="py-3 px-4">{exam.name}</td>
                        <td className="py-3 px-4">{exam.date || "—"}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {getTimeLeft(exam.date)}
                        </td>
                        <td className="py-3 px-4">
                          {exam.status === "true" || exam.status === "done" ? (
                            <span className="text-green-600 font-semibold">✔ Done</span>
                          ) : (
                            <span className="text-red-600 font-semibold">✘ Pending</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamsTable;
