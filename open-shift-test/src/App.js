import React, { useState } from "react";
import "./App.css";

const handleFileUpload = async (file, setResults) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to analyze the image");
    }

    const data = await response.json();
    setResults({ class: data.predicted_class, confidence: data.confidence });
  } catch (error) {
    console.error(error);
    setResults({ error: "Failed to process the image. Please try again." });
  }
};

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      handleFileUpload(selectedFile, setResults);
    } else {
      setResults({ error: "Please select a file before analyzing." });
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Wheat Disease Detection</h1>
        <p>Upload an image to detect wheat plant diseases</p>
      </header>
      <main className="app-main">
        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            className="file-input"
            onChange={handleFileChange}
          />
          <button className="upload-button" onClick={handleAnalyzeClick}>
            Analyze
          </button>
        </div>
        <div className="results-section">
          <h2>Results</h2>
          {results ? (
            results.error ? (
              <p className="error-message">{results.error}</p>
            ) : (
              <div>
                <p>
                  <strong>Predicted Class:</strong> {results.class}
                </p>
                <p>
                  <strong>Confidence:</strong>{" "}
                  {(results.confidence * 100).toFixed(2)}%
                </p>
              </div>
            )
          ) : (
            <p>No results yet. Upload an image to start the analysis.</p>
          )}
        </div>
      </main>
      <footer className="app-footer">
        <p>Powered by Machine Learning</p>
      </footer>
    </div>
  );
}

export default App;
