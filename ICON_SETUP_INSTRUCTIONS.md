# CVCraft Logo Icon Setup Instructions

## What Was Updated

I've updated all the icon references in your application to use the CVCraft_logo.png file:

### Files Modified:
1. **src/routes/__root.tsx** - Updated favicon and apple-touch-icon references
2. **vite.config.ts** - Updated PWA manifest icons
3. **docs/docs.json** - Updated documentation favicon

## Current Status

✅ All configuration files now point to `/logo/CVCraft_logo.png`
✅ PWA manifest updated with CVCraft branding
✅ Documentation favicon updated

## Optional: Generate Additional Icon Sizes

While the current setup uses your CVCraft_logo.png directly, you may want to generate optimized icon sizes for better performance. Here are the recommended sizes:

### Recommended Icon Sizes:
- **favicon.ico** - 32x32, 48x48 (multi-size ICO file)
- **apple-touch-icon** - 180x180
- **PWA icons** - 64x64, 192x192, 512x512
- **Maskable icon** - 512x512 (with safe zone padding)

### How to Generate Icons:

#### Option 1: Using Online Tools
1. Visit https://realfavicongenerator.net/
2. Upload your `CVCraft_logo.png`
3. Configure settings and download the generated icons
4. Place them in the `public/` directory

#### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first
# Windows: choco install imagemagick
# Mac: brew install imagemagick

# Generate different sizes
magick public/logo/CVCraft_logo.png -resize 64x64 public/pwa-64x64.png
magick public/logo/CVCraft_logo.png -resize 192x192 public/pwa-192x192.png
magick public/logo/CVCraft_logo.png -resize 512x512 public/pwa-512x512.png
magick public/logo/CVCraft_logo.png -resize 180x180 public/apple-touch-icon-180x180.png

# Generate favicon.ico (multi-size)
magick public/logo/CVCraft_logo.png -define icon:auto-resize=64,48,32,16 public/favicon.ico
```

#### Option 3: Using Sharp (Node.js)
Create a script `scripts/generate-icons.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');

const sizes = [
  { size: 64, name: 'pwa-64x64.png' },
  { size: 192, name: 'pwa-192x192.png' },
  { size: 512, name: 'pwa-512x512.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
];

async function generateIcons() {
  const input = 'public/logo/CVCraft_logo.png';
  
  for (const { size, name } of sizes) {
    await sharp(input)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(`public/${name}`);
    console.log(`✓ Generated ${name}`);
  }
  
  // Generate maskable icon with padding
  await sharp(input)
    .resize(410, 410, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 9, g: 9, b: 11, alpha: 1 } // theme_color from manifest
    })
    .png()
    .toFile('public/maskable-icon-512x512.png');
  console.log('✓ Generated maskable-icon-512x512.png');
}

generateIcons().catch(console.error);
```

Then run:
```bash
npm install sharp
node scripts/generate-icons.js
```

## Testing Your Icons

After generating icons, test them:

1. **Local Testing:**
   ```bash
   npm run dev
   ```
   - Check browser tab for favicon
   - Inspect page source for icon links

2. **PWA Testing:**
   ```bash
   npm run build
   npm run preview
   ```
   - Open DevTools > Application > Manifest
   - Verify all icons load correctly

3. **Mobile Testing:**
   - Add to home screen on iOS/Android
   - Check if the icon appears correctly

## Notes

- The current setup works fine with just the PNG file
- Generating multiple sizes is optional but recommended for:
  - Better performance (smaller file sizes for smaller icons)
  - Better quality on different devices
  - Proper maskable icon support for Android
  
- The maskable icon needs a "safe zone" - keep important content in the center 80% of the image

## Cleanup (Optional)

If you generate new optimized icons, you can remove the old ones:
```bash
del public\favicon.ico
del public\favicon.svg
del public\apple-touch-icon-180x180.png
del public\pwa-64x64.png
del public\pwa-192x192.png
del public\pwa-512x512.png
del public\maskable-icon-512x512.png
```

## Current Icon Configuration

Your app now uses:
- **Favicon:** `/logo/CVCraft_logo.png`
- **Apple Touch Icon:** `/logo/CVCraft_logo.png`
- **PWA Icons:** `/logo/CVCraft_logo.png` (all sizes)
- **Manifest Name:** CVCraft

Everything is configured and ready to use! 🎉
