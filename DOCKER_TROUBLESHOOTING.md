# Docker Troubleshooting Guide - Skill Navigator

## Quick Diagnostics

### Check System Status

```bash
# See all running containers
docker-compose ps

# Check overall Docker health
docker system df

# View container resource usage
docker stats
```

---

## Common Issues & Solutions

## ❌ ERROR: Port Already in Use

### Symptoms
```
Error response from daemon: driver failed programming external connectivity on endpoint:
Bind for 0.0.0.0:5000 failed: port is already allocated
```

### Solutions

**Solution 1: Find and Kill Process Using Port**

Windows:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it (replace PID)
taskkill /PID 5000 /F
```

macOS/Linux:
```bash
# Find process
lsof -i :5000
lsof -i :5433

# Kill process
kill -9 <PID>
```

**Solution 2: Change Port in .env**

```env
PORT=5001              # Instead of 5000
DB_PORT=5434          # Instead of 5433
```

Then restart:
```bash
docker-compose down
docker-compose up -d
```

**Solution 3: Stop Conflicting Docker Container**

```bash
# List all containers (including stopped)
docker ps -a

# Stop the conflicting container
docker stop <container-id>

# Remove it
docker rm <container-id>
```

---

## ❌ ERROR: Containers Exit Immediately

### Symptoms
```
docker-compose ps shows:
skill-navigator-app    Exit 1
skill-navigator-db     Exit 127
```

### Solutions

**Check Detailed Logs**

```bash
# View full error message
docker-compose logs app

# Look for specific error strings
docker-compose logs | tail -100
```

**Common Causes & Fixes**

1. **Missing Environment Variables**
   ```bash
   # Verify .env exists
   ls -la .env
   
   # Check required variables
   cat .env | grep -E "DATABASE_URL|GEMINI_API_KEY"
   
   # Fix: Update .env with correct values
   ```

2. **Database Not Started**
   ```bash
   # Restart database first
   docker-compose up -d postgres
   
   # Wait for it to be healthy
   sleep 20
   
   # Then start app
   docker-compose up -d app
   ```

3. **Permission Denied**
   ```bash
   # Check file permissions
   ls -la Dockerfile docker-compose.yml
   
   # Fix permissions (Linux/macOS)
   chmod 644 docker-compose.yml
   chmod +x deploy.sh
   ```

---

## ❌ ERROR: Database Connection Failed

### Symptoms
```
Error: connect ECONNREFUSED 127.0.0.1:5432
Error: ENOTFOUND postgres
database is not available
```

### Diagnostics

```bash
# Check if postgres container is running
docker-compose ps postgres

# Check postgres logs for errors
docker-compose logs postgres

# Test connectivity from app container
docker-compose exec app ping postgres

# View postgres startup logs
docker-compose logs postgres | grep -i "initializing\|ready\|error"
```

### Solutions

**Solution 1: Postgres Health Check Failed**

```bash
# Wait longer for database to initialize (first time)
docker-compose up postgres -d
sleep 30
docker-compose up -d

# Check if ready
docker-compose exec postgres psql -U crisis -d learnai -c "SELECT 1;"
```

**Solution 2: Wrong Connection String**

```bash
# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Should be:
# Development: postgresql://crisis:crisis123@localhost:5433/learnai
# Docker: postgresql://crisis:crisis123@postgres:5432/learnai

# Fix and restart
docker-compose down
docker-compose up -d
```

**Solution 3: PostgreSQL Corrupt**

```bash
# Backup (if you have important data)
docker-compose exec postgres pg_dump -U crisis learnai > backup.sql

# Reset database
docker-compose down -v

# Start fresh
docker-compose up -d

# Restore if needed
docker exec -i skill-navigator-db psql -U crisis learnai < backup.sql
```

---

## ❌ ERROR: Out of Memory

### Symptoms
```
OOMKilled
Cannot allocate memory
Node.js exit code: 137
```

### Diagnostics

```bash
# Check memory usage
docker stats

# Check system memory
free -h          # Linux
vm_stat           # macOS
systeminfo        # Windows
```

### Solutions

```bash
# Reduce logging
export NODE_OPTIONS="--max-old-space-size=512"

# Reduce connections
docker-compose exec app npm config set --global production true

