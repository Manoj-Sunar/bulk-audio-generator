from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, Enum, Text, LargeBinary, func
from sqlalchemy.orm import relationship
from src.utils.db import Base
import enum

class GenerationStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class AudioGeneration(Base):
    __tablename__ = "audio_generations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Encrypted JSON array of ElevenLabs API keys (Fernet‑encrypted then base64)
    encrypted_api_keys = Column(Text, nullable=False)

    # Script chunks – array of strings (split by double newline)
    script_chunks = Column(JSON, nullable=False, default=list)

    voice_id = Column(String(100), nullable=False)
    model_id = Column(String(50), nullable=False)

    status = Column(Enum(GenerationStatus), default=GenerationStatus.PENDING)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship to audio segments
    segments = relationship("AudioSegment", back_populates="generation", cascade="all, delete-orphan")
    user = relationship("User", back_populates="audio_generations")


class AudioSegment(Base):
    __tablename__ = "audio_segments"

    id = Column(Integer, primary_key=True, index=True)
    generation_id = Column(Integer, ForeignKey("audio_generations.id", ondelete="CASCADE"), nullable=False, index=True)

    index = Column(Integer, nullable=False)          # order in the batch
    title = Column(String(255), nullable=False)      # cleaned title
    audio_data = Column(LargeBinary, nullable=False) # MP3 bytes

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    generation = relationship("AudioGeneration", back_populates="segments")