FROM quay.io/python:3.10-slim

ENV TF_ENABLE_ONEDNN_OPTS=0

RUN mkdir /app
WORKDIR /app

COPY requirements.txt .
# Install system dependencies
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     python3-dev \
#     libffi-dev \
#     libssl-dev

RUN pip install --no-cache-dir -r requirements.txt

COPY . .
# Copy the model files into the container
COPY WheatDiseaseDetection.h5 /app/
COPY WheatDiseaseDetection_SavedModel.keras /app/

EXPOSE 8080

ENTRYPOINT [ "python" ]
CMD [ "app.py" ]