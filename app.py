
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/note-app')
def index():
  return render_template("index.html") 
  
  

@app.route('/sw.js', methods=["GET"])
def sw():
  return app.send_static_file('sw.js')  
  
  
if __name__ == '__main__':
    app.run()
    
   