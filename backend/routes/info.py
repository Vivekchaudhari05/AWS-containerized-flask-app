
from flask import Blueprint, jsonify

from services.app_service import get_application_info

info_bp = Blueprint("info", __name__)


@info_bp.get("/info")
def info():
    return jsonify(get_application_info()), 200