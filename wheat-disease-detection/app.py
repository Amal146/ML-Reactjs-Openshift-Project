from flask import Flask, request, jsonify
from io import BytesIO
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
import tensorflow as tf
from flask_cors import CORS
import logging

# Initialize Flask app
app = Flask(__name__)

# Allowed origins for CORS
allowed_origins = ['http://front-maythistime.apps.eu46r.prod.ole.redhat.com']
CORS(app, resources={r"/*": {"origins": allowed_origins}}, supports_credentials=True)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths for model files
model_path = 'WheatDiseaseDetection.h5'

# Load model
try:
    model = load_model(model_path, compile=False)
    logger.info(f"Loaded model from {model_path}.")
except OSError:
    logger.error(f"Failed to load {model_path}. Attempting to load SavedModel format.")
    try:
        model = tf.keras.models.load_model('WheatDiseaseDetection_Converted.h5')
        logger.info("Loaded model from SavedModel format.")
    except Exception as e:
        logger.error(f"Failed to load model in any format: {str(e)}")
        raise e

# Class labels
class_labels = [
    'Healthy', 'Leaf Rust', 'Stem Rust', 'Stripe Rust',
    'Powdery Mildew', 'Septoria', 'Tan Spot', 'Bacterial Blight',
    'Wheat Streak Mosaic Virus', 'Karnal Bunt', 'Yellow Rust',
    'Spot Blotch', 'Ergot', 'Black Chaff', 'Loose Smut'
]


@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    try:
        img = load_img(BytesIO(file.read()), target_size=(255, 255))  # Adjust target size as needed
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array)
        predicted_class = class_labels[np.argmax(predictions)]
        confidence = np.max(predictions)

        return jsonify({
            'predicted_class': predicted_class,
            'confidence': float(confidence)
        })

    except Exception as e:
        logger.error("Error during prediction", exc_info=True)
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
