# PM-AJAY GIA Voice Assistant - Python Backend

This is the Python/FastAPI AI processing pipeline for the **PM-AJAY GIA Multilingual Voice Assistant** (Ministry of Social Justice and Empowerment, MoSJE).

## Tech Stack
- **FastAPI**: Asynchronous voice/audio request handling & streaming.
- **Vosk**: Lightweight, offline acoustic speech-recognition library used during rural network blackouts.
- **LLaMA-3**: LLM engine for understanding natural dialectal responses, non-linear profile extraction, and GIA screening.
- **ChromaDB / Qdrant**: Vector databases for RAG semantic search over NSQF job roles and Qualification Packs (QPs).

## Setup & Running

```bash
# 1. Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Download Vosk models (small Kaldi models for offline mode)
mkdir -p models/vosk
# e.g., wget https://alphacephei.com/vosk/models/vosk-model-small-hi-0.22.zip
# unzip to models/vosk/

# 4. Start the FastAPI server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The API docs are available at `http://localhost:8000/docs`.
