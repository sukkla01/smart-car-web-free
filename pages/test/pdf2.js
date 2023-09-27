import React from 'react'
import { pdfMake } from "../../lib/pdfmake";

const Pdf2 = () => {

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
            header: function(currentPage, pageCount, pageSize) {
                //add logic
                return {
                  columns: [
                    { text: new Date().toLocaleString(), alignment: 'left', margin: [10, 10, 0, 0] },
                    { text: `หน้า ${currentPage}/${pageCount}`, alignment: 'right', margin: [0, 10, 10, 0] },
                  ]
                }
              },
              footer: function(currentPage, pageCount, pageSize) {
                //add logic
                return {
                  columns: [
                    { text: new Date().toLocaleString(), alignment: 'left', margin: [10, 10, 0, 0] },
                    { text: 'created by codingthailand.com', alignment: 'center', margin: [10, 10, 0, 0]},
                    { text: 'created by codingthailand.com', alignment: 'center', margin: [10, 10, 0, 0]},
                    { text: `หน้า ${currentPage}/${pageCount}`, alignment: 'right', margin: [0, 10, 10, 0] },
                  ]
                }
              },
            content: [
                { image: 'logo', width: 50, height: 50, alignment: 'center' },

                { text: 'รายงานลูกค้าทั้งหมด', fontSize: 20, alignment: 'center', color: 'blue', decoration: 'underline' },
                { text: 'รายงานโดย Admin', alignment: 'center', style: 'subHeader' },
                { text: `\t\tคอร์รัปชันเคลียร์โฟล์ค ลามะสปายแตงกวา ผ้าห่มอีแต๋นยูโรเมี่ยงคำ แฮมเบอร์เกอร์ฮาโลวีนม้าหินอ่อนพรีเมียร์ สตริงเมคอัพสต็อก มะกันตื้บมอยส์เจอไรเซอร์ คณาญาติ เกย์ไบเบิล งี้ยังไงจูเนียร์ไอเดีย พรีเมียมเยนหลวงปู่วิว แซ็ก โบตั๋นแพทเทิร์น เอ๊าะโปรดักชั่นติ๋ม อะครูเสดวอลล์ แคมเปญ ภควัมบดีคอมเมนท์เรตรูบิกกาญจน์ คอร์รัปชันเคลียร์โฟล์ค ลามะสปายแตงกวา ผ้าห่มอีแต๋นยูโรเมี่ยงคำ แฮมเบอร์เกอร์ฮาโลวีนม้าหินอ่อนพรีเมียร์ สตริงเมคอัพสต็อก มะกันตื้บมอยส์เจอไรเซอร์ คณาญาติ เกย์ไบเบิล งี้ยังไงจูเนียร์ไอเดีย พรีเมียมเยนหลวงปู่วิว แซ็ก โบตั๋นแพทเทิร์น เอ๊าะโปรดักชั่นติ๋ม อะครูเสดวอลล์ แคมเปญ ภควัมบดีคอมเมนท์เรตรูบิกกาญจน์\n\n`, alignment: 'justify', preserveLeadingSpaces: true, pageBreak: 'after' },
                { text: "       คอร์รัปชันเคลียร์โฟล์ค ลามะสปายแตงกวา ผ้าห่มอีแต๋นยูโรเมี่ยงคำ แฮมเบอร์เกอร์ฮาโลวีนม้าหินอ่อนพรีเมียร์ สตริงเมคอัพสต็อก มะกันตื้บมอยส์เจอไรเซอร์ คณาญาติ เกย์ไบเบิล งี้ยังไงจูเนียร์ไอเดีย พรีเมียมเยนหลวงปู่วิว แซ็ก โบตั๋นแพทเทิร์น เอ๊าะโปรดักชั่นติ๋ม อะครูเสดวอลล์ แคมเปญ ภควัมบดีคอมเมนท์เรตรูบิกกาญจน์ คอร์รัปชันเคลียร์โฟล์ค ลามะสปายแตงกวา ผ้าห่มอีแต๋นยูโรเมี่ยงคำ แฮมเบอร์เกอร์ฮาโลวีนม้าหินอ่อนพรีเมียร์ สตริงเมคอัพสต็อก มะกันตื้บมอยส์เจอไรเซอร์ คณาญาติ เกย์ไบเบิล งี้ยังไงจูเนียร์ไอเดีย พรีเมียมเยนหลวงปู่วิว แซ็ก โบตั๋นแพทเทิร์น เอ๊าะโปรดักชั่นติ๋ม อะครูเสดวอลล์ แคมเปญ ภควัมบดีคอมเมนท์เรตรูบิกกาญจน์\n\n", alignment: 'justify', preserveLeadingSpaces: true },
                {
                    text: [
                        { text: 'ยินดีต้อนรับ ' },
                        { text: 'ยินดีต้อนรับ 2 ', color: 'red' },
                        { text: 'ยินดีต้อนรับ 3', bold: true },
                    ]
                },
                {
                    marginTop: 20,
                    stack: [
                        'คอร์รัปชันเคลียร์โฟล์ค ลามะสปายแตงกวา ผ้าห่มอีแต๋นยูโรเมี่ยงคำ คอร์รัปชันเคลียร์โฟล์ค ลามะสปายแตงกวา ผ้าห่มอีแต๋นยูโรเมี่ยงคำ คอร์รัปชันเคลียร์โฟล์ค ลามะสปายแตงกวา ผ้าห่มอีแต๋นยูโรเมี่ยงคำ คอร์รัปชันเคลียร์โฟล์ค ลามะสปายแตงกวา ผ้าห่มอีแต๋นยูโรเมี่ยงคำ',
                        'แฮมเบอร์เกอร์ฮาโลวีนม้าหินอ่อนพรีเมียร์ แฮมเบอร์เกอร์ฮาโลวีนม้าหินอ่อนพรีเมียร์'
                    ],
                    color: 'blue'
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

export default Pdf2