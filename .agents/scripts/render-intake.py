from pathlib import Path
import fitz

output = Path("/tmp/landon-intake")
output.mkdir(exist_ok=True)
with fitz.open("attached_assets/Landon-Co-Client-Intake_-_Google_Docs_1791083029621.pdf") as document:
    for index, page in enumerate(document):
        page.get_pixmap(matrix=fitz.Matrix(1, 1)).save(output / f"page-{index + 1}.png")
    print(f"Rendered {len(document)} pages to {output}")