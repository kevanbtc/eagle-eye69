import { Router } from 'express';
import ExcelJS from 'exceljs';
import { prisma } from '../index.js';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Apply authentication to all export routes
router.use(authenticate);

// Export estimate to Excel
router.post('/estimate/:id/excel', async (req, res) => {
  try {
    const estimate = await prisma.estimate.findUnique({
      where: { id: req.params.id },
      include: {
        project: true,
        user: true,
        lineItems: {
          include: { material: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Estimate');

    // Header section
    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').value = 'EAGLE EYE CONSTRUCTION ESTIMATE';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Project info
    worksheet.getCell('A3').value = 'Project:';
    worksheet.getCell('B3').value = estimate.project.name;
    worksheet.getCell('A4').value = 'Estimate:';
    worksheet.getCell('B4').value = estimate.name;
    worksheet.getCell('A5').value = 'Date:';
    worksheet.getCell('B5').value = estimate.createdAt.toLocaleDateString();

    // Column headers
    worksheet.getRow(7).values = ['Category', 'Description', 'Quantity', 'Unit', 'Unit Cost', 'Total Cost', 'Green'];
    worksheet.getRow(7).font = { bold: true };
    worksheet.getRow(7).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    // Line items
    let currentRow = 8;
    estimate.lineItems.forEach(item => {
      worksheet.getRow(currentRow).values = [
        item.category,
        item.description,
        parseFloat(item.quantity.toString()),
        item.unit,
        parseFloat(item.unitCost.toString()),
        parseFloat(item.totalCost.toString()),
        item.isGreen ? 'Yes' : 'No'
      ];
      currentRow++;
    });

    // Totals section
    currentRow += 1;
    worksheet.getCell(`A${currentRow}`).value = 'Subtotal (Materials):';
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`F${currentRow}`).value = parseFloat(estimate.materialCost.toString());
    worksheet.getCell(`F${currentRow}`).numFmt = '$#,##0.00';

    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'Labor Cost:';
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`F${currentRow}`).value = parseFloat(estimate.laborCost.toString());
    worksheet.getCell(`F${currentRow}`).numFmt = '$#,##0.00';

    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'Markup:';
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`F${currentRow}`).value = parseFloat(estimate.profitMargin.toString());
    worksheet.getCell(`F${currentRow}`).numFmt = '$#,##0.00';

    currentRow++;
    worksheet.getCell(`A${currentRow}`).value = 'TOTAL:';
    worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
    worksheet.getCell(`F${currentRow}`).value = parseFloat(estimate.totalCost.toString());
    worksheet.getCell(`F${currentRow}`).numFmt = '$#,##0.00';
    worksheet.getCell(`F${currentRow}`).font = { bold: true, size: 14 };

    // Column widths
    worksheet.columns = [
      { width: 20 },
      { width: 40 },
      { width: 12 },
      { width: 10 },
      { width: 12 },
      { width: 12 },
      { width: 10 }
    ];

    // Save file
    const fileName = `estimate-${estimate.name.replace(/\s+/g, '-')}-${Date.now()}.xlsx`;
    const filePath = path.join(process.cwd(), 'exports', fileName);
    
    // Ensure exports directory exists
    if (!fs.existsSync(path.join(process.cwd(), 'exports'))) {
      fs.mkdirSync(path.join(process.cwd(), 'exports'));
    }

    await workbook.xlsx.writeFile(filePath);

    // Save export record
    const fileStats = fs.statSync(filePath);
    await prisma.estimateExport.create({
      data: {
        estimateId: estimate.id,
        format: 'EXCEL',
        fileName,
        filePath,
        fileSize: fileStats.size
      }
    });

    res.json({ fileName, filePath, message: 'Excel export created successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Download export file
router.get('/download/:fileName', (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'exports', req.params.fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.download(filePath);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
