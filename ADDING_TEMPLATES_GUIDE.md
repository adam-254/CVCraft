# Guide: Adding New Resume Templates

This guide explains how to add new resume templates to the project.

## Overview

The project currently has 13 templates. Each template consists of:
1. A schema entry (template name)
2. A React component (template layout)
3. Metadata (description, tags, preview image)
4. Preview images (JPG for gallery)
5. Registration in the preview component

## Steps to Add a New Template

### 1. Add Template Name to Schema
**File:** `src/schema/templates.ts`

Add your template name to the `templateSchema` enum:
```typescript
export const templateSchema = z.enum([
  "azurill",
  // ... existing templates
  "your-new-template", // Add here
]);
```

If your template needs explicit print margins (no sidebar background extending to edges), add it to `printMarginTemplates`:
```typescript
export const printMarginTemplates = [
  "azurill",
  // ... existing templates
  "your-new-template", // Add if needed
] satisfies Template[] as string[];
```

### 2. Create Template Component
**File:** `src/components/resume/templates/your-new-template.tsx`

Use this structure:
```typescript
import { EnvelopeIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import { cn } from "@/utils/style";
import { getSectionComponent } from "../shared/get-section-component";
import { PageIcon } from "../shared/page-icon";
import { PageLink } from "../shared/page-link";
import { PagePicture } from "../shared/page-picture";
import { useResumeStore } from "../store/resume";
import type { TemplateProps } from "./types";

const sectionClassName = cn(
  // Add custom styling classes here
);

/**
 * Template: YourTemplateName
 */
export function YourTemplateNameTemplate({ pageIndex, pageLayout }: TemplateProps) {
  const isFirstPage = pageIndex === 0;
  const { main, sidebar, fullWidth } = pageLayout;

  return (
    <div className="template-your-name page-content">
      {isFirstPage && <Header />}
      
      {/* Your layout structure here */}
    </div>
  );
}

function Header() {
  const basics = useResumeStore((state) => state.resume.data.basics);
  
  return (
    <div className="page-header">
      {/* Header layout with basics.name, basics.headline, etc. */}
    </div>
  );
}
```

### 3. Add Template Metadata
**File:** `src/dialogs/resume/template/data.ts`

Add metadata for your template:
```typescript
export const templates = {
  // ... existing templates
  "your-new-template": {
    name: "Your Template Name",
    description: msg`Description of your template and ideal use cases.`,
    imageUrl: "/templates/jpg/your-new-template.jpg",
    tags: ["Tag1", "Tag2", "Tag3"],
    sidebarPosition: "left" | "right" | "none",
  },
} as const satisfies Record<Template, TemplateMetadata>;
```

### 4. Register in Preview Component
**File:** `src/components/resume/preview.tsx`

Add import:
```typescript
import { YourTemplateNameTemplate } from "./templates/your-new-template";
```

Add to `getTemplateComponent` function:
```typescript
function getTemplateComponent(template: Template) {
  return match(template)
    // ... existing templates
    .with("your-new-template", () => YourTemplateNameTemplate)
    .exhaustive();
}
```

### 5. Create Preview Images
**Directory:** `public/templates/jpg/`

Create a preview image named `your-new-template.jpg` (screenshot of the template).

## Template Design Tips

### Layout Types
- **Single-column**: Simple, ATS-friendly, traditional
- **Two-column**: Modern, visual, space-efficient
- **Sidebar**: Colored/styled sidebar for visual interest

### Key Components
- `PagePicture`: Profile photo
- `PageLink`: Clickable links
- `PageIcon`: Custom icons
- `getSectionComponent`: Renders resume sections

### CSS Variables Available
- `--page-margin-x`: Horizontal page margin
- `--page-margin-y`: Vertical page margin
- `--page-gap-x`: Horizontal gap between elements
- `--page-gap-y`: Vertical gap between elements
- `--page-primary-color`: Primary theme color
- `--page-background-color`: Background color
- `--page-sidebar-width`: Sidebar width (if applicable)

### Naming Convention
Use Pokemon names (current pattern) or any unique identifier.

## Testing Your Template

1. Run the development server: `npm run dev`
2. Create/edit a resume
3. Go to template selection
4. Select your new template
5. Verify layout on different page sizes
6. Test print preview

## Common Patterns

### Two-Column with Sidebar
```typescript
<div className="flex gap-x-(--page-gap-x)">
  <aside className="page-sidebar w-(--page-sidebar-width)">
    {/* Sidebar sections */}
  </aside>
  <main className="page-main grow">
    {/* Main sections */}
  </main>
</div>
```

### Single-Column
```typescript
<main className="page-main space-y-(--page-gap-y)">
  {main.map((section) => {
    const Component = getSectionComponent(section, { sectionClassName });
    return <Component key={section} id={section} />;
  })}
</main>
```

### Header with Contact Info
```typescript
<div className="page-header">
  <PagePicture />
  <h2 className="basics-name">{basics.name}</h2>
  <p className="basics-headline">{basics.headline}</p>
  
  <div className="basics-items">
    {basics.email && (
      <div className="basics-item-email">
        <EnvelopeIcon />
        <PageLink url={`mailto:${basics.email}`} label={basics.email} />
      </div>
    )}
    {/* More contact items */}
  </div>
</div>
```

## Need Help?

- Check existing templates in `src/components/resume/templates/`
- Simpler templates: `onyx.tsx`, `kakuna.tsx`, `lapras.tsx`
- Complex templates: `azurill.tsx`, `chikorita.tsx`, `ditgar.tsx`
