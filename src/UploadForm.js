import React, { useState, useRef } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./UploadForm.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const UploadForm = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null); // Create a reference for the file input

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setError("File size should be under 2MB.");
      return;
    }
    setResume(file);
    setError(null);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf" && file.size <= 2 * 1024 * 1024) {
      setResume(file);
      setError(null);
    } else {
      setError("Invalid file. Please upload a PDF under 2MB.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jobDescription) {
      setError("Please upload a resume and provide a job description.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post(
        "https://ats-backend-r6gx.onrender.com/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setFeedback(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error analyzing the resume.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger file input click when drop zone is clicked
  const handleDropZoneClick = () => {
    fileInputRef.current.click();
  };

  // Generate data for Doughnut chart
  const getChartData = (score) => ({
    labels: ["Score", "Remaining"],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: ["#4CAF50", "#ddd"],
        hoverBackgroundColor: ["#45a049", "#bbb"],
      },
    ],
  });

  return (
    <div className="upload-form">
      <h2>ATS Resume Checker</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Resume (PDF):</label>
          <div
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleDropZoneClick} // Trigger file input on click
          >
            {resume ? (
              <p>File: {resume.name}</p>
            ) : (
              <p>Drag and drop a PDF file here or click to select</p>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              style={{ display: "none" }}
              ref={fileInputRef} // Assign ref to the input
            />
          </div>
        </div>
        <div>
          <label>Job Description:</label>
          <textarea
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Paste job description here"
            rows="5"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {feedback && (
        <div className="feedback">
          <h3>Analysis Results</h3>

          {/* Circular Graph for Overall Score */}
          <div className="chart-container">
            <Doughnut data={getChartData(feedback.overall_score)} />
            <p className="score-text">{feedback.overall_score}%</p>
          </div>

          <p>
            <strong>Matched Keywords:</strong>{" "}
            {feedback.matched_keywords?.join(", ") || "None"}
          </p>
          <p>
            <strong>Missing Keywords:</strong>{" "}
            {feedback.missing_keywords?.join(", ") || "None"}
          </p>

          {feedback.category_scores && (
            <>
              <h4>Category Scores:</h4>
              <ul>
                {Object.entries(feedback.category_scores).map(
                  ([category, score]) => (
                    <li key={category} className={score >= 80 ? "high-score" : "low-score"}>
                      {category}: {score}%
                    </li>
                  )
                )}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadForm;
