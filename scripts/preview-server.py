"""Tiny static server for the production build, with SPA fallback.

Used for local verification:  python3 scripts/preview-server.py [port]
"""
import http.server
import os
import socketserver
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dist')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4173


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.translate_path(self.path)
        if (not os.path.exists(path) or os.path.isdir(path)) and not self.path.startswith('/assets'):
            self.path = '/index.html'
        return super().do_GET()

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    os.chdir(ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('127.0.0.1', PORT), Handler) as httpd:
        httpd.serve_forever()
