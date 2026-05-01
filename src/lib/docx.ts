"use client";

import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

// Convert a subset of markdown into a DOCX document.
// Supports headings, paragraphs, bullet lists, ordered lists, GFM tables,
// fenced code blocks, blockquotes, bold (**...**) and italic (_..._/*...*/)
// inline marks, and inline `code`.

interface InlineRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
}

function parseInline(input: string): InlineRun[] {
  const runs: InlineRun[] = [];
  let i = 0;
  let buf = "";
  let bold = false;
  let italic = false;

  function flush() {
    if (buf.length > 0) {
      runs.push({ text: buf, bold, italic });
      buf = "";
    }
  }

  while (i < input.length) {
    if (input.startsWith("**", i)) {
      flush();
      bold = !bold;
      i += 2;
      continue;
    }
    if (input[i] === "_" || input[i] === "*") {
      // single underscore/asterisk for italic
      flush();
      italic = !italic;
      i += 1;
      continue;
    }
    if (input[i] === "`") {
      flush();
      const end = input.indexOf("`", i + 1);
      if (end === -1) {
        buf += input[i];
        i += 1;
      } else {
        runs.push({ text: input.slice(i + 1, end), code: true });
        i = end + 1;
      }
      continue;
    }
    buf += input[i];
    i += 1;
  }
  flush();
  return runs;
}

function paragraphFromInline(text: string): Paragraph {
  const runs = parseInline(text).map(
    (r) =>
      new TextRun({
        text: r.text,
        bold: r.bold,
        italics: r.italic,
        font: r.code ? "Consolas" : undefined,
      }),
  );
  return new Paragraph({ children: runs.length > 0 ? runs : [new TextRun(text)] });
}

function heading(text: string, level: 1 | 2 | 3 | 4): Paragraph {
  const map: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
  };
  return new Paragraph({
    heading: map[level],
    children: parseInline(text).map(
      (r) => new TextRun({ text: r.text, bold: r.bold, italics: r.italic, font: r.code ? "Consolas" : undefined }),
    ),
  });
}

function bullet(text: string, level = 0): Paragraph {
  return new Paragraph({
    bullet: { level },
    children: parseInline(text).map(
      (r) => new TextRun({ text: r.text, bold: r.bold, italics: r.italic, font: r.code ? "Consolas" : undefined }),
    ),
  });
}

function blockquote(text: string): Paragraph {
  return new Paragraph({
    children: parseInline(text).map(
      (r) => new TextRun({ text: r.text, bold: r.bold, italics: true }),
    ),
    indent: { left: 360 },
  });
}

function code(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, font: "Consolas" })],
    indent: { left: 360 },
  });
}

function makeTable(rows: string[][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(
      (r, ri) =>
        new TableRow({
          children: r.map(
            (cell) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: parseInline(cell).map(
                      (run) =>
                        new TextRun({
                          text: run.text,
                          bold: ri === 0 || run.bold,
                          italics: run.italic,
                        }),
                    ),
                  }),
                ],
              }),
          ),
        }),
    ),
  });
}

export async function markdownToDocxBlob(title: string, markdown: string): Promise<Blob> {
  const lines = markdown.split(/\r?\n/);
  const children: (Paragraph | Table)[] = [];

  let i = 0;
  let listCounter = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        children.push(code(lines[i]));
        i += 1;
      }
      i += 1;
      continue;
    }

    // Table — header row, separator row, body rows
    if (line.startsWith("|") && i + 1 < lines.length && /^\|[ :|-]+\|$/.test(lines[i + 1])) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (/^\|[ :|-]+\|$/.test(lines[i])) {
          i += 1;
          continue;
        }
        const cells = lines[i].slice(1, -1).split("|").map((c) => c.trim());
        rows.push(cells);
        i += 1;
      }
      children.push(makeTable(rows));
      continue;
    }

    // Headings
    if (line.startsWith("#### ")) { children.push(heading(line.slice(5), 4)); i += 1; continue; }
    if (line.startsWith("### "))  { children.push(heading(line.slice(4), 3)); i += 1; continue; }
    if (line.startsWith("## "))   { children.push(heading(line.slice(3), 2)); i += 1; continue; }
    if (line.startsWith("# "))    { children.push(heading(line.slice(2), 1)); i += 1; continue; }

    // Blockquote
    if (line.startsWith("> ")) {
      children.push(blockquote(line.slice(2)));
      i += 1;
      continue;
    }

    // Bullet list
    if (line.match(/^- /) || line.match(/^\* /)) {
      children.push(bullet(line.slice(2)));
      i += 1;
      continue;
    }

    // Ordered list (rough — we use plain paragraphs prefixed with the number)
    const ordered = line.match(/^\d+\.\s+(.*)/);
    if (ordered) {
      listCounter += 1;
      children.push(paragraphFromInline(`${listCounter}. ${ordered[1]}`));
      i += 1;
      continue;
    } else {
      listCounter = 0;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      children.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
      i += 1;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      children.push(new Paragraph({ children: [new TextRun("")] }));
      i += 1;
      continue;
    }

    // Plain paragraph (single line)
    children.push(paragraphFromInline(line));
    i += 1;
  }

  const doc = new Document({
    creator: "Product Dev Blueprint",
    title,
    description: title,
    sections: [{ children }],
  });

  return Packer.toBlob(doc);
}

export async function downloadDocx(filename: string, title: string, markdown: string) {
  const blob = await markdownToDocxBlob(title, markdown);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
