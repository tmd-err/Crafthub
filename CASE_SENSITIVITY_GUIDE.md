# Case Sensitivity Guide for Deployment

## ⚠️ IMPORTANT: This project has case-sensitive imports that must be consistent!

### Directory Structure (Correct Casing)
```
client/src/
├── Pages/           ← Capital P (NOT pages/)
├── Redux/
│   └── Slices/     ← Capital S (NOT slices/)
├── components/      ← lowercase c
├── assets/         ← lowercase a
└── hooks/          ← lowercase h
```

### File Naming Convention (Correct Casing)
```
Redux/Slices/
├── SignUpSlice.js      ← Capital S (NOT signUpSlice)
├── loginSlice.js       ← lowercase l
├── chatSlice.js        ← lowercase c
├── serviceSlice.js     ← lowercase s
├── profileSlice.js     ← lowercase p
├── reservationSlice.js ← lowercase r
└── contactSlice.js     ← lowercase c
```

### ✅ CORRECT Import Examples
```javascript
// Pages imports
import Home from './Pages/Homepage';
import Services from './Pages/Services';
import About from './Pages/About';

// Redux imports
import { signUpAsync } from '../../Redux/Slices/SignUpSlice';
import { loginAsync } from '../../Redux/Slices/loginSlice';
import { fetchServices } from '../../Redux/Slices/serviceSlice';

// Component imports
import Navbar from '../assets/Navbar';
import Service from '../components/Service/Service';
```

### ❌ INCORRECT Import Examples (Will Cause Build Failures)
```javascript
// WRONG - lowercase 'pages'
import Services from './pages/Services';

// WRONG - lowercase 'slices'
import { signUpAsync } from '../../Redux/slices/signUpSlice';

// WRONG - wrong file casing
import { signUpAsync } from '../../Redux/Slices/signUpSlice';
```

### Why This Matters
- **Windows**: Case-insensitive file system (imports work even if wrong)
- **Linux/macOS**: Case-sensitive file system (imports fail if wrong)
- **Vercel/Netlify**: Run on Linux, so case sensitivity is enforced
- **Build failures**: Happen only during deployment, not during development

### How to Prevent Future Issues
1. **Always use the exact casing** shown in the directory structure
2. **Copy-paste import paths** instead of typing them manually
3. **Use your IDE's auto-import feature** when possible
4. **Double-check imports** before committing
5. **Test builds locally** if possible before deploying

### Quick Reference
- **Directories**: `Pages/`, `Redux/Slices/`, `components/`, `assets/`
- **Files**: `SignUpSlice.js`, `loginSlice.js`, `chatSlice.js`
- **Imports**: Always match the actual file/directory names exactly

### Build Command
```bash
npm run build
```
This will now work correctly on all platforms!
