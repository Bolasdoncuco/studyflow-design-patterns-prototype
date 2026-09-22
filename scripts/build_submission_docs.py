"""Build the English submission documents from the Markdown source files."""
from pathlib import Path
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "submission"

def add_markdown(doc: Document, text: str) -> None:
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("# "):
            p = doc.add_heading(line[2:], level=1)
        elif line.startswith("## "):
            p = doc.add_heading(line[3:], level=2)
        elif line.startswith("### "):
            p = doc.add_heading(line[4:], level=3)
        elif line.startswith("- "):
            p = doc.add_paragraph(style="List Bullet")
            p.add_run(line[2:])
        elif line.startswith("|"):
            # Tables are represented as readable pipe-separated paragraphs in the DOCX;
            # the Markdown source remains the authoritative submission table.
            p = doc.add_paragraph()
            p.add_run(line.replace("|", "  |  ")).font.name = "Aptos"
        else:
            p = doc.add_paragraph(line)
        p.paragraph_format.space_after = Pt(6)

def build(source: str, target: str) -> None:
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Inches(0.7)
    section.bottom_margin = Inches(0.7)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)
    styles = doc.styles
    styles["Normal"].font.name = "Aptos"
    styles["Normal"].font.size = Pt(10)
    add_markdown(doc, (OUT / source).read_text(encoding="utf-8"))
    doc.save(OUT / target)

if __name__ == "__main__":
    build("PART_A_ANALYSIS.md", "Part_A_Analysis.docx")
    build("STUDYFLOW_JUSTIFICATION.md", "StudyFlow_Justification.docx")
