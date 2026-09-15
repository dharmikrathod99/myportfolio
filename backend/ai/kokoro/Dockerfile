FROM python:3.11-slim

# Install system dependencies for audio synthesis & soundfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    espeak-ng \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install CPU-only PyTorch to minimize image size and build fast
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server code
COPY server.py .

# Expose default port
EXPOSE 8880

# Environment variables
ENV PORT=8880
ENV HOST=0.0.0.0
ENV KOKORO_VOICE=af_heart

# Run server
CMD ["python", "server.py"]
