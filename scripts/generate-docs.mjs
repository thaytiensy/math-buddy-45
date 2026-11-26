import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PptxGenJS from 'pptxgenjs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
} from 'docx';
import {
  OWNERSHIP_AUTHORS,
  DOC_PATHS,
  SLIDE_DECK,
  APP_DESCRIPTION_DOC,
} from '../src/data/appDocsContent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'tai-lieu');

fs.mkdirSync(outDir, { recursive: true });

const ACCENT_HEX = [
  '3730A3',
  '0369A1',
  '047857',
  'D97706',
  '5B21B6',
  'BE185D',
  'E11D48',
  '059669',
  '0F766E',
  '4338CA',
  '1D4ED8',
];

async function buildPptx() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = OWNERSHIP_AUTHORS;
  pptx.company = 'Toán Đồng Hành Lớp 4, 5';
  pptx.subject = 'Hướng dẫn sử dụng ứng dụng Toán Đồng Hành Lớp 4, 5';
  pptx.title = 'Slide Hướng Dẫn Sử Dụng - Toán Đồng Hành Lớp 4, 5';

  SLIDE_DECK.forEach((slideData, idx) => {
    const slide = pptx.addSlide();
    const color = ACCENT_HEX[idx % ACCENT_HEX.length];
    const isCover = idx === 0;

    const imgDiskPath = slideData.image
      ? path.join(rootDir, 'public', slideData.image.replace(/^\/+/, ''))
      : null;
    const hasImg = imgDiskPath && fs.existsSync(imgDiskPath);

    if (isCover) {
      slide.background = { color };

      // Khung bên trái: Tiêu đề & Tác giả
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.4,
        y: 0.55,
        w: 4.45,
        h: 4.5,
        fill: { color: 'FFFFFF', transparency: 5 },
        line: { color: 'FDE68A', width: 2 },
        rectRadius: 0.16,
      });

      slide.addText('CHƯƠNG TRÌNH GDPT 2018 • TIỂU HỌC', {
        x: 0.62,
        y: 0.78,
        w: 4.05,
        h: 0.3,
        fontFace: 'Arial',
        fontSize: 10.5,
        bold: true,
        color: 'B45309',
      });

      slide.addText(slideData.title, {
        x: 0.62,
        y: 1.12,
        w: 4.05,
        h: 0.65,
        fontFace: 'Arial',
        fontSize: 22,
        bold: true,
        color: '1E1B4B',
      });

      slide.addText(slideData.subtitle, {
        x: 0.62,
        y: 1.8,
        w: 4.05,
        h: 0.72,
        fontFace: 'Arial',
        fontSize: 11.5,
        color: '334155',
      });

      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.62,
        y: 2.6,
        w: 4.05,
        h: 0.68,
        fill: { color: 'FEF3C7' },
        line: { color: 'F59E0B', width: 1.5 },
        rectRadius: 0.1,
      });

      slide.addText(slideData.highlight, {
        x: 0.74,
        y: 2.68,
        w: 3.8,
        h: 0.52,
        fontFace: 'Arial',
        fontSize: 11.5,
        bold: true,
        color: '92400E',
      });

      const bulletRuns = slideData.bullets.map((b) => ({
        text: b,
        options: { bullet: true, breakLine: true },
      }));

      slide.addText(bulletRuns, {
        x: 0.62,
        y: 3.4,
        w: 4.05,
        h: 1.5,
        fontFace: 'Arial',
        fontSize: 10.5,
        color: '1E293B',
        paraSpaceAfter: 6,
      });

      // Khung bên phải: Ảnh chụp thật ứng dụng có chú thích 4 bước
      if (hasImg) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 5.05,
          y: 0.75,
          w: 4.55,
          h: 3.45,
          fill: { color: 'FFFFFF' },
          line: { color: 'E2E8F0', width: 1.5 },
          rectRadius: 0.12,
        });
        slide.addImage({
          path: imgDiskPath,
          x: 5.15,
          y: 0.85,
          w: 4.35,
          h: 2.62,
        });
        slide.addText(slideData.imageCaption || '', {
          x: 5.15,
          y: 3.55,
          w: 4.35,
          h: 0.52,
          fontFace: 'Arial',
          fontSize: 10,
          italic: true,
          bold: true,
          color: '334155',
          align: 'center',
        });
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 5.05,
          y: 4.35,
          w: 4.55,
          h: 0.7,
          fill: { color: 'EEF2FF' },
          line: { color: 'C7D2FE', width: 1 },
          rectRadius: 0.1,
        });
        slide.addText(`Mẹo sử dụng: ${slideData.tip}`, {
          x: 5.2,
          y: 4.44,
          w: 4.25,
          h: 0.52,
          fontFace: 'Arial',
          fontSize: 10,
          bold: true,
          color: '312E81',
        });
      }
    } else {
      slide.background = { color: 'F8FAFC' };

      // Header banner
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 0.92,
        fill: { color },
      });

      slide.addText(`TRANG ${slideData.id}/${SLIDE_DECK.length} • ${slideData.tag.toUpperCase()}`, {
        x: 0.38,
        y: 0.1,
        w: 9.2,
        h: 0.22,
        fontFace: 'Arial',
        fontSize: 9.5,
        bold: true,
        color: 'E0E7FF',
      });

      slide.addText(slideData.title, {
        x: 0.38,
        y: 0.33,
        w: 9.2,
        h: 0.45,
        fontFace: 'Arial',
        fontSize: 19,
        bold: true,
        color: 'FFFFFF',
      });

      // Highlight ribbon
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.38,
        y: 1.02,
        w: 9.24,
        h: 0.42,
        fill: { color: 'EEF2FF' },
        line: { color, width: 1.1 },
        rectRadius: 0.08,
      });

      slide.addText(`★ ${slideData.highlight}`, {
        x: 0.52,
        y: 1.09,
        w: 8.96,
        h: 0.28,
        fontFace: 'Arial',
        fontSize: 11,
        bold: true,
        color,
      });

      // Cột trái: Các bước hướng dẫn chi tiết
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.38,
        y: 1.54,
        w: 3.72,
        h: 3.05,
        fill: { color: 'FFFFFF' },
        line: { color: 'CBD5E1', width: 1 },
        rectRadius: 0.1,
      });

      slide.addText(slideData.subtitle, {
        x: 0.52,
        y: 1.64,
        w: 3.44,
        h: 0.46,
        fontFace: 'Arial',
        fontSize: 10,
        italic: true,
        bold: true,
        color: '475569',
      });

      const bulletRuns = slideData.bullets.map((b) => ({
        text: b,
        options: { bullet: true, breakLine: true },
      }));

      slide.addText(bulletRuns, {
        x: 0.52,
        y: 2.15,
        w: 3.44,
        h: 2.35,
        fontFace: 'Arial',
        fontSize: 10.2,
        color: '1E293B',
        paraSpaceAfter: 7,
      });

      // Ghi chú dưới cột trái
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.38,
        y: 4.68,
        w: 3.72,
        h: 0.52,
        fill: { color: 'FEF9C3' },
        line: { color: 'FACC15', width: 1 },
        rectRadius: 0.08,
      });

      slide.addText(`Mẹo: ${slideData.tip}`, {
        x: 0.5,
        y: 4.74,
        w: 3.48,
        h: 0.4,
        fontFace: 'Arial',
        fontSize: 9.2,
        bold: true,
        color: '854D0E',
      });

      // Cột phải: Ảnh chụp màn hình thật có chú thích trực tiếp
      if (hasImg) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 4.24,
          y: 1.54,
          w: 5.38,
          h: 3.66,
          fill: { color: 'FFFFFF' },
          line: { color: '94A3B8', width: 1.2 },
          rectRadius: 0.1,
        });

        slide.addImage({
          path: imgDiskPath,
          x: 4.33,
          y: 1.62,
          w: 5.2,
          h: 3.13,
        });

        slide.addText(slideData.imageCaption || '', {
          x: 4.33,
          y: 4.82,
          w: 5.2,
          h: 0.32,
          fontFace: 'Arial',
          fontSize: 9.5,
          italic: true,
          bold: true,
          color: '334155',
          align: 'center',
        });
      }
    }

    // Chân trang mọi slide
    slide.addText(`Toán Đồng Hành Lớp 4, 5  |  Chủ nhiệm & Tác giả: ${OWNERSHIP_AUTHORS}`, {
      x: 0.38,
      y: 5.29,
      w: 9.24,
      h: 0.24,
      fontFace: 'Arial',
      fontSize: 9,
      color: isCover ? 'F8FAFC' : '64748B',
      align: 'right',
    });
  });

  const outPath = path.join(outDir, DOC_PATHS.pptxFileName);
  await pptx.writeFile({ fileName: outPath });
  console.log('Đã tạo tệp Slide hướng dẫn (kèm ảnh thật có chú thích):', outPath);
}

