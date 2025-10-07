# Utilise une image Python légère
FROM python:3.10-slim

# Définit le répertoire de travail
WORKDIR /app

# Copie les dépendances et installe-les
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie tout le code source et les modèles
COPY . .

# Expose le port utilisé par l'API
EXPOSE 8000

# Commande de lancement de l'API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 