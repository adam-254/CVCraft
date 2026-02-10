# Testing Resume Download Fix

## What Was Fixed

1. **Added Supabase import** to `src/integrations/orpc/services/resume.ts`
2. **Updated `getByIdForPrinter` method** to use Supabase client instead of Drizzle with PGlite
3. **Added storage helpers** to `src/integrations/supabase/client.ts` for future enhancements

## How to Test

### Step 1: Restart the Development Server

The changes require a server restart to take effect:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 2: Test Resume Download

1. Log in to your account
2. Go to Dashboard → Resumes
3. Open any resume in the builder
4. Click the download/print button
5. The printer route should open in a new window
6. The resume should render correctly (fetched from Supabase)
7. Press Ctrl+P (or Cmd+P on Mac) to open print dialog
8. Save as PDF or print

### Expected Behavior

- ✅ Resume data loads from Supabase database
- ✅ No "Failed query" error
- ✅ Resume renders with all content
- ✅ Print dialog opens successfully

### If Still Getting Errors

1. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check console**: Open browser DevTools → Console for detailed errors
3. **Verify environment**: Make sure `.env` has correct Supabase credentials:
   ```env
   SUPABASE_URL="https://rpuftnlafjqwbigdbqdf.supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```
4. **Rebuild**: Run `npm run build` to ensure all changes are compiled

## Technical Details

### Before (Broken)
```typescript
// Used PGlite (local database)
const [resume] = await db
  .select({...})
  .from(schema.resume)
  .where(eq(schema.resume.id, input.id));
```

### After (Fixed)
```typescript
// Uses Supabase (production database)
const { data, error } = await supabase
  .from("resume")
  .select("id, name, slug, tags, data, user_id, is_locked, updated_at")
  .eq("id", input.id)
  .single();
```

## Next Steps

Once download works, you can optionally implement the pre-rendered storage system described in `STORAGE_SETUP.md` for better performance.
