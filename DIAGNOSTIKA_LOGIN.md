# 🔍 Komplexní Diagnostika Admin Login Problemu

## 📋 Krok 1: Test Password Verification

Otevři v prohlížeči:
```
https://muzaready-iota.vercel.app/api/admin/login-test?email=admin@example.com&password=admin123
```

**Co zkontrolovat:**
- ✅ `passwordMatch: true` → Heslo funguje
- ❌ `passwordMatch: false` → Problém s heslem/hashem

---

## 📋 Krok 2: Browser Console Logging

1. Otevři **Browser Console** (F12 nebo Cmd+Option+I)
2. Jdi na **Console** tab
3. Zkus se přihlásit
4. Zkontroluj logy:
   - `Attempting login with:` → Vidíš email a délku hesla?
   - `Login response status:` → Jaký status code?
   - `Login response headers:` → Vidíš `Set-Cookie` header?

---

## 📋 Krok 3: Network Tab Analysis

1. Otevři **DevTools** → **Network** tab
2. Zkus se přihlásit
3. Najdi request na `/api/admin/login`
4. Klikni na něj a zkontroluj:

### Response Headers:
- ✅ `Set-Cookie: admin-session=...` → Cookie se nastavuje
- ✅ `X-Login-Success: true` → Login proběhl úspěšně
- ❌ Chybí `Set-Cookie` → Problém s cookie nastavením

### Response Body:
- ✅ `{"success": true, ...}` → API vrátilo úspěch
- ❌ `{"error": "..."}` → API vrátilo chybu

### Request Headers:
- ✅ `Content-Type: application/json`
- ✅ `credentials: include` (v Request)

---

## 📋 Krok 4: Cookie Inspection

1. Otevři **DevTools** → **Application** tab (Chrome) nebo **Storage** tab (Firefox)
2. Jdi na **Cookies** → `https://muzaready-iota.vercel.app`
3. Zkus se přihlásit
4. Zkontroluj:
   - ✅ Existuje cookie `admin-session`?
   - ✅ Jaká je hodnota cookie?
   - ✅ Jaké jsou atributy (HttpOnly, Secure, SameSite)?

---

## 📋 Krok 5: Middleware Check

Middleware kontroluje cookie při přístupu na `/admin`. 

**Test:**
1. Po přihlášení zkus jít přímo na: `https://muzaready-iota.vercel.app/admin`
2. Pokud tě přesměruje na `/admin/login` → Middleware nevidí cookie
3. Pokud se načte dashboard → Cookie funguje

---

## 🔧 Možné Problémy a Řešení

### Problém 1: Cookie se nenastavuje
**Příčina:** `secure: true` na HTTP (ne HTTPS)
**Řešení:** ✅ Už opraveno - používá `VERCEL` env var

### Problém 2: Cookie se nastavuje, ale middleware ho nevidí
**Příčina:** Domain mismatch nebo path problém
**Řešení:** ✅ Cookie má `path: '/'` a `domain: undefined`

### Problém 3: Password nefunguje
**Příčina:** Špatný hash nebo bcrypt vs bcryptjs
**Řešení:** ✅ Už opraveno - používá bcryptjs

### Problém 4: Redirect proběhne dřív než cookie
**Příčina:** `router.push()` je asynchronní
**Řešení:** ✅ Už opraveno - používá `window.location.href` + delay

---

## 🚀 Další Debug Kroky

Pokud problém přetrvá, pošli mi:

1. **Výstup z `/api/admin/login-test`** endpointu
2. **Console logy** z browser console
3. **Network tab screenshot** (Response Headers)
4. **Cookies tab screenshot** (Application → Cookies)

---

## 💡 Rychlý Test

Zkus tento bookmarklet (vytvoř bookmark s tímto kódem):

```javascript
javascript:(function(){fetch('/api/admin/login-test?email=admin@example.com&password=admin123').then(r=>r.json()).then(d=>alert('Password match: '+d.passwordMatch+'\nAdmin: '+d.admin?.email+'\nStatus: '+d.admin?.status)).catch(e=>alert('Error: '+e))})()
```

Klikni na bookmarklet na stránce `/admin/login` a uvidíš, jestli password funguje.

