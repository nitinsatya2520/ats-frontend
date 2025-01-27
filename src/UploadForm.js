// src/UploadForm.js

import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
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
    formData.append('resume', resume);
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post('http://localhost:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFeedback(response.data);
    } catch (err) {
      setError("Error occurred while analyzing the resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <h2>ATS Resume Checker</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Resume (PDF):</label>
          <input type="file" onChange={handleFileChange} accept=".pdf" />
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
        <button type="submit" disabled={loading}>Analyze</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {feedback && (
        <div className="feedback">
          <h3>Analysis Results</h3>
          <p><strong>Overall Score:</strong> {feedback.overall_score}</p>
          <p><strong>Matched Keywords:</strong> {feedback.matched_keywords.join(', ')}</p>
          <p><strong>Missing Keywords:</strong> {feedback.missing_keywords.join(', ')}</p>

          <h4>Category Scores:</h4>
          <ul>
            {Object.keys(feedback.category_scores).map((category) => (
              <li key={category}>
                {category}: {feedback.category_scores[category]}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
