"""
MaharashtraDiaries Desktop Application
Uses PyWebView for a native desktop experience with Flask backend
"""

import sys
import os
import threading
import time
import webview
from flask import Flask, send_from_directory

# Initialize Flask app
app = Flask(
    __name__,
    static_folder=os.path.dirname(os.path.abspath(__file__)),
    static_url_path=''
)

# Store the webview window reference
window = None


@app.route('/')
def index():
    """Serve dashboard"""
    return send_from_directory(os.path.dirname(__file__), 'dashboard.html')


@app.route('/<path:filename>')
def serve_file(filename):
    """Serve any HTML file"""
    file_path = os.path.join(os.path.dirname(__file__), filename)
    if os.path.exists(file_path):
        return send_from_directory(os.path.dirname(__file__), filename)
    return "File not found", 404


@app.route('/css/<path:filename>')
def serve_css(filename):
    """Serve CSS files"""
    return send_from_directory(
        os.path.join(os.path.dirname(__file__), 'css'), 
        filename
    )


@app.route('/js/<path:filename>')
def serve_js(filename):
    """Serve JavaScript files"""
    return send_from_directory(
        os.path.join(os.path.dirname(__file__), 'js'), 
        filename
    )


@app.route('/images/<path:filename>')
def serve_images(filename):
    """Serve image files"""
    return send_from_directory(
        os.path.join(os.path.dirname(__file__), 'images'), 
        filename
    )


class Api:
    """API for Python-JavaScript communication"""
    
    def open_external(self, url):
        """Open URL in external browser"""
        import webbrowser
        webbrowser.open(url)
    
    def get_version(self):
        """Get app version"""
        return "1.0.0"


def run_flask():
    """Run Flask server"""
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=False,
        use_reloader=False,
        threaded=True,
        use_evalex=False
    )


def get_icon_path():
    """Get the path to the app icon"""
    # Try .ico file first (Windows native format)
    icon_path = os.path.join(os.path.dirname(__file__), 'maharashtra_diaries.ico')
    if os.path.exists(icon_path):
        return icon_path
    # Fallback to PNG
    icon_path = os.path.join(os.path.dirname(__file__), 'app-icon.png')
    if os.path.exists(icon_path):
        return icon_path
    return None


def main():
    """Main application entry point"""
    
    # Start Flask server in background thread
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()
    
    # Give server time to start
    time.sleep(1)
    
    # Create the webview window
    api = Api()
    window = webview.create_window(
        title='MaharashtraDiaries',
        url='http://127.0.0.1:5000/',
        js_api=api,
        width=1280,
        height=800,
        min_size=(800, 600),
        background_color='#667eea',
        fullscreen=False
    )
    
    # Start the webview
    webview.start(debug=False)


if __name__ == '__main__':
    main()
