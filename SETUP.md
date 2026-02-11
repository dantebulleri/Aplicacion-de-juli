# Configuración paso a paso

## 1. Crear proyecto en Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Click en **"Agregar proyecto"**
3. Elegir un nombre (ej: `uni-tracker-juli`)
4. Desactivar Google Analytics (no es necesario) → **Crear proyecto**

## 2. Configurar Authentication

1. En el panel izquierdo: **Build → Authentication**
2. Click en **"Comenzar"**
3. En la pestaña **"Proveedores de acceso"**, habilitar **"Correo electrónico/contraseña"**
4. Guardar

## 3. Configurar Firestore

1. En el panel izquierdo: **Build → Firestore Database**
2. Click en **"Crear base de datos"**
3. Elegir ubicación (ej: `us-central1` o `southamerica-east1` para Argentina)
4. Seleccionar **"Comenzar en modo de prueba"** (después cambiamos las reglas)
5. Una vez creada, ir a la pestaña **"Reglas"** y pegar:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Click en **"Publicar"**

## 4. Obtener la configuración de Firebase

1. En la página principal del proyecto, click en el ícono **"</>"** (Web)
2. Registrar la app con un nombre (ej: `uni-tracker`)
3. Copiar los valores del objeto `firebaseConfig`

## 5. Configurar el proyecto

1. Copiar el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Abrir `.env` y pegar los valores de Firebase:
   ```
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=uni-tracker-juli.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=uni-tracker-juli
   VITE_FIREBASE_STORAGE_BUCKET=uni-tracker-juli.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## 6. Instalar dependencias y correr

```bash
npm install
npm run dev
```

La app debería abrir en `http://localhost:5173`

## 7. Usar la app

1. Crear una cuenta con email y contraseña
2. El plan de estudio se importa automáticamente al registrarse
3. Click en cualquier materia para cambiar su estado, poner nota o fecha
4. Si necesitás re-importar el plan (ej: después de actualizarlo), usar el botón **"Re-importar plan"**

## Estructura de datos en Firestore

```
users/
  {uid}/
    subjects/
      {subjectId}/
        nombre: string
        anio: number
        cuatrimestre: string
        horas: number | null
        correlativas: string[]
        estado: "pendiente" | "en_curso" | "aprobada"
        nota: number | null
        fechaAprobacion: string | null
```

## Deploy (opcional)

Para publicar la app gratis en Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Seleccionar "dist" como directorio público
# Configurar como SPA: "Yes"
npm run build
firebase deploy
```
