import pymupdf4llm
filename = "blockchainmeetsdatabase"
md_text = pymupdf4llm.to_markdown("pdfs/"+filename+".pdf")
with open("pymudres/"+filename+".md", "w") as output:
    output.write(md_text)

