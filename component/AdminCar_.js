import React, { useEffect, useState } from "react";
import { Figma, CalendarCheck2, MapPin, User, Database, Car, Check, XCircle, Printer } from "lucide-react";
import { Switch, Modal, Form, Input, Select, DatePicker, ConfigProvider, TimePicker, Card, Radio, notification } from "antd";
import axios from "axios";
import config from "../config";
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");
import th_TH from "antd/lib/locale/th_TH";

import dayjs from 'dayjs';
import 'dayjs/locale/th';
import locale from 'antd/locale/th_TH';
import jwt_decode from "jwt-decode";
import io from "socket.io-client"
import { pdfMake } from "../lib/pdfmake";

const { TextArea } = Input;
const { Meta } = Card;
const BASE_URL = config.BASE_URL;
const socket = io(BASE_URL)

let y_replace = 2023

const AdminCar_ = () => {
    const [data, setData] = useState([]);
    const [dataKeeper, setDataKeeper] = useState([]);
    const [dataCar, setDataCar] = useState([]);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        head_id: null,
        keeper: null,
        no_car: "",
        start_date: null,
        start_time: null,
        end_date: null,
        end_time: null,
        tcount: null,
        comment: '',
        car_id: null,
        filter_date: null
    });
    const [selectCar, setSelectCar] = useState();
    const [notApprove, setNotApprove] = useState('');
    const [tabFilter, setTabFilter] = useState('waitapprove');
    const [isConnected, setIsConnected] = useState(socket.connected)


    const optionsFilter = [
        { label: 'รออนุมัติ', value: 'waitapprove' },
        { label: 'อนุมัติ', value: 'approve' },
        { label: 'ทั้งหมด', value: 'total' },
    ];

    const openNotificationWithIconSuccess = (type) => {
        notification[type]({
            message: "แจ้งเตือน",
            description: "มีรายการจองรถใหม่หรือแก้ไข",
            duration: 5000,
            style: { backroundColor: "#164E63" },
        });
    };



    const openNotificationError = (type) => {
        notification[type]({
            message: "แจ้งเตือน",
            description: "กรุณากรอกข้อมูลให้ครับ",
            duration: 5000,
            style: { backroundColor: "#164E63" },
        });
    };



    useEffect(() => {
        getReserveAll()
        getKeeperAll()
        getCarAll()
        // onChangeFilter(tabFilter)
        // ------------------------------------------------------------------------------------------------- START CONNECT SOCKET
        socket.on("connect", () => {
            setIsConnected(true)
        })

        socket.on("disconnect", () => {
            setIsConnected(false)
        })
        // ------------------------------------------------------------------------------------------------- END CONNECT SOCKET

        socket.on("boss-dept-add-approve", (data) => {
            setTabFilter('waitapprove')
            getReserveAll('waitapprove')
            // console.log(data)
            // AlertNoti()

        })

        return () => {
            socket.off("connect")
            socket.off("disconnect")
        }

    }, []);

    const AlertNoti = () => {
        openNotificationWithIconSuccess('success')
        console.log('cc')
    }

    const getCarAll = async () => {
        const token = localStorage.getItem("token");

        try {
            let res = await axios.get(`${BASE_URL}/get-car-all`, { headers: { "token": token } })
            setDataCar(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getReserveAll = async (value) => {
        const token = localStorage.getItem("token");
        let tmp_value = value == 'waitapprove' ? value : tabFilter
        try {
            let res = await axios.get(`${BASE_URL}/get-reserve-approve/${tmp_value}`, { headers: { "token": token } })
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getKeeperAll = async () => {
        const token = localStorage.getItem("token");
        let tmp = []
        try {
            let res = await axios.get(`${BASE_URL}/get-keeper-all`, { headers: { "token": token } })
            res.data.map((item, i) => {
                tmp.push({
                    value: item.id,
                    label: item.name,
                });
            });
            setDataKeeper(tmp)
        } catch (error) {
            console.log(error)
        }
    }

    const onSubmit = () => {
        setOpen(false)
    }

    const onExit = () => {
        setOpen(false)
    }
    const onSubmitCar = () => {
        setOpen2(false)
    }

    const onExitCar = () => {
        setOpen2(false)
    }
    const onExitNotApprove = () => {
        setOpen3(false)
    }

    const onChangeDateStart = (date, dateString) => {
        setFormData({ ...formData, start_date: dateString })
    }
    const onChangeDateEnd = (date, dateString) => {
        setFormData({ ...formData, end_date: dateString })
    }
    const onSelectKeeper = (id) => {
        setFormData({ ...formData, keeper: id })
    }


    const submitApprove = async () => {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);

        let data = {
            id: formData.id,
            head_id: formData.head_id,
            car_id: formData.car_id,
            no_car: formData.no_car,
            keeper: formData.keeper,
            tcount: formData.tcount,
            start_date: formData.start_date,
            start_time: formData.start_time,
            end_date: formData.end_date,
            end_time: formData.end_time,
            approve_status: "Y",
            comment: formData.comment,
            staff: decoded.username
        }

        try {
            let res = await axios.post(`${BASE_URL}/add-approve-admin`, data, { headers: { "token": token } })
            setOpen(false)
            getReserveAll()
            socket.emit('admin-approve')

        } catch (error) {
            console.log(error)
        }

    }

    const onApprove = async (id) => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/edit-reserve-car/${id}`, { headers: { "token": token } })
            let d = res.data[0]
            console.log(moment(d.start_date).format('YYYY-MM-DD'))
            setFormData({
                id: null,
                head_id: id,
                keeper: null,
                no_car: "",
                start_date: moment(d.start_date).format('YYYY-MM-DD'),
                start_time: d.start_time,
                end_date: moment(d.start_date).format('YYYY-MM-DD'),
                end_time: d.end_time,
                tcount: d.tcount,
                comment: d.detail,
                car_id: null
            })
            setOpen(true)

        } catch (error) {
            console.log(error)
        }


    }

    const onNotApprove = async (id) => {
        setFormData({
            id: null,
            head_id: id,
            keeper: null,
            no_car: "",
            start_date: null,
            start_time: null,
            end_date: null,
            end_time: null,
            tcount: null,
            comment: '',
            car_id: null
        })
        setNotApprove('')
        setOpen3(true)
    }

    const submitNotApprove = async (id) => {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);

        let data = {
            id: formData.id,
            head_id: formData.head_id,
            comment: notApprove,
            approve_status: "N",
            staff: decoded.username
        }
        try {
            let res = await axios.post(`${BASE_URL}/add-notapprove-admin`, data, { headers: { "token": token } })
            setOpen3(false)
            getReserveAll()
            socket.emit('admin-approve')

        } catch (error) {
            console.log(error)
        }
    }

    const onEdit = async (id) => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-approve/${id}`, { headers: { "token": token } })
            let d = res.data[0]
            setFormData({
                id: d.id,
                head_id: id,
                keeper: parseInt(d.keeper),
                no_car: d.no_car,
                start_date: moment(d.start_date).format('YYYY-MM-DD'),
                start_time: d.start_time,
                end_date: moment(d.start_date).format('YYYY-MM-DD'),
                end_time: d.end_time,
                tcount: d.tcount,
                comment: d.comment,
                car_id: d.car_id
            })
            setOpen(true)
        } catch (error) {
            console.log(error)
        }
    }
    const onNotApproveEdit = async (id) => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-approve/${id}`, { headers: { "token": token } })
            let d = res.data[0]
            setFormData({
                id: d.id,
                head_id: id,
                keeper: parseInt(d.keeper),
                no_car: d.no_car,
                start_date: moment(d.start_date).format('YYYY-MM-DD'),
                start_time: d.start_time,
                end_date: moment(d.start_date).format('YYYY-MM-DD'),
                end_time: d.end_time,
                tcount: d.tcount,
                comment: d.comment,
                car_id: d.car_id
            })
            setNotApprove(d.comment)
            setOpen3(true)
        } catch (error) {
            console.log(error)
        }
    }
    const onChangeFilter = async ({ target: { value } }) => {
        setTabFilter(value)
        setFormData({ ...formData, filter_date: null });
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-reserve-approve/${value}`, { headers: { "token": token } })
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
        // setValue3(value);
    }

    const onChangeDateFilter = (date, dateString) => {
        console.log(dateString)
        setFormData({ ...formData, filter_date: dateString });
        getReserveFilter(dateString)
    }


    const getReserveFilter = async (date) => {
        const token = localStorage.getItem("token");

        let post = {
            status: tabFilter,
            tdate: date
        }

        try {
            let res = await axios.post(`${BASE_URL}/get-reserve-filter`, post, { headers: { "token": token } })
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const errorFilterDate = (type) => {
        notification[type]({
            message: "แจ้งเตือน",
            description: "กรุณาเลือกวันที่",
            duration: 5,
            style: { backroundColor: "#164E63" },
        });
    };

    const onPdf = async () => {
        let d = []

        if (formData.filter_date == null || formData.filter_date == '') {
            errorFilterDate('error')
            return;
        }

        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-reserve-report2/${formData.filter_date}`, {
                headers: { token: token },
            });
            d = res.data
            // console.log(res.data)
        } catch (error) {
            console.log(error);
        }


        const tableHeader = [
            { text: 'ลำดับ', alignment: 'center', bold: true },
            { text: 'ผู้ขอ', alignment: 'center', bold: true },
            { text: 'หน่วยงาน', alignment: 'center', bold: true },
            { text: 'สถานที่', alignment: 'center', bold: true },
            { text: 'จำนวน', alignment: 'center', bold: true },
            { text: 'รายละเอียด', alignment: 'center', bold: true },
            { text: 'คนขับ', alignment: 'center', bold: true },
            { text: 'เวลาออก', alignment: 'center', bold: true },
            { text: 'เวลากลับ', alignment: 'center', bold: true },

        ]

        console.log(d)
        let bodyTable = [];
        bodyTable = d.map((item, i) => {
            let starttime = item.start_date.substring(0, 5)
            let endtime = item.end_date.substring(0, 5)
            return [
                { text: i + 1, alignment: 'center' }, item.tname, item.dept_name, item.location,
                { text: item.tcount, alignment: 'center' },
                item.detail,
                item.keeper_name,
                { text: starttime, alignment: 'center' },
                { text: endtime, alignment: 'center' }];
        });

        bodyTable.unshift(tableHeader);





        pdfMake.tableLayouts = {
            L1: {
                defaultBorder: false,
                paddingTop: function (i, node) {
                    return 0
                },
                paddingBottom: function (i, node) {
                    return 0
                },
                paddingLeft: function (i, node) {
                    return 0
                },
            }
        };

        pdfMake.createPdf({
            title: 'ใบขออนุญาตใช้รถ',
            info: {
                title: 'ใบขออนุญาตใช้รถ',
            },
            // watermark: { text: 'ทดสอบ', color: 'grey', opacity: 0.3, fontSize: 20, angle: 45 },
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [10, 20, 30, 10], //default 10 //[left,top,right,bottom]
            content: [
                { text: 'รายการผู้ขอใช้รถราชการที่อนุมัติแล้ว', fontSize: 18, alignment: 'center', decoration: 'underline' },
                { text: `วันที่  ${moment(formData.filter_date).format('LL').replace('2023', '2566')}  `, fontSize: 16, alignment: 'center' },
                // { text: `วันที่....${moment().format('LL').replace('2023', '2566')}.......`, fontSize: 16, alignment: 'right', marginTop: 20 },
                {
                    // layout: 'noBorders',//lightHorizontalLines noBorders 
                    fontSize: 14,
                    table: {
                        // heights: 12,
                        headerRows: 1,
                        widths: [30, 120, 110, 140, 40, 140, 80, 40, 40],
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


    const getNotApprove = async () => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-not-approve`, { headers: { "token": token } })
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }


    // print pdf
    const onPdfBoss = async (id) => {
        let d = {}

        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-report-reserve/${id}`, {
                headers: { token: token },
            });
            d = res.data[0]
            // console.log(res.data[0])
        } catch (error) {
            console.log(error);
        }






        pdfMake.tableLayouts = {
            L1: {
                defaultBorder: false,
                paddingTop: function (i, node) {
                    return 0
                },
                paddingBottom: function (i, node) {
                    return 0
                },
                paddingLeft: function (i, node) {
                    return 0
                },
            }
        };

        pdfMake.createPdf({
            title: 'ใบขออนุญาตใช้รถ',
            info: {
                title: 'ใบขออนุญาตใช้รถ',
            },
            // watermark: { text: 'ทดสอบ', color: 'grey', opacity: 0.3, fontSize: 20, angle: 45 },
            pageSize: 'A4',
            // pageOrientation: 'landscape',
            pageMargins: [30, 20, 30, 10], //default 10 //[left,top,right,bottom]
            content: [
                { text: 'ใบขออนุญาตใช้รถส่วนกลาง', fontSize: 18, alignment: 'center', decoration: 'underline' },
                // { text: `วันที่....${moment().format('LL').replace('2023', '2566')}.......`, fontSize: 16, alignment: 'right', marginTop: 20 },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['60%', '40%'], body: [[{ text: `` }, { text: `วันที่ ${moment().format('LL').replace(y_replace, ' พ.ศ. ' + (y_replace + 543))} ` }],] }, marginTop: 20 },
                { text: `เรียน ผู้อำนวยการโรงพยาบาลศรีสังวรสุโขทัย`, fontSize: 16, alignment: 'left', marginTop: 10 },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['*', '*'], body: [[{ text: `ข้าพเจ้า ${d.staff_reserve}` }, { text: `ตำแหน่ง  ${d.position_name}` }],] }, marginTop: 10, marginLeft: 70 },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['45%', '55%'], body: [[{ text: `กลุ่มงาน/ฝ่าย  ${d.dept_name}` }, { text: `ขออนุญาตใช้รถไปราชการที่ ${d.location}` }],] } },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['75%', '25%'], body: [[{ text: `เพื่อ ${d.detail}` }, { text: `มีคนนั่ง  ${d.tcount}  คน` }],] } },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['60%', '40%'], body: [[{ text: `โดยออกเดินทางในวันที่ ${moment(d.start_date).format('LL').replace(y_replace, ' พ.ศ. ' + (y_replace + 543))}   ` }, { text: `เวลา ${d.start_time}  น.` }],] } },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['60%', '40%'], body: [[{ text: `และจะกลับในวันที่  ${moment(d.end_date).format('LL').replace(y_replace, ' พ.ศ. ' + (y_replace + 543))}` }, { text: `เวลา  ${d.end_time}  น.` }],] } },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['45%', '55%'], body: [[{ text: `` }, { text: `(ลงชื่อ)..................................................ผู้ขออนุญาต` }],] }, marginTop: 30, alignment: 'center' },
                {
                    layout: pdfMake.tableLayouts.L1, table: {
                        widths: ['45%', '55%'], body: [[{ text: `` },
                        { text: `( ${d.staff_reserve} )` }],]
                    },
                    marginTop: 0, alignment: 'center'
                },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['45%', '55%'], body: [[{ text: `` }, { text: `(ลงชื่อ)..................................................หัวหน้ากลุ่มงาน/ฝ่าย` }],] }, marginTop: 20, alignment: 'center' },
                {
                    layout: pdfMake.tableLayouts.L1, table: {
                        widths: ['45%', '55%'], body: [[{ text: `` },
                        { text: `( ${d.boss_dept_name == null ? '..............................................' : d.boss_dept_name} )` }],]
                    }, marginTop: 0,
                    alignment: 'center', marginLeft: -100
                },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['45%', '55%'], body: [[{ text: `` }, { text: `......../........../.......` }],] }, marginTop: 0, alignment: 'center', marginLeft: -100 },
                {
                    layout: pdfMake.tableLayouts.L1, table: {
                        widths: ['50%', '50%'], body: [[
                            { text: `เห็นควรอนุญาตให้ใช้รถ ${d.type_car == null ? '..........................................................' : d.type_car}` },
                            { text: `หมายเลขทะเบียน ${d.no_car == null ? '..............................................' : d.no_car}` }],]
                    }, marginTop: 10
                },
                {
                    layout: pdfMake.tableLayouts.L1, table: {
                        widths: ['50%', '50%'], body: [[
                            { text: `โดยให้นาย ${d.keeper_name == null ? '............................................................................' : d.keeper_name} ` },
                            { text: `เป็นคนขับ` }],]
                    }
                },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['45%', '55%'], body: [[{ text: `` }, { text: `(ลงชื่อ)..................................................ผู้จัดรถ` }],] }, marginTop: 20, alignment: 'center' },
                {
                    layout: pdfMake.tableLayouts.L1, table: {
                        widths: ['45%', '55%'], body: [[{ text: `` },
                        { text: `( ${d.admin_approve_name == null ? '..............................................' : d.admin_approve_name} )` }],]
                    },
                    marginTop: 0, alignment: 'center', marginLeft: -50
                },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['45%', '55%'], body: [[{ text: `` }, { text: `......../........../.......` }],] }, marginTop: 0, alignment: 'center', marginLeft: -50 },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['50%', '50%'], body: [[{ text: `` }, { text: `คำสั่ง อนุญาต` }],] }, marginTop: 10, alignment: 'left', marginLeft: -50 },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['45%', '55%'], body: [[{ text: `` }, { text: `(ลงชื่อ)..................................................ผู้อนุญาต` }],] }, marginTop: 20, alignment: 'center' },
                {
                    layout: pdfMake.tableLayouts.L1, table: {
                        widths: ['45%', '55%'], body: [[{ text: `` },
                        { text: `( เธียรชัย กิจสนาโยธิน )` }],]
                    },
                    marginTop: 0, alignment: 'center', marginLeft: -50
                },
                { layout: pdfMake.tableLayouts.L1, table: { widths: ['45%', '55%'], body: [[{ text: `` }, { text: `......../........../.......` }],] }, marginTop: 0, alignment: 'center', marginLeft: -50 },

                { layout: pdfMake.tableLayouts.L1, table: { widths: ['100%', '0%'], body: [[{ text: `*หมายเหตุ  ผู้ขออนุญาตใช้รถและผู้ควบคุมรถ ถ้าสั่งให้รถออกนอกเส้นทางที่อนุญาตต้องรับผิดชอบทุกกรณี` }, { text: `` }],] }, marginTop: 100 },


            ],

            defaultStyle: {
                font: 'THSarabunNew',
                // bold : true,
                // italics : true,
                fontSize: 16
            }
        }).open()
    }
    // end print pdf

    return (
        <div>
            <div className="intro-y    h-10  mt-5">
                <div className="flex  ">
                    <Figma className="top-menu__sub-icon " size={32} />
                    <span className="text-3xl  truncate ml-4">จัดการจองรถ</span>
                </div>
                <br />
            </div>

            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">

                    <div className="dropdown">
                        จำนวนการจอง {data.length} รายการ
                    </div>
                    <div className=" md:block mx-auto text-slate-500">
                        <Radio.Group
                            options={optionsFilter}
                            onChange={onChangeFilter}
                            value={tabFilter}
                            optionType="button"
                            buttonStyle="solid"
                        />
                    </div>
                    {/* <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                        <div className="w-56 relative text-slate-500 hidden">
                            <input type="text" className="form-control w-56 box pr-10" placeholder="Search..." />
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" icon-name="search" className="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
                        </div>
                    </div> */}
                    <div className="w-full sm:w-auto flex mt-4 sm:mt-0">

                        <ConfigProvider locale={locale}>
                            <DatePicker
                                onChange={onChangeDateFilter}
                                placeholder="------เลือกวันที่------"
                                style={{ width: '100%' }}
                                value={
                                    formData.filter_date == null
                                        ? null
                                        : dayjs(formData.filter_date, 'YYYY-MM-DD')
                                }
                            />
                        </ConfigProvider>
                        <button class="btn btn btn-outline-danger mr-2 ml-2 btn-sm" onClick={onPdf}>
                            <Printer className="top-menu__sub-icon  lucide lucide-box w-5 h-5 mr-2" size={20} />
                            <div>พิมพ์</div>
                        </button>
                        <button class="btn btn btn-danger mr-2 ml-2 btn-sm" onClick={getNotApprove} >

                            <div>ไม่อนุมัติ</div>
                        </button>

                    </div>
                </div>
                {/* BEGIN: Users Layout */}
                {data.map((item, i) => {
                    return <div className="intro-y col-span-12 md:col-span-3 zoom-in">
                        <div className="intro-y box mt-5 lg:mt-0">
                            <div className="relative flex items-center p-5" style={{ backgroundColor: item.approve_status == null ? 'white' : item.approve_status == 'Y' ? 'skyblue' : '#F58078', borderRadius: 10 }}>
                                <div className="w-12 h-12 image-fit">
                                    <img
                                        alt="Midone - HTML Admin Template"
                                        className="tooltip rounded-full"
                                        src="dist/images/avatar.png"
                                    />
                                </div>
                                <div className="ml-4 mr-auto">
                                    <div className="font-medium text-base">{item.tname}</div>
                                    <div className="text-slate-500">{item.dept_name}</div>
                                </div>
                                <div className="dropdown">
                                    <Printer
                                        className="top-menu__sub-icon "
                                        size={20}
                                        onClick={()=>onPdfBoss(item.id)}
                                    />
                                </div>
                            </div>
                            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                <div className="flex flex-col sm:flex-row items-center">
                                    <div className="mr-auto">
                                        <a className="flex items-center text-primary font-medium" href>
                                            <CalendarCheck2 className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} /> วันเวลาเดินทาง </a>
                                    </div>
                                    <div className="w-full sm:w-auto flex items-center mt-3 sm:mt-0">
                                        <div className="bg-warning/ text-warning rounded px-2 mr-1">{moment(item.start_date).format("DD/MM/") + (parseInt(moment(item.start_date).format("YYYY")) + 543)}  {item.start_time}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center mt-2">
                                    <div className="mr-auto">
                                        <a className="flex items-center text-primary font-medium" href>
                                            <CalendarCheck2 className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} /> วันเวลากลับ </a>
                                    </div>
                                    <div className="w-full sm:w-auto flex items-center mt-3 sm:mt-0">
                                        <div className=" text-success rounded px-2 mr-1"> {moment(item.end_date).format("DD/MM/") + (parseInt(moment(item.end_date).format("YYYY")) + 543)}  {item.end_time}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center mt-2">
                                    <div className="mr-auto">
                                        <a className="flex items-center text-primary font-medium" href>
                                            <User className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} /> จำนวนคน </a>
                                    </div>
                                    <div className="w-full sm:w-auto flex items-center mt-3 sm:mt-0">
                                        <div className="bg-danger text-white rounded px-2 mr-1">{item.tcount} คน</div>

                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center mt-2">
                                    <div className="mr-auto">
                                        <a className="flex items-center text-primary font-medium" href>
                                            <MapPin className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} /> สถานที่ </a>
                                    </div>

                                </div>
                                <div className="mt-1 ml-6" style={{ color: 'grey', fontWeight: 2 }}>{item.location}</div>
                                <div className="flex flex-col sm:flex-row items-center mt-2">
                                    <div className="mr-auto">
                                        <a className="flex items-center text-primary font-medium" href>
                                            <Database className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} /> รายละเอียด </a>
                                    </div>

                                </div>
                                <div className="mt-1 ml-6" style={{ color: 'grey', fontWeight: 2 }}>
                                    {item.detail}
                                </div>



                            </div>

                            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400 flex">
                                <button className={` btn btn btn${item.approve_status == 'N' ? '-danger' : '-outline-danger'}    w-32`} onClick={() => {

                                    if (item.approve_status == 'N') {
                                        onNotApproveEdit(item.id)
                                    } else {

                                        onNotApprove(item.id)
                                    }

                                }}>
                                    <XCircle className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} />
                                    <div>ไม่อนุมัติ</div>
                                </button>
                                <button type="button" className={` btn btn${item.approve_status == 'Y' ? '-success' : '-outline-success'}  ml-auto w-32`} onClick={() => {
                                    if (item.approve_status == 'Y') {
                                        onEdit(item.id)
                                    } else {

                                        onApprove(item.id)
                                    }

                                }}>
                                    <Check className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} />
                                    <div>อนุมัติ</div>
                                </button>

                            </div>
                        </div>

                    </div>
                })}



                {/* END: Users Layout */}

            </div>

            <Modal
                headStyle={{ backgroundColor: "red" }}
                title={"บันทึกการอนุมัติ"}
                // centered
                open={open}
                onOk={submitApprove}
                onCancel={onExit}
                width="60%"
                className="modalStyle2"
                okText="บันทึก"
                cancelText="ยกเลิก"
            >
                <div className="modal-body " style={{ marginTop: -30 }}>
                    <div className="intro-y  px-5 pt-0 ">
                        <div className="cols-8  ">
                            <Form
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 14 }}
                                layout="horizontal"
                            // initialValues={{ size: componentSize }}
                            // onValuesChange={onFormLayoutChange}
                            >
                                <div className="col-span-12 lg:col-span-12 mt-5">
                                    <label style={{ marginRight: 27 }}>เลือกรถ &nbsp;&nbsp;&nbsp;&nbsp;</label>
                                    <button class="btn btn btn-outline-danger w-40 mr-2 ml-2" onClick={() => setOpen2(true)}>
                                        <Car className="top-menu__sub-icon  lucide lucide-box w-5 h-5 mr-2" size={20} />
                                        <div>คลิกเพื่อเลือกรถ</div>
                                    </button>
                                </div>
                                {formData.no_car == '' ? '' :
                                    <div className="col-span-12 lg:col-span-12 mt-3">
                                        <label style={{ marginRight: 95 }}></label>
                                        <span>{formData.no_car}</span>
                                    </div>}
                                <div className="col-span-12 lg:col-span-12 mt-3">
                                    <label style={{ marginRight: 27 }}>คนขับ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                    <Select
                                        style={{ width: '80%', marginLeft: 5 }}
                                        showSearch
                                        placeholder="---ระบุคนขับ---"
                                        optionFilterProp="children"
                                        onChange={(e) => onSelectKeeper(e)}
                                        // onSearch={onSearchClinic}
                                        filterOption={(input, option) =>
                                            (option?.label ?? "")
                                                .toLowerCase()
                                                .includes(input.toLowerCase())
                                        }
                                        options={dataKeeper}
                                        value={
                                            (formData.keeper == null
                                                ? null
                                                : formData.keeper)
                                        }
                                    >
                                        <Select.Option key={1} value={'admin'}>
                                            {'admin'}
                                        </Select.Option>
                                        <Select.Option key={2} value={'general'}>
                                            {'general'}
                                        </Select.Option>
                                    </Select>
                                </div>
                                <div className="col-span-12 lg:col-span-12 mt-3">
                                    <label style={{ marginRight: 27 }}>จำนวนคน &nbsp;&nbsp;&nbsp;</label>
                                    <Input value={formData.tcount} placeholder="---ระบุจำนวนคน---" style={{ width: '80%' }} onChange={(e) => setFormData({ ...formData, tcount: e.target.value })} />
                                </div>
                                <div className="col-span-12 lg:col-span-12 mt-3">
                                    <label style={{ marginRight: 27 }}>วันที่เดินทาง</label>
                                    <ConfigProvider locale={locale}>
                                        <DatePicker
                                            onChange={onChangeDateStart}
                                            placeholder="------เลือกวันที่นัด------"
                                            style={{ width: '50%' }}
                                            value={
                                                formData.start_date == null
                                                    ? null
                                                    : dayjs(formData.start_date, 'YYYY-MM-DD')
                                            }

                                        />
                                    </ConfigProvider>
                                    {/* <ConfigProvider locale={th_TH}>
                                        <DatePicker
                                            onChange={onChangeDateStart}
                                            placeholder="------เลือกวันที่นัด------"
                                            style={{ width: '50%' }}
                                            value={
                                                formData.start_date == null
                                                    ? null
                                                    : moment(formData.start_date, "YYYY-MM-DD")
                                            }
                                        />
                                    </ConfigProvider> */}
                                    <label style={{ marginRight: 35, marginLeft: 30 }}>
                                        เวลา
                                    </label>
                                    <TimePicker
                                        placeholder="00:00"
                                        defaultValue={moment("00:00", "HH:mm")}
                                        format={"HH:mm"}
                                        style={{ width: 120 }}
                                        onChange={(time, timeString) => {
                                            setFormData({
                                                ...formData,
                                                start_time: timeString,
                                            });
                                        }}
                                        value={
                                            formData.start_time == null
                                                ? null
                                                : dayjs(formData.start_time, "HH:mm")
                                        }
                                    />

                                </div>
                                <div className="col-span-12 lg:col-span-12 mt-3">
                                    <label style={{ marginRight: 27 }}>วันที่กลับ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                    <ConfigProvider locale={locale}>
                                        <DatePicker
                                            onChange={onChangeDateEnd}
                                            placeholder="------เลือกวันที่นัด------"
                                            style={{ width: '50%' }}
                                            value={
                                                formData.end_date == null
                                                    ? null
                                                    : dayjs(formData.end_date, 'YYYY-MM-DD')
                                            }
                                        />
                                    </ConfigProvider>
                                    <label style={{ marginRight: 35, marginLeft: 30 }}>
                                        เวลา
                                    </label>
                                    <TimePicker
                                        placeholder="00:00"
                                        defaultValue={moment("00:00", "HH:mm")}
                                        format={"HH:mm"}
                                        style={{ width: 120 }}
                                        onChange={(time, timeString) => {
                                            setFormData({
                                                ...formData,
                                                end_time: timeString,
                                            });
                                        }}
                                        value={
                                            formData.end_time == null
                                                ? null
                                                : dayjs(formData.end_time, "HH:mm")
                                        }
                                    />

                                </div>
                                <div className="col-span-12 lg:col-span-12 mt-3">
                                    <label style={{ marginRight: 27 }}>รายละเอียด</label>
                                    <TextArea value={formData.comment} rows={4} placeholder="---รายละเอียด---" style={{ width: '80%' }} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} />
                                </div>


                            </Form>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                headStyle={{ backgroundColor: "red" }}
                title={"ไม่อนุมัติ"}
                // centered
                open={open3}
                onOk={submitNotApprove}
                onCancel={onExitNotApprove}
                width="60%"
                className="modalStyle2"
                okText="บันทึก"
                cancelText="ยกเลิก"
            >
                <div className="modal-body " style={{ marginTop: -30 }}>
                    <div className="intro-y  px-5 pt-0 ">
                        <div className="cols-8  ">
                            <Form
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 14 }}
                                layout="horizontal"
                            // initialValues={{ size: componentSize }}
                            // onValuesChange={onFormLayoutChange}
                            >


                                <div className="col-span-12 lg:col-span-12 mt-3">
                                    <label style={{ marginRight: 27 }}>เหตุผล</label>
                                    <TextArea value={notApprove} rows={4} placeholder="---รายละเอียด---" style={{ width: '80%' }} onChange={(e) => setNotApprove(e.target.value)} />
                                </div>


                            </Form>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                headStyle={{ backgroundColor: "red" }}
                title={"เลือกรถ"}
                // centered
                open={open2}
                onOk={onSubmitCar}
                onCancel={onExitCar}
                width="60%"
                className="modalStyle2"
                okText="ตกลง"
                cancelText="ยกเลิก"
            >
                <div className="modal-body " style={{ marginTop: -30 }}>
                    <div className="intro-y  px-5 pt-0 ">
                        {dataCar.map((itemCar, i) => {
                            return <div className="mt-5">
                                <div className="intro-x" onClick={() => {
                                    setSelectCar(itemCar.no)
                                    setFormData({ ...formData, no_car: itemCar.no_car, car_id: itemCar.no })
                                }}>
                                    <div className="box px-5 py-3 mb-3 flex items-center zoom-in">
                                        <div className="w-12 h-12 mr-5 float-left image-fit">
                                            <img alt="Midone - HTML Admin Template" src={BASE_URL + '/' + itemCar.image_car} data-action="zoom" className="w-full rounded-md" />
                                        </div>
                                        <div className="ml-4 mr-auto">
                                            <div className="font-medium">{itemCar.no_car}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{itemCar.type_car} | ผู้รับผิดชอบ  : {itemCar.keeper} </div>
                                        </div>
                                        {selectCar == itemCar.no ? <Check className="top-menu__sub-icon text-success   lucide lucide-box w-6 h-6 mr-2" /> : ''}

                                    </div>
                                </div>

                            </div>
                        })}





                    </div>


                </div>
            </Modal>


        </div>
    )
}

export default AdminCar_