# Increase Docker memory allocation
# Docker Desktop Settings → Resources → Memory (increase to 4GB+)

# Rebuild without heavy dependencies
docker-compose build --no-cache --pull
```

---

## ❌ ERROR: Build Fails - "BASE image not found"

### Symptoms
```
failed to resolve reference "node:20-alpine"
ERROR: failed to solve with frontend dockerfile.v0
```

### Solutions

```bash
# Pull base images
docker pull node:20-alpine
docker pull postgres:16-alpine

# Try build again
docker-compose build --pull

# Use offline build
docker-compose build --no-cache
```

---

## ❌ ERROR: Build Too Slow

### Symptoms
- Build takes 15+ minutes
- Lots of "Downloading" messages
- Network timeouts

### Solutions

```bash
# Use BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker-compose build

# Enable inline caching
docker-compose build --progress=plain

# Use local cache
docker-compose build --cache-from=skill-navigator:latest

# Check disk space
du -sh .
docker system df
```

---

## ❌ ERROR: "No such file or directory"

### Symptoms
```
Error: ENOENT: no such file or directory, open '/app/dist/index.html'
Error: Cannot find module '@/lib/utils'
```

### Solutions

**Solution 1: Missing Built Files**

```bash
# Rebuild from scratch
docker-compose build --no-cache

# Check if dist folder exists
docker-compose exec app ls -la dist/
docker-compose exec app ls -la node_modules/
```

**Solution 2: File Path Issues**

```bash
# Check working directory
docker-compose exec app pwd

# List app directory
docker-compose exec app ls -la /app/

# Verify volumes are mounted
docker inspect skill-navigator-app | jq '.Mounts'
```

---

## ❌ ERROR: Volume Issues

### Symptoms
```
Error: volume not found
Error: no such file or directory
Files not syncing to container
```

### Solutions

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect skill-navigator-db

# Remove problematic volume
docker volume rm skill-navigator-db

# Recreate
docker-compose down -v
docker-compose up -d

# Verify volume mount
docker inspect skill-navigator-app -f '{{json .Mounts}}' | jq '.'
```

---

## ❌ ERROR: Permission Denied

### Symptoms
```
Permission denied: /app/dist
Permission denied while trying to connect to Docker daemon
```

### Solutions

**Solution 1: Docker Daemon Permission (Linux)**

```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker ps
```

**Solution 2: Container File Permissions**

```bash
# Check Dockerfile USER
docker-compose exec app whoami

# Fix permissions inside container
docker-compose exec -u root app chown -R appuser:appuser /app

# Or rebuild
docker-compose build --no-cache
```

---

## ❌ ERROR: Network Issues

### Symptoms
```
Error: getaddrinfo ENOTFOUND postgres
Error: connect ECONNREFUSED 127.0.0.1
```

### Solutions

```bash
# Check network existence
docker network ls

# Inspect network
docker network inspect skill-navigator_app-network

# Recreate network
docker-compose down
docker-compose up -d

# Test connectivity
docker-compose exec app curl http://postgres:5432
docker-compose exec app nslookup postgres
```

---

## ❌ ERROR: API Returning 502/503

### Symptoms
```
HTTP 502 Bad Gateway
HTTP 503 Service Unavailable
Connection refused
```

### Solutions

```bash
# Check if app is running
docker-compose ps app

# View app logs for errors
docker-compose logs -f app

# Test application endpoint
curl -v http://localhost:5000/health

# Restart app
docker-compose restart app

# Check dependencies
docker-compose ps postgres
```

---

## ❌ ERROR: Environment Variables Not Loaded

### Symptoms
```
Environment variable: undefined
API key not found
CORS error
```

### Solutions

```bash
# Verify .env file exists
ls -la .env

# Check .env syntax
cat .env

# Verify variables are set in container
docker-compose exec app env | grep GEMINI_API_KEY

# Verify in docker-compose.yml
docker-compose config | grep GEMINI

# Fix: Edit .env and restart
docker-compose restart app
```

---

## ❌ ERROR: Hot Reload Not Working

### Symptoms
- Changes not appearing
- Old code still running
- Docker cache not detected

### Solutions

