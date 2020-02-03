import os

name = 'CRITr'
loglevel = 'info'
errorlog = '-' 
accesslog = '-' 
bind = "0.0.0.0:8000"
logfile = os.path.join(os.getenv("HOME"), "log/gunicorn.log")
workers = 3
