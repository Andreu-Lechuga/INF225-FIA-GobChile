# 🔧 Guía de Solución Simple - Autenticación Supabase

## 🎯 Problemas que Resuelve

✅ **Usuarios fantasma** - Elimina usuarios antiguos que permiten login sin perfil  
✅ **Signup bloqueado** - Arregla el registro que falla por problemas de roles  
✅ **Desincronización** - Sincroniza `auth.users` con la tabla `profiles`  

## 📋 Pasos a Seguir (EN ORDEN)

### **Paso 1: Backup (Opcional)**
Si tienes datos importantes en `boletines`, haz un backup desde Supabase Dashboard.

### **Paso 2: Reset Completo**
1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Ejecuta el archivo: `complete-auth-reset.sql`
3. Ve a **Authentication** → **Users** → Eliminar TODOS los usuarios manualmente

### **Paso 3: Recrear Schema**
1. En **SQL Editor**, ejecuta: `simple-auth-schema.sql`
2. Verifica que no hay errores en la consola

### **Paso 4: CORREGIR PROBLEMA DE ROLES**
1. En **SQL Editor**, ejecuta: `fix-role-trigger-corrected.sql`
2. Esto elimina el fallback "usuario-publico" y usa exactamente el rol seleccionado

### **Paso 5: Verificar Variables de Entorno**
Asegúrate de tener en tu `.env.local`:
```env
REACT_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima
```

### **Paso 6: Probar Asignación de Roles**
```bash
cd INF225_2025_1/boletin-app
npm install @supabase/supabase-js dotenv
node test-role-assignment.js
```

### **Paso 7: Probar en la App**
1. `npm start`
2. Ve a `/signup`
3. Registra un usuario nuevo con rol "administrador"
4. Verifica que el perfil se crea con rol "administrador"

## 🔍 Qué Cambió

### **Schema Simplificado**
- Tabla `profiles` más robusta
- Trigger que NUNCA falla
- Usernames únicos automáticos
- Roles validados pero flexibles

### **Contexto Mejorado**
- Validaciones simplificadas
- Manejo de errores robusto
- Sin validaciones complejas que fallan

### **Trigger Super Robusto**
```sql
-- Si falla todo, crea perfil mínimo
INSERT INTO profiles (id, username, role)
VALUES (NEW.id, 'user_' || substring(NEW.id::text, 1, 8), 'usuario-publico');
```

## ✅ Verificaciones

Después de seguir los pasos, deberías poder:

1. **Registrar usuarios nuevos** sin errores
2. **Hacer login** con las credenciales nuevas
3. **Ver el perfil** cargado correctamente
4. **No poder hacer login** con credenciales antiguas

## 🚨 Si Algo Falla

### Error: "Tabla profiles no existe"
- Ejecuta `simple-auth-schema.sql` nuevamente
- Verifica que no hay errores en SQL Editor

### Error: "Variables de entorno"
- Verifica `.env.local` en la raíz del proyecto
- Reinicia el servidor de desarrollo

### Error: "Trigger no funciona"
- Ve a Supabase Dashboard → Database → Functions
- Verifica que existe `handle_new_user()`

### Usuarios fantasma persisten
- Ve a Authentication → Users
- Elimina TODOS los usuarios manualmente
- Ejecuta `complete-auth-reset.sql` nuevamente

## 📞 Testing Rápido

```bash
# Test completo
node test-auth-simple.js

# Si pasa todos los tests, tu autenticación funciona ✅
```

## 🎉 Resultado Final

Después de seguir esta guía tendrás:
- ✅ Sistema de autenticación limpio y funcional
- ✅ Registro que siempre crea perfiles
- ✅ Login que funciona correctamente
- ✅ Sin usuarios fantasma
- ✅ Roles funcionando sin problemas

---

**⚠️ IMPORTANTE**: Sigue los pasos EN ORDEN. No te saltes ninguno.
