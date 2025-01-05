import React, { useEffect, useState } from "react";
import "./App.css";

const backendPort = 5000;
const handleFileUpload = async (file, setResults) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch("http://127.0.0.1:8080/predict", {
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
  const [imagePreview, setImagePreview] = useState(null);

  // Handle file change and preview the selected image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Set the selected file
      setImagePreview(URL.createObjectURL(file)); // Preview image
    }
  };

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      handleFileUpload(selectedFile, setResults);
    } else {
      setResults({ error: "Please select a file before analyzing." });
    }
  };

  // Fetch diseases data on component mount
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the backend
    fetch("http://backend0-maythistime.apps.eu46r.prod.ole.redhat.com/") 
      .then((response) => response.json())
      .then((data) => {
        setDiseases(data.diseases);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌾Wheat Disease Detection🌾</h1>
        <p>Upload an image to detect wheat plant diseases</p>
      </header>
      <main className="app-main">
        <video autoPlay loop muted id="video-background">
          <source
            src="https://videos.pexels.com/video-files/29934703/12846976_1920_1080_25fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="left-column">
          <div className="upload-section">
            {/* Image Display */}
            {imagePreview && (
              <div className="image-preview">
                <img
                  src={imagePreview}
                  alt="Uploaded Preview"
                  className="preview-image"
                />
              </div>
            )}

            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={handleFileChange}
            />

            {/* Analyze Button */}
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
        </div>
        <div className="right-column">
          {/* Diseases Table */}
          <div className="diseases-table">
            <h2 className="table-title">Wheat Disease Symptoms</h2>
            <table>
              <thead>
                <tr>
                  <th>Disease Name</th>
                  <th>Symptoms</th>
                </tr>
              </thead>
              <tbody>
                {diseases.length > 0 ? (
                  diseases.map((disease, index) => (
                    <tr key={index}>
                      <td>{disease.disease_name}</td>
                      <td>
                        <ul>
                          <li>{disease.symptom_1}</li>
                          <li>{disease.symptom_2}</li>
                          <li>{disease.symptom_3}</li>
                        </ul>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">Loading diseases...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by Machine Learning</p>
      </footer>
    </div>
  );
}

export default App;
