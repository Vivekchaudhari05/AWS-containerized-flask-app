
import os


class Settings:
    APP_NAME = os.getenv("APP_NAME", "ContainerCloud")
    APP_ENV = os.getenv("APP_ENV", "development")
    PORT = int(os.getenv("PORT", "5000"))
    