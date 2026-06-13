---
name: coolify
description: "Coolify PaaS autohospedado: desplegar aplicaciones y bases de datos en tu propio servidor, despliegues basados en Docker/Git, entornos de vista previa, SSL comodín, alternativa gratuita a Heroku/Railway"
---

# Skill Coolify

## Cuándo activar
- Autohospedar un PaaS en un VPS (Hetzner, DigitalOcean, Vultr) usando Coolify
- Desplegar Docker Compose, Dockerfile o aplicaciones basadas en Git sin Kubernetes
- Configurar PostgreSQL, Redis o MongoDB administrados en tu propia infraestructura
- Crear despliegues de vista previa a partir de ramas de Git o PRs
- Migrar desde Heroku, Render o Railway a una solución autohospedada
- Configurar SSL comodín con Let's Encrypt en un dominio personalizado

## Cuándo NO usar
- Nube administrada donde no controlas el servidor (usar Railway/Vercel/Fly.io)
- Equipos que necesitan cumplimiento SOC2 del proveedor de hosting
- Cargas de trabajo que requieren auto-escalado más allá del escalado vertical

## Por qué Coolify para codificación de vibes

Coolify es el Heroku de código abierto. Posees la infraestructura, pagas solo por el VPS (~$6/mes en Hetzner) y obtienes una experiencia completa de PaaS: bases de datos con un clic, SSL automático, despliegues de Git, entornos de vista previa y un panel de control web. Elimina la fricción de despliegue sin bloqueo de proveedor — lo que lo hace ideal para bases de código generadas por IA que necesitan hosting de producción rápido.

## Instrucciones

### Instalación en un VPS

```bash
# SSH en tu servidor (Ubuntu 22.04+ recomendado)
ssh root@your-server-ip

# Instalar Coolify (en una línea)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# El panel de Coolify se ejecuta en el puerto 8000
# Acceso: http://your-server-ip:8000
# Configurar tu cuenta de administrador en la primera visita
```

**Especificaciones de VPS recomendadas:**
- Mínimo: 2 vCPU, 4GB RAM (Hetzner CX22 ~$5/mes)
- Producción: 4 vCPU, 8GB RAM (Hetzner CX32 ~$10/mes)

### Desplegar una aplicación

**Desde un repositorio de Git:**
1. Panel → Nuevo Recurso → Aplicación
2. Conectar repositorio de GitHub/GitLab
3. Seleccionar rama (ej. `main`)
4. Coolify auto-detecta: Dockerfile, Nixpacks (Node.js, Python, Ruby, Go)
5. Establecer variables de entorno
6. Desplegar

**Desde un Dockerfile:**
```dockerfile
# Coolify lee esto automáticamente desde la raíz de tu repositorio
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**Docker Compose:**
```yaml
# docker-compose.yml — Coolify despliega esto como una pila
version: '3.8'
services:
  app:
    build: .
    environment:
      DATABASE_URL: ${DATABASE_URL}
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

volumes:
  postgres_data:
```

### Bases de datos administradas

1. Panel → Nuevo Recurso → Base de datos
2. Seleccionar: PostgreSQL 16, Redis 7, MySQL, MongoDB, etc.
3. Coolify aprovisiona en tu servidor con:
   - Volumen persistente
   - Cadena de conexión interna (dentro de tu red)
   - Opcional: exponer en puerto externo con credenciales

```bash
# Conexión interna (aplicación en la misma instancia de Coolify)
DATABASE_URL=postgresql://postgres:password@coolify-db:5432/myapp

# Estas se inyectan como variables de entorno en servicios vinculados automáticamente
```

### Variables de entorno

```bash
# Establecer en panel de Coolify → Aplicación → Variables de Entorno
DATABASE_URL=postgresql://postgres:secret@coolify-db-uuid:5432/myapp
REDIS_URL=redis://:secret@coolify-redis-uuid:6379
JWT_SECRET=your-secret-here
NODE_ENV=production

