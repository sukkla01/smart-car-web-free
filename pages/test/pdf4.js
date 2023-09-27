import React from 'react'
import { pdfMake } from "../../lib/pdfmake";

const Pdf4 = () => {
    const tableHeader = [
        { text: 'รหัสลูกค้า', alignment: 'center', bold: true },
        { text: 'ชื่อ สกุล', alignment: 'left', bold: true },
        { text: 'เงินเดือน', alignment: 'center', bold: true },
      ]
    let customers = [
        { id: 1, name: 'John Doe', salary: 30000 },
        { id: 2, name: 'Mary Doe', salary: 30000 },
        { id: 3, name: 'Bob Doe', salary: 30000 },
        { id: 1, name: 'John Doe', salary: 30000 },
        { id: 2, name: 'Mary Doe', salary: 30000 },
        { id: 3, name: 'Bob Doe', salary: 30000 },
        { id: 1, name: 'John Doe', salary: 30000 },
        { id: 2, name: 'Mary Doe', salary: 30000 },
        { id: 3, name: 'Bob Doe', salary: 30000 },
        { id: 1, name: 'John Doe', salary: 30000 },
        { id: 2, name: 'Mary Doe', salary: 30000 },
        { id: 3, name: 'Bob Doe', salary: 30000 },
        { id: 1, name: 'John Doe', salary: 30000 },
        { id: 2, name: 'Mary Doe', salary: 30000 },
        { id: 3, name: 'Bob Doe', salary: 30000 },
        { id: 1, name: 'John Doe', salary: 30000 },
        { id: 2, name: 'Mary Doe', salary: 30000 },
        { id: 3, name: 'Bob Doe', salary: 30000 },
        { id: 1, name: 'John Doe', salary: 30000 },
        { id: 2, name: 'Mary Doe', salary: 30000 },
        { id: 3, name: 'Bob Doe', salary: 30000 },
        { id: 1, name: 'John Doe', salary: 30000 },
        { id: 2, name: 'Mary Doe', salary: 30000 },
        { id: 3, name: 'Bob Doe', salary: 30000 },
        { id: 1, name: 'John Doe', salary: 30000 },
        { id: 2, name: 'Mary Doe', salary: 30000 },
        { id: 3, name: 'Bob Doe', salary: 30000 },
        { id: 1, name: 'John Doe', salary: 30000 },
        { id: 2, name: 'Mary Doe', salary: 30000 },
        { id: 3, name: 'Bob Doe', salary: 30000 },
        { id: 1, name: 'John Doe', salary: 30000 },
        { id: 2, name: 'Mary Doe', salary: 30000 },
        { id: 3, name: 'Bob Doe', salary: 30000 },
    ];

    let bodyTable = [];
    bodyTable = customers.map(({ id, name, salary }) => {
        return [{ text: id, alignment: 'center' }, name, salary];
    });

    bodyTable.unshift(tableHeader);  //ให้เป็นบรรทัดแรก

    const onPdf = () => {
        pdfMake.createPdf({
            images: {
                logo: 'https://codingthailand.com/site/img/garuda_logo.png'
            },
            info: {
                title: 'รายงานลูกค้า',
                author: 'John Doe',
                subject: 'subject of doc',
                keywords: 'customer'
            },
            header: function (currentPage, pageCount, pageSize) {
                //add logic
                return {
                    columns: [
                        { text: new Date().toLocaleString(), alignment: 'left', margin: [10, 10, 0, 0] },
                        { text: `หน้า ${currentPage}/${pageCount}`, alignment: 'right', margin: [0, 10, 10, 0] },
                    ]
                }
            },
            footer: function (currentPage, pageCount, pageSize) {
                //add logic
                return {
                    columns: [
                        { text: new Date().toLocaleString(), alignment: 'left', margin: [10, 10, 0, 0] },
                        { text: 'created by codingthailand.com', alignment: 'center', margin: [10, 10, 0, 0] },
                        { text: `หน้า ${currentPage}/${pageCount}`, alignment: 'right', margin: [0, 10, 10, 0] },
                    ]
                }
            },
            content: [
                { text: 'รายงานลูกค้าทั้งหมด', fontSize: 20, alignment: 'center', color: 'blue', decoration: 'underline' },
                {
                    table: {
                        headerRows: 1,//หัวตารางทุกหน้า
                        widths: [50, '*', '*'],
                        body: bodyTable
                    }
                }
            ],
            defaultStyle: {
                font: 'THSarabunNew',
                // bold : true,
                // italics : true,
                fontSize: 16
            }

        }).open()
    }
    return (
        <div>
            <button className='btn btn-success' onClick={onPdf}>Gen Pdf</button>
        </div>
    )
}

export default Pdf4