async function buildDocx() {
  const children = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: APP_DESCRIPTION_DOC.title,
          bold: true,
          size: 32,
          color: '1E3A8A',
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: APP_DESCRIPTION_DOC.appName,
          bold: true,
          size: 40,
          color: '3730A3',
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: APP_DESCRIPTION_DOC.subtitle,
          italics: true,
          size: 22,
          color: '475569',
          font: 'Arial',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 280 },
      children: [
        new TextRun({
          text: `Chủ nhiệm & Tác giả xây dựng: ${APP_DESCRIPTION_DOC.authors}  •  Năm ${APP_DESCRIPTION_DOC.year}`,
          bold: true,
          size: 22,
          color: 'B45309',
          font: 'Arial',
        }),
      ],
    })
  );

  for (const sec of APP_DESCRIPTION_DOC.sections) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: sec.heading,
            bold: true,
            size: 26,
            color: '1E40AF',
            font: 'Arial',
          }),
        ],
      })
    );

    if (sec.paragraphs) {
      for (const p of sec.paragraphs) {
        children.push(
          new Paragraph({
            spacing: { after: 120, line: 276 },
            children: [
              new TextRun({
                text: p,
                size: 22,
                color: '1E293B',
                font: 'Arial',
              }),
            ],
          })
        );
      }
    }

    if (sec.bullets) {
      for (const b of sec.bullets) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 90, line: 276 },
            children: [
              new TextRun({
                text: b,
                size: 22,
                color: '1E293B',
                font: 'Arial',
              }),
            ],
          })
        );
      }
    }

    if (sec.table) {
      const headerRow = new TableRow({
        tableHeader: true,
        children: sec.table.headers.map(
          (h) =>
            new TableCell({
              shading: { type: ShadingType.CLEAR, fill: 'DBEAFE' },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: h,
                      bold: true,
                      size: 21,
                      color: '1E3A8A',
                      font: 'Arial',
                    }),
                  ],
                }),
              ],
            })
        ),
      });

      const bodyRows = sec.table.rows.map(
        (row) =>
          new TableRow({
            children: row.map(
              (cellText, cIdx) =>
                new TableCell({
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: cellText,
                          bold: cIdx === 0,
                          size: 20,
                          color: '1E293B',
                          font: 'Arial',
                        }),
                      ],
                    }),
                  ],
                })
            ),
          })
      );

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: '94A3B8' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: '94A3B8' },
            left: { style: BorderStyle.SINGLE, size: 1, color: '94A3B8' },
            right: { style: BorderStyle.SINGLE, size: 1, color: '94A3B8' },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
          },
          rows: [headerRow, ...bodyRows],
        })
      );
    }
  }

  const doc = new Document({
    creator: OWNERSHIP_AUTHORS,
    title: 'Bản mô tả ứng dụng Toán Đồng Hành Lớp 4, 5',
    description: 'Tài liệu mô tả chi tiết ứng dụng Toán Đồng Hành Lớp 4, 5',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(outDir, DOC_PATHS.docxFileName);
  fs.writeFileSync(outPath, buffer);
  console.log('Đã tạo tệp Bản mô tả Word:', outPath);
}

await buildPptx();
await buildDocx();
