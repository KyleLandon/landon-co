from pathlib import Path
import pymupdf

output = Path("/tmp/landon-pricing")
output.mkdir(exist_ok=True)
with pymupdf.open("attached_assets/Landon_&_Co.___2026_Price_Sheet_Template_1791084276249.pdf") as document:
    for index, page in enumerate(document):
        page.get_pixmap(matrix=pymupdf.Matrix(1, 1)).save(output / f"page-{index + 1}.png")
    (output / "source.txt").write_text("\n".join(page.get_text() for page in document))
    print(f"Rendered {len(document)} pricing pages to {output}")