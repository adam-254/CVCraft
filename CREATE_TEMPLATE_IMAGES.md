# Creating Template Preview Images

You need to create preview images for the new templates. Here's how:

## Required Images

Create JPG preview images in `public/templates/jpg/` for:

1. `snorlax.jpg` - Single-column with bold headers
2. `mewtwo.jpg` - Two-column elegant executive style
3. `jigglypuff.jpg` - Two-column with rounded corners
4. `squirtle.jpg` - Two-column compact tech style
5. `bulbasaur.jpg` - Two-column nature-inspired

## How to Create Preview Images

### Option 1: Screenshot from the App (Recommended)
1. Run the development server: `npm run dev`
2. Create a test resume or use an existing one
3. Go to the template selection dialog
4. Select each new template
5. Take a screenshot of the resume preview
6. Crop to show the full page
7. Save as JPG (recommended size: 800x1100px or similar A4 ratio)
8. Save to `public/templates/jpg/[template-name].jpg`

### Option 2: Use Placeholder Images Temporarily
You can temporarily copy an existing template image and rename it:

```bash
# Windows CMD
copy public\templates\jpg\onyx.jpg public\templates\jpg\snorlax.jpg
copy public\templates\jpg\chikorita.jpg public\templates\jpg\mewtwo.jpg
copy public\templates\jpg\azurill.jpg public\templates\jpg\jigglypuff.jpg
copy public\templates\jpg\ditto.jpg public\templates\jpg\squirtle.jpg
copy public\templates\jpg\leafish.jpg public\templates\jpg\bulbasaur.jpg
```

Then replace them with actual screenshots later.

### Option 3: Generate with Design Tools
1. Use Figma, Photoshop, or similar tools
2. Create a mockup based on the template design
3. Export as JPG
4. Save to the correct location

## Image Specifications

- **Format**: JPG
- **Recommended dimensions**: 800x1100px (or maintain A4 ratio)
- **File size**: Keep under 200KB for fast loading
- **Quality**: 80-90% JPG quality is sufficient
- **Content**: Show a filled resume with realistic data

## Testing

After creating the images:
1. Restart the dev server if running
2. Open the template gallery
3. Verify all new templates show their preview images
4. Check that images load quickly and look good

## Note

The app will still work without the images, but users won't see previews in the template gallery. The templates themselves will render correctly when selected.
