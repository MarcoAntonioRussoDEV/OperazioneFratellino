#!/bin/bash

# Percorsi delle directory locali e remote
FRONTEND_LOCAL_DIR="./of-frontend/dist/"
BACKEND_LOCAL_DIR="./of-backend"
REMOTE_USER="ocrama94"
REMOTE_HOST="95.246.72.155"
FRONTEND_REMOTE_DIR="/home/ocrama94/Docker/operazione_fratellino/of-frontend"
BACKEND_REMOTE_DIR="/home/ocrama94/Docker/operazione_fratellino/of-backend/target"
COMPOSE_DIR="/home/ocrama94/Docker/operazione_fratellino"

# File di log
LOG_FILE="./deploy.log"

# Funzione per loggare messaggi
log() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Inizio dello script
log "Starting deployment script..."

# Arresta i container Docker specificati dal file docker-compose.yml nella directory specificata
ssh $REMOTE_USER@$REMOTE_HOST "cd $COMPOSE_DIR && docker-compose down"

# Comando per buildare il progetto frontend
log "Building the frontend project..."
cd of-frontend
npm run build >> $LOG_FILE 2>&1 || { log "Frontend build failed"; exit 1; }
cd -

# Committa e push su GitHub
log "Pulling changes from GitHub..."
git pull origin main >> $LOG_FILE 2>&1 || { log "Git pull failed"; exit 1; }
log "Committing and pushing changes to GitHub..."
git add . >> $LOG_FILE 2>&1
git commit -m "Updated build with script" >> $LOG_FILE 2>&1
git push origin main >> $LOG_FILE 2>&1 || { log "Git push failed"; exit 1; }

# Comando SCP per copiare i file del frontend
log "Copying frontend files to the remote server..."
scp -r ${FRONTEND_LOCAL_DIR}* ${REMOTE_USER}@${REMOTE_HOST}:${FRONTEND_REMOTE_DIR} >> $LOG_FILE 2>&1

# Verifica se il comando SCP è riuscito
if [ $? -eq 0 ]; then
  log "backend copy completed successfully."
else
  log "Error during frontend copy."
fi

# Comando per buildare il progetto backend
log "Building the backend project..."
cd ${BACKEND_LOCAL_DIR}
./mvnw clean package >> $LOG_FILE 2>&1 || { log "Backend build failed"; exit 1; }
cd -

# Comando SCP per copiare il file JAR del backend
BACKEND_JAR="${BACKEND_LOCAL_DIR}/target/$(ls ${BACKEND_LOCAL_DIR}/target | grep .jar)"
log "Copying backend JAR to the remote server..."
scp -v ${BACKEND_JAR} ${REMOTE_USER}@${REMOTE_HOST}:${BACKEND_REMOTE_DIR} >> $LOG_FILE 2>&1

# Verifica se il comando SCP è riuscito
if [ $? -eq 0 ]; then
  log "Copia del file JAR del backend completata con successo."
else
  log "Errore durante la copia del file JAR del backend."
fi



# Avvia i container Docker specificati dal file docker-compose.yml nella directory specificata
ssh $REMOTE_USER@$REMOTE_HOST "cd $COMPOSE_DIR && docker-compose --build up -d"




# Fine dello script
log "Deployment script completed."
