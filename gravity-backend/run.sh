NUM_WORKERS=1
TIMEOUT=300
BIND=0.0.0.0:5000
gunicorn --workers=$NUM_WORKERS --timeout=$TIMEOUT --bind=$BIND server:app 

