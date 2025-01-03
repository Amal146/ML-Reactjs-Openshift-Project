from flask import Flask, request, jsonify
from io import BytesIO
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
import os
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load the trained model
model_path = 'WheatDiseaseDetection.h5'
if not os.path.exists(model_path):
     raise FileNotFoundError(f"Model file not found: {model_path}")

model = load_model(model_path, compile=False)


# Update class labels with your dataset's actual class names
class_labels = [
    'Healthy', 'Leaf Rust', 'Stem Rust', 'Stripe Rust',
    'Powdery Mildew', 'Septoria', 'Tan Spot', 'Bacterial Blight',
    'Wheat Streak Mosaic Virus', 'Karnal Bunt', 'Yellow Rust',
    'Spot Blotch', 'Ergot', 'Black Chaff', 'Loose Smut'
]


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    try:
        # Convert the uploaded file to a BytesIO object
        img = load_img(BytesIO(file.read()), target_size=(255, 255))  # Ensure the target size matches the model's input size
        img_array = img_to_array(img) / 255.0  # Normalize pixel values to [0, 1]
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

        # Make predictions
        predictions = model.predict(img_array)
        predicted_class = class_labels[np.argmax(predictions)]  # Get class with highest probability
        confidence = np.max(predictions)

        return jsonify({
            'predicted_class': predicted_class,
            'confidence': float(confidence)
        })

    except Exception as e:
        # Log the exception to help debug
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)

