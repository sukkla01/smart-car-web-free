import React, { useState } from 'react'
import { pdfMake } from "../../lib/pdfmake";


const Test = () => {
    const [a, SetA] = useState('')
    const onPdf = () => {
        pdfMake.createPdf({
            watermark: { text: 'ทดสอบ', color: 'grey', opacity: 0.3, fontSize: 20, angle: 45 },
            pageSize: 'A5',
            pageOrientation: 'landscape',
            pageMargins: 10, //default 10 //[left,top,right,bottom]
            content: [
                'สวัสดี Pdf'
            ],
            defaultStyle: {
                font: 'THSarabunNew',
                // bold : true,
                // italics : true,
                fontSize: 16
            }
        }).open()
    }

    const aa = () => {
        SetA('animate__animated animate__shakeX')
        setInterval(function () {
            SetA('')
        }, 5000);
    }
    const bb = () => {
        SetA('')
    }

    return (
        <div>
            <button onClick={aa}>pdf</button>
            <button onClick={bb}>clear</button>
            <button className={a}>kkkkk</button>
        </div>
    )
}

export default Test