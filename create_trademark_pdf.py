#!/usr/bin/env python3
"""
FleetFlow Trademark Logo PDF Generator
Creates a professional PDF with the FleetFlow logo for Michigan trademark application
"""

from reportlab.lib.pagesizes import letter
from reportlab.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Image, Spacer, Paragraph, Table
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER
import os

def create_trademark_pdf():
    """Create a professional PDF with FleetFlow logo for trademark application"""

    # Output filename
    output_filename = "FleetFlow_Trademark_Application.pdf"

    # Check if logo file exists
    logo_path = "public/images/fleetflow logo tms.jpg"
    if not os.path.exists(logo_path):
        print(f"Error: Logo file not found at {logo_path}")
        return False

    # Create PDF document
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )

    # Get styles
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor='#2c3e50'
    )

    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=14,
        spaceAfter=20,
        alignment=TA_CENTER,
        textColor='#666666'
    )

    info_style = ParagraphStyle(
        'InfoStyle',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=10,
        alignment=TA_CENTER,
        textColor='#333333'
    )

    # Build content
    content = []

    # Title
    title = Paragraph("FleetFlow™ Logo", title_style)
    content.append(title)
    content.append(Spacer(1, 20))

    # Subtitle
    subtitle = Paragraph("Michigan State Trademark Application", subtitle_style)
    content.append(subtitle)
    content.append(Spacer(1, 30))

    # Logo - center and scale appropriately
    try:
        logo = Image(logo_path)
        logo.drawHeight = 3*inch  # Set height
        logo.drawWidth = 6*inch   # Set width (adjust as needed)
        logo.hAlign = 'CENTER'
        content.append(logo)
        content.append(Spacer(1, 40))
    except Exception as e:
        print(f"Error loading logo image: {e}")
        return False

    # Application information
    app_info = [
        "Application Details:",
        "",
        "Trademark: FleetFlow™",
        "Class: Computer Software and SaaS Services",
        "Industry: Transportation Management Systems",
        "Services: Business Management and Professional Services",
        "",
        "Prepared for Michigan Department of Licensing",
        "and Regulatory Affairs (LARA)"
    ]

    for info in app_info:
        if info == "Application Details:":
            content.append(Paragraph(f"<b>{info}</b>", info_style))
        else:
            content.append(Paragraph(info, info_style))

    # Build PDF
    try:
        doc.build(content)
        print(f"✅ PDF created successfully: {output_filename}")
        print(f"📄 File location: {os.path.abspath(output_filename)}")
        return True
    except Exception as e:
        print(f"Error creating PDF: {e}")
        return False

if __name__ == "__main__":
    print("🚛 FleetFlow™ Trademark PDF Generator")
    print("=" * 50)

    # Install required packages if not available
    try:
        import reportlab
    except ImportError:
        print("Installing required packages...")
        os.system("pip install reportlab")
        print("Packages installed!")

    # Create the PDF
    success = create_trademark_pdf()

    if success:
        print("\n🎯 Next Steps:")
        print("1. Open FleetFlow_Trademark_Application.pdf")
        print("2. Verify logo appears correctly")
        print("3. Submit to Michigan LARA with application")
        print("4. Include the goods/services description provided earlier")
    else:
        print("\n❌ PDF creation failed. Check error messages above.")












































