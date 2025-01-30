from flask import Flask, request, jsonify
from io import BytesIO
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

# Load TFLite model
tflite_model_path = 'WheatDiseaseDetection.tflite'
interpreter = tf.lite.Interpreter(model_path=tflite_model_path)
interpreter.allocate_tensors()

# Get input and output details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Class labels
class_labels = [
    'Healthy', 'Leaf Rust', 'Stem Rust', 'Stripe Rust',
    'Powdery Mildew', 'Septoria', 'Tan Spot', 'Bacterial Blight',
    'Wheat Streak Mosaic Virus', 'Karnal Bunt', 'Yellow Rust',
    'Spot Blotch', 'Ergot', 'Black Chaff', 'Loose Smut'
]

@app.route("/")
def hello_world():
    return "Hello, Flask Python Wheat Disease Prediction App!"

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    try:
        # Preprocess the image
        img = load_img(BytesIO(file.read()), target_size=(255, 255))  # Adjust target size as needed
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0).astype(np.float32)

        # Set input tensor
        interpreter.set_tensor(input_details[0]['index'], img_array)

        # Run inference
        interpreter.invoke()

        # Get predictions
        predictions = interpreter.get_tensor(output_details[0]['index'])
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
    app.run(host='0.0.0.0', port=5000, debug=False)
