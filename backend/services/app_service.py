
from config.settings import Settings


def get_application_info():
    return {
        "application": Settings.APP_NAME,
        "environment": Settings.APP_ENV,
        "message": "Flask backend is running"
    }
