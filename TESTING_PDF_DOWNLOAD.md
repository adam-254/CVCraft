# Testing PDF Download Feature

## Overview
The PDF download feature has been fully implemented with the following workflow:
1. User edits their resume in the builder
2. User clicks the Save button (floppy disk icon) to save the rendered HTML to Supabase Storage
3. User clicks the Download PDF button to open the browser's print dialog
4. User selects "Save as PDF" in the print dialog to download the PDF

## Key Features Implemented

### 1. Save Document Button
- **Location**: Builder dock (replaced 200% zoom button)
- **Icon**: Floppy disk icon
- **Behavior**:
  - Captures the rendered HTML of the resume
  - Removes builder-specific gap styling
  - Adds print-ready CSS overrides
  - Uploads to Supabase Storage bucket "documents"
  - Updates resume record with `document_url` and `document_saved_at`
  - Shows green color when document is saved
  - Disabled while saving

### 2. Download PDF Button
- **Location**: Builder dock (rightmost button)
- **Icon**: PDF file icon
- **Behavior**:
  - Disabled until document is saved
  - Creates hidden iframe
  - Loads saved HTML from Supabase Storage
  - Triggers browser's native print dialog
  - User can save as PDF from print dialog

### 3. Vertical Page Layout
- **Builder Page**: Pages display vertically with gap spacing for editing
- **Printer Page**: Pages display vertically without gaps for printing
- **Print CSS**: Automatic page breaks between pages

## Testing Steps

### Test 1: Save Document
1. Open a resume in the builder: `http://localhost:3000/builder/{resumeId}`
2. Make some edits to the resume
3. Click the Save button (floppy disk icon) in the dock
4. Wait for success toast: "Resume document saved successfully!"
5. Verify the Save button turns green
6. Verify the Download PDF button is now enabled

### Test 2: Download PDF
1. After saving (Test 1), click the Download PDF button
2. Wait for the print dialog to open
3. Read the toast message about disabling headers and footers
4. In the print dialog:
   - Destination: Select "Save as PDF"
   - Pages: All
   - Layout: Portrait
   - Margins: Default or None
   - **IMPORTANT**: Disable "Headers and footers" option (usually under "More settings")
5. Click "Save" and choose a location
6. Verify the PDF is downloaded correctly
7. Open the PDF and verify:
   - All pages are present
   - No browser headers (date, time, URL)
   - No browser footers (page numbers)
   - No extra blank pages
   - No huge gaps between content
   - Content flows naturally
   - Styling is preserved

### Test 3: Vertical Layout
1. Open builder: `http://localhost:3000/builder/{resumeId}`
2. Verify pages are stacked vertically (not side by side)
3. Verify there's spacing between pages for editing
4. Add a new page using the + button
5. Verify the new page appears below existing pages

### Test 4: Template Changes
1. Open a resume with multiple pages
2. Change the template from the left sidebar
3. Verify ALL pages update with the new template
4. Save the document again
5. Download PDF and verify all pages use the new template

### Test 5: Saved Document Persistence
1. Save a document (Test 1)
2. Close the browser tab
3. Reopen the same resume in builder
4. Verify the Save button is green (document is saved)
5. Verify the Download PDF button is enabled
6. Click Download PDF without saving again
7. Verify it downloads the previously saved version

## Files Modified

### Core Implementation
- `src/routes/builder/$resumeId/-components/dock.tsx` - Save and download logic
- `src/integrations/orpc/services/resume.ts` - Document storage service
- `src/integrations/orpc/router/resume.ts` - API endpoints
- `src/routes/printer/$resumeId.tsx` - Printer page for loading saved HTML
- `src/styles/globals.css` - Print CSS and vertical layout

### Database
- `migrations/add_document_url_to_resume.sql` - Added columns for document storage

## Known Behaviors

### Print Dialog
- The print dialog is the browser's native dialog
- Users must manually select "Save as PDF" as the destination
- This is the standard way to generate PDFs in web applications
- No additional PDF library needed (reduces bundle size)

### Saved HTML
- HTML includes all styles inline
- Removes builder-specific gap styling
- Adds print-ready CSS overrides
- Stored in Supabase Storage bucket "documents"
- Path format: `{userId}/resumes/{resumeId}/document.html`

### Page Layout
- Builder: Vertical with gaps for editing comfort
- Printer: Vertical without gaps for clean printing
- Print CSS: Automatic page breaks between pages

## Troubleshooting

### Issue: Download button stays disabled
**Solution**: Click the Save button first to save the document

### Issue: Print dialog doesn't open
**Solution**: Check browser popup blocker settings

### Issue: PDF has extra pages or gaps
**Solution**: 
1. Save the document again (captures latest HTML)
2. Ensure print settings use "Default" or "None" margins
3. Check that content isn't forcing page breaks

### Issue: PDF shows date, time, URL, and page numbers
**Solution**: 
1. In the browser's print dialog, look for "More settings" or "Options"
2. Find and **disable** the "Headers and footers" checkbox
3. This removes the browser-generated headers (date, time, title, URL) and footers (page numbers)
4. The CSS `@page { margin: 0; }` helps, but the browser setting must be disabled manually

**Browser-specific instructions**:
- **Chrome/Edge**: More settings → uncheck "Headers and footers"
- **Firefox**: Page Setup → Margins & Header/Footer → set all to "blank"
- **Safari**: Show Details → uncheck "Print headers and footers"

### Issue: Template change only affects first page
**Solution**: This should be fixed. If it persists:
1. Check that all pages are using the same template component
2. Verify the template component handles `pageIndex` correctly

### Issue: Error "orpc.resume.getDocumentUrl.query is not a function"
**Solution**: This has been fixed. The code now uses `documentStatus?.url` directly from the `useQuery` hook instead of calling `.query()` as a function.

## API Endpoints

### Save Document
- **Endpoint**: `POST /resume/{id}/save-document`
- **Input**: `{ id: string, htmlContent: string }`
- **Output**: `{ url: string }`
- **Auth**: Protected (requires authentication)

### Get Document URL
- **Endpoint**: `GET /resume/{id}/document-url`
- **Input**: `{ id: string }`
- **Output**: `{ url: string | null }`
- **Auth**: Public (for printer page)

## Storage Structure

```
documents/
  └── {userId}/
      └── resumes/
          └── {resumeId}/
              └── document.html
```

## Database Schema

```sql
ALTER TABLE resume 
ADD COLUMN document_url TEXT,
ADD COLUMN document_saved_at TIMESTAMP WITH TIME ZONE;
```

## Success Criteria

✅ Save button captures and uploads HTML to Supabase Storage
✅ Save button turns green when document is saved
✅ Download button is disabled until document is saved
✅ Download button opens print dialog with saved HTML
✅ Pages display vertically in builder and printer
✅ Print CSS removes gaps and adds page breaks
✅ Template changes affect all pages
✅ No TypeScript errors
✅ No runtime errors in console
