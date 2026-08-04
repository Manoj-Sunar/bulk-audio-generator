from fastapi import FastAPI
from src.utils.db import Base, engine
from src.user.routes import user_routes
from src.audio.route import audio_routes

Base.metadata.create_all(engine)
app=FastAPI()


app.include_router(user_routes)
app.include_router(audio_routes)