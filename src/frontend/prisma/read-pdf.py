import os
import sys

pdf_path = r"C:\Users\Lenovo\Desktop\basharai\BASHAR_ALMUNTASER_FlowCV_Resume_2026-07-08.pdf"
txt_path = r"C:\Users\Lenovo\Desktop\basharai\src\frontend\prisma\resume_text.txt"

try:
    import pypdf
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {e}")
