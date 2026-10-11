
from flask import Blueprint, jsonify

from config.settings import Settings

health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def health():
    return jsonify({
        "status": "healthy",
        "application": Settings.APP_NAME
    }), 200