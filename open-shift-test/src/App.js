import React, { useEffect, useState } from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAd1ZtKcvtXLRywmTsvgT8HpM5tjTV2AJ4"); // Replace with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

function WheatChatbot() {
  const [userMessage, setUserMessage] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUserMessageChange = (event) => {
    setUserMessage(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const context =
        "You are a chatbot specializing in wheat agriculture. Answer only questions related to wheat diseases, wheat care, or providing help to wheat farmers. If the question isn't related to wheat agriculture, politely say you can't answer.";

      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: context }],
          },
          {
            role: "model",
            parts: [
              { text: "Great. What would you like to know?" },
            ],
          },
        ],
      });

      let result = await chat.sendMessageStream(userMessage);
      let fullResponse = "";

      for await (const chunk of result.stream) {
        fullResponse += chunk.text();
      }

      setBotResponse(fullResponse);
    } catch (error) {
      console.error("Error fetching response:", error);
      setBotResponse("Sorry, there was an error processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1em", whiteSpace: "pre-wrap" }}>
        {botResponse}
      </div>
      <TextField
        label="Ask about wheat"
        value={userMessage}
        onChange={handleUserMessageChange}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </Button>
    </div>
  );
}

const hostname = window.location.hostname;
const serverAddress = window.location.href;
const backendPort = 5000;
var u = process.env.UNITS;
const handleFileUpload = async (file, setResults) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch(
      "http://py-maythistime.apps.eu46r.prod.ole.redhat.com/predict",
      {
        method: "POST",
        body: formData,
      }
    );

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
const fetchWeatherData = async (city) => {
  console.log(u);
  const apiKey = process.env.OWM_API_KEY || "9818a0c6454076d8184c24772aee1252";
  const units = process.env.UNITS || "metric";
  u = units;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Weather unit:", process.env.UNITS);
    return data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw error; // Ensure the error is thrown so it can be caught and handled properly
  }
};

function WeatherSection() {
  const [weather, setWeather] = useState(null);
  const [wheatState, setWheatState] = useState("Loading...");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Fetch today's date
    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    // Fetch weather data
    const fetchWeather = async () => {
      const data = await fetchWeatherData("Tunis"); // Replace with your preferred city
      setWeather(data);

      if (data) {
        const temp = data.main.temp;
        const humidity = data.main.humidity;

        // Determine wheat state based on weather
        if (temp >= 15 && temp <= 25 && humidity >= 50 && humidity <= 70) {
          setWheatState("Healthy Growth");
        } else if (temp > 30 || humidity < 30) {
          setWheatState("Risk of Disease");
        } else {
          setWheatState("Mild Stress");
        }
      }
    };

    fetchWeather();
  }, []);
  return (
    <div className="weather-section">
      <h2>🌤️ Weather Analysis</h2>
      <p>
        <strong>Today's Date:</strong> {currentDate}
      </p>
      {weather ? (
        <div>
          <p>
            <strong>City:</strong> {weather.name}
          </p>
          <p>
            <strong>Temperature:</strong> {weather.main.temp}°{" "}
            {u === "imperial" ? "F" : "C"}
          </p>
          <p>
            <strong>Humidity:</strong> {weather.main.humidity} %
          </p>
          <p>
            <strong>Wheat State:</strong> {wheatState}
          </p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}

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
    fetch("http://backend01-maythistime.apps.eu46r.prod.ole.redhat.com/")
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
          <WeatherSection />
          <div className="upload-section">
            <h2> ⬇️ Upload an image to detect wheat plant diseases</h2>
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
            <h2> 📊 Results</h2>
            {results ? (
              results.error ? (
                <p className="error-message">{results.error}</p>
              ) : (
                <div>
                  <p>
                    <strong>Predicted Disease:</strong> {results.class}
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
          <div className="chatbot-section">
            <h1> 🤖 Wheat Agriculture Chatbot</h1>
            <WheatChatbot />
          </div>
        </div>
        <div className="right-column">
          {/* Image Section */}
          <div className="image-section">
            <h2> 🌱 Wheat Growth Cycle</h2>
            <img
              src="https://www.researchgate.net/publication/348914371/figure/fig1/AS:11431281212007549@1702521204173/The-growth-cycle-of-winter-wheat-represented-by-the-time-series-of-remotely-sensed.tif"
              alt="The growth cycle of winter wheat"
              className="wheat-growth-cycle-image"
            />
            <p className="image-source">
              Source:{" "}
              <a
                href="https://www.researchgate.net/publication/348914371"
                target="_blank"
                rel="noopener noreferrer"
              >
                ResearchGate
              </a>
            </p>
          </div>

          {/* Diseases Table */}
          <div className="diseases-table">
            <h2 className="table-title"> 🌾 Wheat Disease Symptoms</h2>
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
        <p>
          Running on host: {hostname} ({serverAddress})
        </p>
      </footer>
    </div>
  );
}

export default App;
