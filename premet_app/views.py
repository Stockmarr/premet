from premet_app import app
from flask import make_response

@app.route('/')
def index():
  return make_response(open('premet_app/templates/index.html').read())
  