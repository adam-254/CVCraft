# PDF Generation Fix - Dynamic Import

## Problem
The error `pdfGeneratorService is not defined` occurred because Puppeteer (used for PDF generation) can only run in Node.js (server-side), not in the browser (client-side).

## Root Cause
When using a static import like:
```typescript
import { pdfGeneratorService } from "./pdf-generator";
```

The bundler tries to include this code in the client bundle, but Puppeteer depends on Node.js APIs that don't exist in the browser.

## Solution
Use **dynamic import** to load the PDF generator only when needed on the server:

```typescript
// Inside the generatePDF method
const { pdfGeneratorService } = await import("./pdf-generator");
```

This ensures:
1. The PDF generator code is only loaded server-side
2. The client bundle doesn't include Puppeteer
3. No browser compatibility issues

## Changes Made

### File: `src/integrations/orpc/services/resume.ts`

**Before:**
```typescript
import { pdfGeneratorService } from "./pdf-generator";

// ... later in code
const pdfBuffer = await pdfGeneratorService.generatePDF(htmlContent);
```

**After:**
```typescript
// No static import at top of file

// Inside generatePDF method:
const { pdfGeneratorService } = await import("./pdf-generator");
const pdfBuffer = await pdfGeneratorService.generatePDF(htmlContent);
```

## How It Works Now

1. **Client clicks "Download PDF"** → Calls API endpoint
2. **Server receives request** → Runs `generatePDF` method
3. **Dynamic import loads Puppeteer** → Only on server, only when needed
4. **PDF is generated** → Using headless Chrome
5. **PDF is uploaded to storage** → Supabase Storage
6. **Download URL returned** → Client downloads the file

## Benefits

✅ **No client-side errors** - Puppeteer never loads in browser
✅ **Smaller client bundle** - PDF generation code excluded
✅ **Server-side only** - Proper separation of concerns
✅ **On-demand loading** - Only loads when generating PDF

## Testing

To test the fix:
1. Save a resume document
2. Click "Download PDF"
3. PDF should generate and download without errors
4. Check browser console - no "pdfGeneratorService is not defined" error

## Requirements

For this to work, the server must have:
- Node.js runtime
- Chrome/Chromium installed
- Puppeteer package installed

### Local Development
- Uses system Chrome (automatically detected)
- Paths: 
  - Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe`
  - macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
  - Linux: `/usr/bin/google-chrome`

### Production (Vercel)
For Vercel deployment, you'll need to:
1. Install `@sparticuz/chromium` package
2. Update `pdf-generator.ts` to use it in production
3. Set environment variable if needed

## Alternative Approaches Considered

1. **Client-side PDF generation** (jsPDF + html2canvas)
   - ❌ Lower quality
   - ❌ Limited CSS support
   - ❌ Larger client bundle

2. **External PDF API** (Puppeteer as a service)
   - ❌ Additional cost
   - ❌ External dependency
   - ❌ Privacy concerns

3. **Browser print dialog** (previous approach)
   - ❌ Manual steps required
   - ❌ Headers/footers issue
   - ❌ Inconsistent output

4. **Server-side Puppeteer with dynamic import** ✅ **CHOSEN**
   - ✅ High quality
   - ✅ Full CSS support
   - ✅ Automatic download
   - ✅ No manual steps

## Conclusion

The dynamic import approach provides the best balance of:
- Code quality and maintainability
- User experience (automatic download)
- PDF quality (full Chrome rendering)
- Bundle size optimization
