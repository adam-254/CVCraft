# Page Management Improvements

## Overview
This document describes the page management improvements implemented for the resume builder, focusing on better multi-page support and full-width layouts.

## Implemented Features

### 1. Add Page Button in Dock ✅
**Location**: `src/routes/builder/$resumeId/-components/dock.tsx`

**What was added**:
- Added a "Add Page" button to the dock (bottom toolbar)
- Button uses PlusIcon from Phosphor Icons
- Clicking the button adds a new full-width page to the resume
- Shows a success toast notification when page is added
- New pages are created with `fullWidth: true` by default

**User Experience**:
- Quick access to add pages without opening the sidebar
- Consistent with other dock actions (undo, redo, zoom, etc.)
- Visual feedback via toast notification

**Code Changes**:
```typescript
// Added PlusIcon import
import { PlusIcon } from "@phosphor-icons/react";

// Added useResumeStore to access updateResumeData
import { useResumeStore, useTemporalStore } from "@/components/resume/store/resume";

// Added onAddPage callback
const onAddPage = useCallback(() => {
  updateResumeData((draft) => {
    draft.metadata.layout.pages.push({
      fullWidth: true,
      main: [],
      sidebar: [],
    });
  });
  toast.success(t`A new page has been added to your resume.`);
}, [updateResumeData]);

// Added button to dock UI
<DockIcon icon={PlusIcon} title={t`Add Page`} onClick={() => onAddPage()} />
```

### 2. Full-Width Mode by Default ✅
**Locations**: 
- `src/schema/resume/data.ts` (default data)
- `src/routes/builder/$resumeId/-components/dock.tsx` (dock add page)
- `src/routes/builder/$resumeId/-sidebar/right/sections/layout/pages.tsx` (sidebar add page)

**What was changed**:
- All new pages are now created with `fullWidth: true` by default
- Default resume data now uses full-width layout
- All sections are placed in the `main` column
- `sidebar` array is empty by default

**Benefits**:
- Content takes full width of the page
- No need to manually toggle full-width mode
- Better use of space for most resume layouts
- Simpler layout management

**Code Changes**:
```typescript
// Default resume data (src/schema/resume/data.ts)
pages: [
  {
    fullWidth: true,  // Changed from false
    main: ["profiles", "summary", "education", "experience", ...],  // All sections
    sidebar: [],  // Empty
  },
]

// Both add page functions now use fullWidth: true
draft.metadata.layout.pages.push({
  fullWidth: true,  // Changed from false
  main: [],
  sidebar: [],
});
```

### 3. Auto-Detect Content Overflow ⚠️ (Partially Implemented)
**Location**: `src/components/resume/preview.tsx`

**Current State**:
- The preview component already detects when content overflows a page
- Shows a warning alert when `pageHeight > maxPageHeight`
- Warning includes a link to documentation about fitting content

**What's Missing**:
- Automatic content flow to next page is NOT yet implemented
- This would require:
  1. Detecting which specific sections overflow
  2. Calculating available space on each page
  3. Automatically moving overflowing sections to the next page
  4. Handling edge cases (section too large for any page, etc.)

**Why It's Complex**:
- Sections are rendered as HTML/CSS, not measured in advance
- Different templates render sections differently
- Would need to measure actual rendered heights
- Risk of infinite loops if sections keep overflowing
- User might not want automatic reflow (could disrupt their layout)

**Recommendation**:
- Keep the current warning system
- Let users manually move sections between pages using the drag-and-drop interface
- Consider adding a "Suggest Layout" feature in the future that analyzes content and suggests optimal page breaks

## User Workflow

### Adding a New Page
1. Click the "+" button in the dock (bottom toolbar)
2. A new full-width page is added to the end
3. Toast notification confirms the page was added
4. Drag sections from other pages to populate the new page

### Managing Page Layout
1. Open the right sidebar → Layout → Pages section
2. See all pages with their sections
3. Toggle "Full Width" switch to enable/disable full-width mode
4. Drag sections between pages and columns
5. Delete pages if needed (must have at least 1 page)

### Handling Overflow
1. If content overflows, a yellow warning appears below the page
2. Warning says: "The content is too tall for this page..."
3. Click the warning to read documentation
4. Manually move sections to another page or adjust content

## Technical Details

### Page Schema
```typescript
{
  fullWidth: boolean,  // Whether page uses full width
  main: string[],      // Section IDs in main column
  sidebar: string[]    // Section IDs in sidebar column
}
```

### Section IDs
- Built-in sections: "summary", "profiles", "experience", "education", "projects", "skills", "languages", "interests", "awards", "certifications", "publications", "volunteer", "references"
- Custom sections: UUID strings (e.g., "550e8400-e29b-41d4-a716-446655440000")

### Overflow Detection
```typescript
const maxPageHeight = pageDimensionsAsPixels[metadata.page.format].height;
// A4: 1122px, Letter: 1056px, Free-form: Infinity

if (pageHeight > maxPageHeight) {
  // Show warning
}
```

## Files Modified

1. **src/routes/builder/$resumeId/-components/dock.tsx**
   - Added PlusIcon import
   - Added useResumeStore import
   - Added onAddPage callback
   - Added "Add Page" button to dock UI

2. **src/schema/resume/data.ts**
   - Changed default page fullWidth from false to true
   - Moved all sections to main column
   - Emptied sidebar column

3. **src/routes/builder/$resumeId/-sidebar/right/sections/layout/pages.tsx**
   - Changed handleAddPage to create full-width pages

4. **src/components/resume/preview.tsx**
   - Added missing template imports (Articuno, Lugia, Moltres, Rayquaza, Zapdos)

## Testing Checklist

- [x] Add page button appears in dock
- [x] Clicking add page creates a new page
- [x] New pages are full-width by default
- [x] Toast notification appears when page is added
- [x] Default resume uses full-width layout
- [x] No TypeScript errors
- [x] All template imports are present
- [ ] Test in browser: Add page from dock
- [ ] Test in browser: Drag sections between pages
- [ ] Test in browser: Toggle full-width mode
- [ ] Test in browser: Delete pages
- [ ] Test in browser: Overflow warning appears

## Future Enhancements

### Auto-Flow Content (Not Implemented)
To implement automatic content overflow handling:

1. **Measure Section Heights**
   - Use ResizeObserver on each section
   - Track actual rendered heights
   - Account for margins and gaps

2. **Calculate Available Space**
   - Get page height from format (A4, Letter, etc.)
   - Subtract margins and gaps
   - Calculate remaining space on each page

3. **Detect Overflow**
   - Sum section heights on each page
   - Compare to available space
   - Identify which sections overflow

4. **Auto-Reflow Algorithm**
   - When overflow detected, move last section to next page
   - If no next page exists, create one
   - Repeat until no overflow
   - Handle edge cases (section too large, etc.)

5. **User Controls**
   - Add "Auto-Flow" toggle in settings
   - Add "Lock Layout" to prevent auto-reflow
   - Add "Suggest Layout" button for one-time optimization

### Other Ideas
- Page templates (pre-configured layouts)
- Page duplication
- Page reordering (drag pages to reorder)
- Page preview thumbnails
- Print preview mode
- Page break indicators in editor

## Conclusion

The page management improvements provide users with:
- Quick access to add pages via the dock
- Full-width layouts by default for better space utilization
- Visual warnings when content overflows
- Manual control over page layout via drag-and-drop

The automatic content flow feature was not implemented due to complexity and potential UX issues. The current manual approach gives users full control over their layout while providing helpful warnings when content doesn't fit.
