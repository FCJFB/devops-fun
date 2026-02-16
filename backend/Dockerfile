# 1. THE BASE IMAGE
# We use a "slim" version of Python 3.11 to keep the image size small
FROM python:3.11-slim

# 2. SET THE WORKING DIRECTORY
# This creates a folder inside the container called /app and moves us into it
WORKDIR /app

# 3. INSTALL DEPENDENCIES FIRST (The Caching Trick)
# We copy ONLY the requirements file first. Docker caches this step!
# That way, if you change your Python code later, it doesn't have to re-download all the libraries.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. COPY THE REST OF THE CODE
# Now we copy main.py into the container
COPY . .

# 5. EXPOSE THE PORT
# Tell Docker that this container will listen on port 8000
EXPOSE 8000

# 6. START THE ENGINE
# This is the exact command you would run in the terminal to start FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]