```bash
# Clear Docker cache
docker-compose build --no-cache

# Restart with no cache
docker-compose down
docker-compose up -d --build

# Check volume mounts
docker inspect skill-navigator-app -f '{{json .Mounts}}'

# Verify original files exist
ls -la server/routes.ts
ls -la client/src/pages/
```

---

## ❌ ERROR: Logs Show Nothing

### Symptoms
- docker-compose logs returns empty
- No output when containers start
- Can't debug issues

### Solutions

```bash
# Check container is actually running
docker-compose ps

# View all output (even if container exited)
docker-compose logs --all

# Get from specific service
docker-compose logs -f postgres

# See last 200 lines
docker-compose logs --tail=200

# Filter by time
docker-compose logs --since 5m
docker-compose logs --until 1h

# Export to file
docker-compose logs > debug_logs.txt 2>&1
```

---

## ❌ ERROR: "Cannot find migrations"

### Symptoms
```
Database is empty
Tables don't exist
SQL errors on startup
```

### Solutions

```bash
# Check if migrations folder exists
ls -la migrations/

# Verify migrations in Dockerfile
grep -i "migrations" Dockerfile

# Check volume mount
docker inspect skill-navigator-db | jq '.Mounts'

# Manually run migrations
docker-compose exec postgres psql -U crisis -d learnai < migrations/*.sql

# Or check if auto-init worked
docker-compose logs postgres | grep -i "init"
```

---

## Performance Issues

### Application Slow

```bash
# Check resource usage
docker stats

# View access patterns
docker-compose logs app | grep -i "database\|query\|timeout"

# Check database performance
docker-compose exec postgres psql -U crisis -d learnai \
  -c "SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Increase memory
# Edit docker-compose.yml resources.limits.memory
```

### Build Very Slow

```bash
# Use BuildKit
export DOCKER_BUILDKIT=1

# Build with progress
docker-compose build --progress=plain

# Check network speed
docker run --rm alpine wget http://archive.alpinelinux.org -O /dev/null

# Use local registry if available
docker-compose build --cache-from=skill-navigator:latest
```

---

## Verification Checklist

After troubleshooting, verify:

```bash
# Services running
docker-compose ps

# All healthy
docker-compose ps | grep -i healthy

# Access application
curl http://localhost:5000/health
# Should return 200 OK

# Database accessible
docker-compose exec postgres psql -U crisis -d learnai -c "SELECT 1;"
# Should return 1

# View logs (no errors)
docker-compose logs | grep -i error
# Should return nothing or only warnings

# Check resources
docker stats --no-stream
# CPU and memory should be reasonable
```

---

## When Everything Fails: Nuclear Option

```bash
# CAUTION: This deletes ALL data

# Stop all containers
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Clean Docker system
docker system prune -a --volumes

# Start fresh
docker-compose build
docker-compose up -d

# Verify
docker-compose ps
```

---

## Getting Help

1. **Collect Information**
   ```bash
   # Export debug info
   docker-compose ps > debug.txt
   docker-compose logs >> debug.txt
   docker stats --no-stream >> debug.txt
   docker system df >> debug.txt
   cat .env >> debug.txt  # (remove secrets!)
   ```

2. **Search Known Issues**
   - GitHub Issues: https://github.com/docker/compose/issues
   - Stack Overflow: https://stackoverflow.com/questions/tagged/docker

3. **Check Docker Logs**
   - Windows: C:\Users\AppData\Local AppData\Docker\DockerDesktop.log
   - macOS: ~/Library/Logs/Docker Desktop.log
   - Linux: journalctl -u docker

4. **Ask for Help**
   - Include: docker-compose ps, docker-compose logs
   - Specify: OS, Docker version, reproduction steps
   - Redact: passwords, API keys, secrets

---

## Prevention: Best Practices

```bash
# Always backup before major changes
docker-compose exec postgres pg_dump -U crisis learnai > backup.sql

# Test changes in dev first
docker-compose -f docker-compose.yml up -d

# Keep Docker updated
docker-compose pull
docker pull node:20-alpine
docker pull postgres:16-alpine

# Monitor regularly
docker stats
docker system df

# Review logs periodically
docker-compose logs --since 24h | grep -i error
```

---

**Last Updated**: February 2026
**Docker Version**: 20.10+
**Compose Version**: 2.0+
