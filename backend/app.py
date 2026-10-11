
from flask import Flask
from flask_cors import CORS

from config.settings import Settings
from routes import health_bp, info_bp

app = Flask(__name__)
app.config.from_object(Settings)

CORS(app)

app.register_blueprint(health_bp, url_prefix="/api")
app.register_blueprint(info_bp, url_prefix="/api")


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=app.config["PORT"],
        debug=False
    )