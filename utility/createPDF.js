const PDFDocument = require('pdfkit');
const fs = require('fs');
const { format } = require('path');

function formatAngka(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function createSalarySlip(salary, person, dataCallBack, endCallBack) {
    const column1X = 70; // X-coordinate for the first column
    const column2X = 300; // X-coordinate for the second column
    const column1Content = [
        'Kinerja:',
        `Jam kerja (${salary.jamKerjaTotal} Jam):`,
        `Transport (${salary.transportTotal} Hari):`,
        // `Total:`,
        // Add more content as needed
    ];

    const column2Content = [
        `Rp ${formatAngka(salary.kinerja)}`,
        `Rp ${formatAngka(salary.jamKerja)}`,
        `Rp ${formatAngka(salary.transport)}`,
        // `Rp ${formatAngka(salary.total)}`,
        // Add more content as needed
    ];

    const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
    });

    // doc.on('data', dataCallBack);
    // doc.on('data', endCallBack);
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');

    const distanceMargin = 18;
    doc.fillAndStroke('#fff')
        .lineWidth(20)
        .rect(
            distanceMargin,
            distanceMargin,
            doc.page.width - distanceMargin * 2,
            doc.page.height - distanceMargin * 2
        )
        .stroke();

    const maxWidth = 300;
    const maxHeight = 110;
    doc.image(
        './public/assets/logo_bmn.png',
        doc.page.width / 2 - maxWidth / 2,
        60,
        {
            fit: [maxWidth, maxHeight],
            align: 'center',
        }
    );

    jumpLine(doc, 5);
    doc.font('Times-Roman').fontSize(30).fill('#111111').text('Slip Gaji', {
        align: 'center',
        underline: true,
    });

    doc.font('Times-Roman')
        .fontSize(10)
        .fill('#111111')
        .text(`Periode ${person.bulan} ${person.tahun}`, {
            align: 'center',
        });

    jumpLine(doc, 1);

    doc.font('Times-Bold')
        .fontSize(20)
        .fill('#111111')
        .text(`Nama: ${person.nama}`, column1X);
    // Membuat file PDF

    doc.font('Times-Roman')
        .fontSize(20)
        .fill('#111111')
        .text('Pendapatan', column1X);

    doc.underline(70, 40, 400, 200, { color: 'black' });
    jumpLine(doc, 1);

    for (let index = 0; index < column1Content.length; index++) {
        const line = column1Content[index];
        doc.font('Times-Roman')
            .fontSize(15)
            .fill('#000000')
            .text(line, column1X, index * 20 + 270);
    }

    // Loop untuk menuliskan konten kolom 2 dengan format yang sama
    for (let index = 0; index < column2Content.length; index++) {
        const line = column2Content[index];
        doc.font('Times-Roman')
            .fontSize(15)
            .fill('#000000')
            .text(line, column2X, index * 20 + 270);
    }

    doc.font('Times-Roman')
        .fontSize(15)
        .fill('#000000')
        .text('----------------- + ', column2X);

    doc.font('Times-Bold')
        .fontSize(15)
        .fill('#000000')
        .text('Total: ', column1X, 340);
    doc.font('Times-Bold')
        .fontSize(15)
        .fill('#000000')
        .text(`Rp ${formatAngka(salary.total)}`, column2X, 340);
    jumpLine(doc, 1);
    doc.font('Times-Bold')
        .fontSize(15)
        .fill('#111111')
        .text(
            'Terimakasih, Semoga Bermanfaat dan Ridho Allah SWT Bersama Kita',
            column1X
        );
    jumpLine(doc, 1);
    doc.font('Times-Roman')
        .fontSize(15)
        .fill('#111111')
        .text(`${person.tanggal}`, {
            align: 'right',
        });
    jumpLine(doc, 3);
    doc.font('Times-Roman').fontSize(15).fill('#111111').text('Maulina', {
        align: 'right',
    });

    doc.on('data', (chunk) => {
        dataCallBack(chunk); // Write each chunk of data to the stream
    });
    doc.end();

    // Call endCallBack when all data has been written
    doc.on('end', () => {
        endCallBack();
    });
}

function jumpLine(doc, lines) {
    for (let index = 0; index < lines; index++) {
        doc.moveDown();
    }
}

module.exports = createSalarySlip;
