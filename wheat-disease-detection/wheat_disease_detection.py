import tensorflow as tf
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
import kagglehub

# Download the latest version of the dataset
path =  (r"C:\Users\amalj\OneDrive\Desktop\Cloud-Project\wheat-disease-detection\kagglehub\datasets\kushagra3204\wheat-plant-diseases\versions\6\data")

# Check if the directories exist
import os
train_path = os.path.join(path, 'train')
valid_path = os.path.join(path, 'valid')

if not os.path.exists(train_path):
    print(f"Train directory does not exist: {train_path}")
if not os.path.exists(valid_path):
    print(f"Valid directory does not exist: {valid_path}")

# Data Augmentation on train dataset
train_datagen = tf.keras.preprocessing.image.ImageDataGenerator(
    rescale=1.0/255,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True
)

# Data Augmentation on test dataset
test_datagen = tf.keras.preprocessing.image.ImageDataGenerator(
    rescale=1.0/255
)

# Prepare training data
train_generator = train_datagen.flow_from_directory(
    train_path,  # Use the correct path
    target_size=(255, 255),
    batch_size=32,
    class_mode='categorical'
)

# Prepare validation data
valid_generator = test_datagen.flow_from_directory(
    valid_path,  # Use the correct path
    target_size=(255, 255),
    batch_size=32,
    class_mode='categorical'
)

# Define the model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(255, 255, 3)),
    MaxPooling2D(pool_size=(2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(pool_size=(2, 2)),
    Flatten(),
    Dense(64, activation='relu'),
    Dense(15, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

# Train the model
history = model.fit(
    train_generator,
    epochs=10,  # Adjust as needed
    validation_data=valid_generator
)

# Save the trained model
model.save('WheatDiseaseDetection.h5')
print("Model saved successfully!")
