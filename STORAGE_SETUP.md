# Document Storage Setup Guide

## Current Architecture

The application uses a **render-on-demand** approach for resume and cover letter downloads:

### How it Works

1. **Data Storage**: Resume/cover letter data is stored in Supabase PostgreSQL database
2. **Rendering**: When user clicks download, the app:
   - Opens `/printer/{resumeId}` route in a new window
   - Fetches resume data from Supabase database
   - Renders the resume using React components
   - User triggers browser's native print dialog (Ctrl+P / Cmd+P)
   - User can save as PDF or print

### Database Configuration

The app is configured to use Supabase for all data operations:

```env
SUPABASE_URL="https://rpuftnlafjqwbigdbqdf.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Recent Fix

Fixed the printer route to use Supabase client instead of local PGlite:
- Updated `src/integrations/orpc/services/resume.ts` 
- Method `getByIdForPrinter` now queries Supabase database
- Resumes are fetched from production database when downloading

## Alternative: Pre-rendered Storage (Future Enhancement)

If you want to implement pre-rendered document storage:

### Setup Supabase Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `documents`
3. Set bucket to **public** or configure RLS policies
4. Update `.env`:
   ```env
   SUPABASE_STORAGE_BUCKET="documents"
   ```

### Implementation

The groundwork has been laid in:
- `src/integrations/supabase/client.ts` - Storage helper functions
- `src/integrations/orpc/services/document-storage.ts` - Document storage service

To enable:
1. Uncomment storage upload in `src/components/resume/store/resume.ts`
2. Implement server-side HTML rendering
3. Update download flow to fetch from storage instead of rendering

### Benefits of Pre-rendered Storage

- Faster downloads (no rendering needed)
- Consistent output (same render every time)
- Reduced server load
- Version history (keep multiple versions)

### Current Benefits (Render-on-demand)

- No storage costs
- Always uses latest data
- No sync issues
- Simpler architecture
