"use client";

import type React from "react";
import { useState } from "react";

interface Clause {
  clause: string;
  reason?: string;
  risk?: string;
}

interface Recommendation extends Clause {
  suggested_rewrite: string;
}

interface AnalysisResult {
  good_clauses: Clause[];
  risk_clauses: Clause[];
  recommendations: Recommendation[];
}

export default function RiskDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setError("");
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/risk/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the contract");
      }

      const data: AnalysisResult = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex justify-end mb-4"></div>
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-10 tracking-tight">
        Vakeel.ai Risk Detection
        </h1>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8 mb-10">
          <form onSubmit={handleSubmit}>
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-gray-50 dark:bg-gray-800"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {fileName ? (
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-white font-medium text-lg">
                    {fileName}
                  </span>
                </div>
              ) : (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400 mx-auto mb-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-600 font-medium text-lg mb-2">
                    Drag and drop your PDF contract here
                  </p>
                  <p className="text-gray-500 text-sm">
                    or click to browse files
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-center font-medium">
                {error}
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-3 px-5 rounded-md hover:bg-blue-600 transition-colors duration-300"
                disabled={isLoading || !file}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing Contract...
                  </span>
                ) : (
                  "Analyze Contract"
                )}
              </button>
            </div>
          </form>
        </div>

        {analysis && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Good Clauses Column */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500 dark:border-green-400">
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Good Clauses
                </h2>

                {analysis.good_clauses && analysis.good_clauses.length > 0 ? (
                  <div className="space-y-4">
                    {analysis.good_clauses.map(
                      (item: Clause, index: number) => (
                        <div
                          key={index}
                          className="border border-green-200 dark:border-green-600 bg-green-50 dark:bg-green-900 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
                        >
                          <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
                            {item.clause}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300">
                            <span className="font-bold text-green-600 dark:text-green-400 inline-block mb-1">
                              Why it&apos;s good:{" "}
                            </span>
                            {item.reason}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic text-center py-6">
                    No good clauses identified
                  </p>
                )}
              </div>

              {/* Risk Clauses Column */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-red-500 dark:border-red-400">
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Risk Clauses
                </h2>

                {analysis.risk_clauses && analysis.risk_clauses.length > 0 ? (
                  <div className="space-y-4">
                    {analysis.risk_clauses.map(
                      (item: Clause, index: number) => (
                        <div
                          key={index}
                          className="border border-red-200 dark:border-red-600 bg-red-50 dark:bg-red-900 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
                        >
                          <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
                            {item.clause}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300">
                            <span className="font-bold text-red-600 dark:text-red-400 inline-block mb-1">
                              Risk:{" "}
                            </span>
                            {item.risk}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic text-center py-6">
                    No risk clauses identified
                  </p>
                )}
              </div>
            </div>

            {analysis.recommendations &&
              analysis.recommendations.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-blue-500 dark:border-blue-400">
                  <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-6 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Recommendations
                  </h2>

                  <div className="space-y-6">
                    {analysis.recommendations.map(
                      (item: Recommendation, index: number) => (
                        <div
                          key={index}
                          className="border border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900 rounded-lg p-5 hover:shadow-sm transition-shadow duration-200"
                        >
                          <div className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-lg">
                            {item.clause}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 mb-4">
                            <span className="font-bold text-blue-600 dark:text-blue-400 inline-block mb-1">
                              Reason:{" "}
                            </span>
                            {item.reason}
                          </div>
                          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-blue-200 dark:border-blue-600 shadow-sm">
                            <span className="font-bold text-blue-600 dark:text-blue-400 inline-block mb-2">
                              Suggested rewrite:{" "}
                            </span>
                            <p className="text-gray-800 dark:text-gray-200 italic">
                              {item.suggested_rewrite}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
}
