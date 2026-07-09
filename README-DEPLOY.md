# Frontend - Sanos y Salvos (EKS)

React + Vite, servido con Nginx.

## Secrets requeridos en GitHub
- `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`,   `AWS_REGION`, `EKS_CLUSTER_NAME`

## Variable de repo requerida (no secreta)
Settings → Secrets and variables → Actions → pestaña **Variables**:
- `VITE_GATEWAY_URL` = `http://<EXTERNAL-IP-del-api-gateway>:8080`

Esta URL se hornea en el build de Vite (`import.meta.env.VITE_GATEWAY_URL`, ver `src/services/api.js`), reemplazando el `localhost:8080` original que solo funcionaba en tu máquina.

## Orden real de despliegue (importante, hay dependencia circular)
1. Despliega `data` y `backend` primero.
2. Obtén la URL pública del gateway:
   ```bash
   kubectl get svc api-gateway -n sanos-salvos
   ```
3. Crea/actualiza la variable de repo `VITE_GATEWAY_URL` con esa URL.
4. Recién ahí corre (o re-corre) el workflow de `frontend` — así la imagen se construye con la URL correcta ya adentro.
5. Si el gateway cambia de URL (por ejemplo, borraste y recreaste el Service), repite desde el paso 2 y vuelve a compilar el frontend.

## Antes de desplegar el k8s
```bash
sed -i 's/TU_USUARIO_DOCKERHUB/tu_usuario_real/g' k8s/*.yaml
```

## Service LoadBalancer, no Ingress
Se quitó el Ingress con `ingressClassName: nginx` de la versión anterior porque EKS no trae ningún ingress controller instalado por defecto — hubiera quedado en `<pending>` para siempre. `k8s/01-frontend.yaml` ahora expone el frontend directo con `type: LoadBalancer`. Consulta la URL pública igual que con el gateway:
```bash
kubectl get svc frontend -n sanos-salvos
```

CORS no es un problema: el `api-gateway` ya tiene `allowedOrigins("*")` configurado, así que aunque frontend y gateway queden en dos LoadBalancers/dominios distintos, las peticiones van a funcionar.