# Vincular base de datos: Aplicación → Entorno → Agregar desde Base de Datos
# Coolify inyecta DATABASE_URL automáticamente desde la base de datos vinculada
```

### Despliegues de vista previa (entornos de PR)

1. Aplicación → Fuente → Habilitar Despliegues de Vista Previa
2. Cada PR/rama obtiene su propio despliegue
3. Dominio comodín: `*.myapp.coolify.my-server.com`
4. Limpieza automática cuando la rama/PR se cierra

```yaml
# coolify.yaml — archivo de configuración opcional en raíz del repositorio
preview:
  enabled: true
  domain: preview.myapp.com
  database:
    cloneFromProduction: true   # clonar BD de prod para cada vista previa
```

### Dominios personalizados y SSL

```bash
# En el panel de Coolify → Aplicación → Dominios
# Agregar: myapp.com, www.myapp.com

# Coolify automáticamente:
# 1. Emite certificado SSL de Let's Encrypt
# 2. Configura proxy inverso de Traefik
# 3. Redirige HTTP → HTTPS
# 4. Renovación automática de certificados

# Para SSL comodín (entornos de vista previa):
# Configuración → SSL → Comodín → *.myapp.com
# Requiere desafío DNS (token de API de Cloudflare)
```

### Webhooks de despliegue (activar despliegues desde CI)

```bash
# Obtener URL de webhook de despliegue del panel de Coolify → Aplicación → Deploy Webhook

# Activar desde GitHub Actions
curl -X POST "${{ secrets.COOLIFY_WEBHOOK_URL }}" \
  -H "Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}"
```

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Coolify deploy
        run: |
          curl -X POST "$COOLIFY_WEBHOOK" \
            -H "Authorization: Bearer $COOLIFY_TOKEN"
        env:
          COOLIFY_WEBHOOK: ${{ secrets.COOLIFY_WEBHOOK_URL }}
          COOLIFY_TOKEN: ${{ secrets.COOLIFY_TOKEN }}
```

### Verificaciones de salud

```yaml
# En el panel de Coolify → Aplicación → Verificación de Salud
# O en docker-compose.yml:
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s
```

```typescript
// app/health/route.ts — requerido para verificaciones de salud de Coolify
export async function GET() {
  try {
    await db.execute('SELECT 1')  // verificar conexión a BD
    return Response.json({ status: 'ok', db: 'connected' })
  } catch {
    return Response.json({ status: 'error', db: 'disconnected' }, { status: 503 })
  }
}
```

### Copia de seguridad y restauración

```bash
# Panel de Coolify → Base de Datos → Copias de Seguridad
# Configurar: almacenamiento compatible con S3 (AWS S3, Cloudflare R2, MinIO)
# Programar: copias de seguridad diarias, retener 7 días

# Restaurar desde copia de seguridad:
# Panel → Base de Datos → Copias de Seguridad → Seleccionar copia → Restaurar
```

### Coolify vs Railway

| Característica | Coolify | Railway |
|---|---|---|
| Costo | Costo de VPS (~$6-10/mes) | Basado en uso (~$5-20/mes) |
| Control | Acceso completo del servidor | Administrado |
| Tiempo de configuración | 10 minutos | 2 minutos |
| Escalado | Vertical (manual) | Automático |
| Mejor para | Cost-sensitive, control alto | Velocidad, simplicidad |

## Ejemplo

**Usuario:** Autohospedar una aplicación Next.js + PostgreSQL en un VPS de Hetzner usando Coolify con despliegues de vista previa para PRs y SSL automático.

**Salida esperada:**
- `Dockerfile` — construcción autónoma de Next.js
- `coolify.yaml` — despliegues de vista previa habilitados
- `app/health/route.ts` — punto final de verificación de salud
- Flujo de trabajo de GitHub Actions activando webhook de Coolify en push a main
- Paso a paso: instalar Coolify → agregar repositorio de GitHub → vincular PostgreSQL → configurar dominio → habilitar vistas previas

---
