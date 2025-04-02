"use client";

import React, { useState, FormEvent } from "react";
import { FileText, XCircle, Loader2 } from "lucide-react";

// Define the type for a single compliance check
interface ComplianceCheck {
  Clause: string;
  "Legal Rule": string;
  Reason: string;
  Violates: string;
}

// Define the type for the entire compliance data
interface ComplianceData {
  [key: string]: ComplianceCheck;
}

export default function PDFComplianceAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [complianceData, setComplianceData] = useState<ComplianceData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please select a PDF file");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);

      let response: Response | undefined;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          response = await fetch("/api/proxy/analyze", {
            method: "POST",
            body: formData,
            headers: {
              // Ensure proper logging for debugging
            },
          });
          if (response.ok) break; // Exit loop if successful
        } catch (err) {
          if (attempt === 2) throw err; // Rethrow error after final attempt
        }
      }
      // Ensure proper logging for debugging

      clearTimeout(timeoutId);

      if (!response || !response.ok) {
        throw new Error(`HTTP error! status: ${response?.status ?? "unknown"}`);
      }

      const data = await response.json();
      setComplianceData(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out after 5 minutes");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      setComplianceData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-10 tracking-tight">
      Vakeel.ai Compliance Checker
      </h1>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        {/* File Upload Section */}
        <div className="bg-gray-50 dark:bg-gray-900 p-8 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 transition-colors duration-200 
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer w-full h-full block"
              >
                {file ? (
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
                      {file.name}
                    </span>
                  </div>
                ) : (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-6"
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
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-lg mb-2 text-center">
                      Drag and drop your PDF contract here
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                      or click to browse files
                    </p>
                  </div>
                )}
              </label>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold flex py-3 px-5 rounded-md hover:bg-blue-600 transition-colors duration-300"
                disabled={isLoading || !file}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {isLoading ? "Analyzing..." : "Check Compliance"}
              </button>
            </div>

            {error && (
              <div className="mt-4 text-red-600 dark:text-red-400 flex items-center justify-center p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                <XCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>
        {/* Compliance Results Section */}
        {complianceData && (
          <div className="p-8 mt-4">
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800 dark:text-white">
              <FileText className="mr-3 h-6 w-6 text-blue-600 dark:text-blue-400" />
              Compliance Analysis Results
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border-b border-r border-gray-200 dark:border-gray-600 p-4 text-left text-gray-700 dark:text-gray-200 font-semibold w-48">
                      Status
                    </th>
                    <th className="border-b border-r border-gray-200 dark:border-gray-600 p-4 text-left text-gray-700 dark:text-gray-200 font-semibold">
                      Clause
                    </th>
                    <th className="border-b border-r border-gray-200 dark:border-gray-600 p-4 text-left text-gray-700 dark:text-gray-200 font-semibold">
                      Legal Rule
                    </th>
                    <th className="border-b border-gray-200 dark:border-gray-600 p-4 text-left text-gray-700 dark:text-gray-200 font-semibold">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(complianceData).map(
                    ([, compliance], index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors duration-150"
                      >
                        <td className="border-b border-r border-gray-200 dark:border-gray-600 p-4 text-gray-700 dark:text-gray-300">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              compliance.Violates === "NO"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {compliance.Violates === "NO"
                              ? "Compliant"
                              : "Non-Compliant"}
                          </span>
                        </td>
                        <td className="border-b border-r border-gray-200 dark:border-gray-600 p-4 text-gray-700 dark:text-gray-300">
                          {compliance.Clause}
                        </td>
                        <td className="border-b border-r border-gray-200 dark:border-gray-600 p-4 text-gray-700 dark:text-gray-300">
                          {compliance["Legal Rule"]}
                        </td>
                        <td className="border-b border-gray-200 dark:border-gray-600 p-4 text-gray-700 dark:text-gray-300">
                          {compliance.Reason}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
