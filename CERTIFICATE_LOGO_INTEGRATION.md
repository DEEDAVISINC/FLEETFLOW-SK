# FleetFlow University Certificate Logo Integration

## 📋 Adding Your FleetFlow Logo to Certificates

The certificate system is designed to easily accommodate your actual FleetFlow logo. Here's how to integrate it:

### 🎯 Current Implementation
- **Logo Placeholder**: Blue circular icon with truck emoji (🚛)
- **Location**: Certificate header, left side of company name
- **Size**: 80px x 80px
- **Style**: Circular with gradient background

### 🔧 How to Add Your Logo

#### Option 1: Replace with Image File
1. **Save your logo** in `/public/images/` as `fleetflow-logo.png` or `fleetflow-logo.svg`
2. **Update CertificateGenerator.tsx** (line ~88):

```typescript
<!-- Replace this placeholder -->
<div style="
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  font-weight: bold;
  border: 3px solid rgba(59, 130, 246, 0.3);
">🚛</div>

<!-- With this image -->
<img src="/images/fleetflow-logo.png" style="
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(59, 130, 246, 0.3);
  object-fit: cover;
" alt="FleetFlow Logo" />
```

#### Option 2: Base64 Encoded Image (Recommended for PDF)
1. **Convert your logo to Base64**:
   ```bash
   # On macOS/Linux
   base64 -i your-logo.png
   
   # Or use online converter
   ```

2. **Create a logo constant** in CertificateGenerator.tsx:
   ```typescript
   const FLEETFLOW_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
   ```

3. **Replace the placeholder**:
   ```typescript
   <img src="${FLEETFLOW_LOGO_BASE64}" style="
     width: 80px;
     height: 80px;
     border-radius: 50%;
     border: 3px solid rgba(59, 130, 246, 0.3);
     object-fit: cover;
   " alt="FleetFlow Logo" />
   ```

### 🎨 Logo Requirements

**Recommended Specifications:**
- **Format**: PNG with transparent background or SVG
- **Size**: 400x400px minimum (for high resolution)
- **Aspect Ratio**: 1:1 (square) works best for circular display
- **Colors**: Should work with blue accent (#3b82f6) border
- **Background**: Transparent preferred

**Design Considerations:**
- Logo will be displayed in a circle (80px diameter)
- Should be legible at small sizes
- Consider how it looks with blue border
- Ensure good contrast with white certificate background

### 📍 Files to Update

1. **CertificateGenerator.tsx** (main certificate generation)
   - Location: `/app/components/CertificateGenerator.tsx`
   - Line: ~88 (logo placeholder section)

2. **CertificatePreview.tsx** (preview page)
   - Location: `/app/certificate-preview/page.tsx`
   - Line: ~88 (visual preview section)

### 🔍 Testing Your Logo

After adding your logo:

1. **Test Certificate Generation**:
   - Visit `/certificate-preview`
   - Click "Generate Sample Certificate PDF"
   - Check logo appearance in downloaded PDF

2. **Test in Training System**:
   - Complete a quiz in `/training`
   - Generate actual certificate
   - Verify logo displays correctly

### 🚀 Advanced Customization

**Additional Branding Options:**
- Update certificate colors to match FleetFlow brand
- Modify gradient backgrounds
- Add company taglines or mottos
- Customize signature section

**Brand Color Variables** (to update throughout certificate):
```typescript
const FLEETFLOW_COLORS = {
  primary: '#your-primary-color',
  secondary: '#your-secondary-color',
  accent: '#your-accent-color',
  gradient: 'linear-gradient(135deg, #color1, #color2)'
}
```

### 📧 Email Template Logo

Don't forget to also update the email template logo in:
- **File**: `/app/api/certificates/email/route.ts`
- **Section**: Email HTML template header
- **Same process**: Replace emoji with actual logo

### ✅ Verification

After implementing your logo:
- [ ] Logo displays correctly in certificate preview
- [ ] PDF generation includes logo
- [ ] Email template shows logo
- [ ] Logo is properly sized and positioned
- [ ] Colors complement certificate design
- [ ] High resolution in PDF output

---

**Need Help?** 
Contact your development team to implement these changes or update the logo integration.
