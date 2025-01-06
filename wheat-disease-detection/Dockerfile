FROM python:latest


RUN mkdir /app
WORKDIR /app

COPY requirements.txt .
# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    libffi-dev \
    libssl-dev

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

ENTRYPOINT [ "python" ]
CMD [ "app.py" ]