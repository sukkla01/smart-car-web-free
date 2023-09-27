import React, { useEffect, useState } from "react";
import { CalendarCheck2, Plus, Trash, ClipboardEdit, MoreHorizontal } from "lucide-react";
import { MapPin, User, Database, Car, Printer } from "lucide-react";
import {
    Button,
    Modal,
    notification,
    Select,
    ConfigProvider,
    DatePicker,
    TimePicker,
    Input,
    Popconfirm,
    Badge, Row, Col, Timeline
} from "antd";
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import locale from 'antd/locale/th_TH';
import config from "../../config";
import jwt_decode from "jwt-decode";
import axios from "axios";
import io from "socket.io-client"
import { pdfMake } from "../../lib/pdfmake";

const { TextArea } = Input;

let y_replace = 2023


const BASE_URL = config.BASE_URL;
const socket = io(BASE_URL)

const Reserve_ = () => {
    const [dataHistory, setDataHistory] = useState([]);
    const [DataDept, setDataDept] = useState([]);
    const [DataTname, setDataTname] = useState([]);
    const [DataPosition, setDataPosition] = useState([]);
    const [formData, setFormData] = useState({ id: null, username: null, dept: null, position: null, tcount: '', location: '', start_date: null, start_time: null, end_date: null, end_time: null, detail: '', staff: '' });
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [data, setData] = useState([1]);
    const [isConnected, setIsConnected] = useState(socket.connected)


    useEffect(() => {
        getReserve()
        getDept()
        getTname()
        getPosition()

        // ------------------------------------------------------------------------------------------------- START CONNECT SOCKET
        socket.on("connect", () => {
            setIsConnected(true)
        })

        socket.on("disconnect", () => {
            setIsConnected(false)
        })
        // ------------------------------------------------------------------------------------------------- END CONNECT SOCKET

        socket.on("add-approve-boss-admin", (data) => {
            const token = localStorage.getItem("token");
            const decoded = jwt_decode(token);

            if (decoded.dept == data) {
                console.log('xxx')
                getReserve()
                // openNotificationApprove('success')
            }

        })

        return () => {
            socket.off("connect")
            socket.off("disconnect")
        }

    }, []);


    const openNotificationWithIconSuccess = (type) => {
        notification[type]({
            message: "แจ้งเตือน",
            description: "บันทึกรายการนัดเรียบร้อยแล้ว",
            duration: 5,
            style: { backroundColor: "#164E63" },
        });
    };

    const openNotificationApprove = (type) => {
        notification[type]({
            message: "แจ้งเตือน",
            description: "มีรายการถูกอนุมัติแล้ว",
            duration: 5000,
            style: { backroundColor: "#164E63" },
        });
    };
    const openNotificationError = (type) => {
        notification[type]({
            message: "แจ้งเตือน",
            description: "กรุณากรอกข้อมูลให้ครับ",
            duration: 1,
            style: { backroundColor: "#164E63" },
        });
    };


    const getReserve = async () => {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        setFormData({ ...formData, staff: decoded.username, username: decoded.username, dept: decoded.dept })
        console.log(decoded.dept)
        try {
            let res = await axios.get(`${BASE_URL}/get-reserve-car-user/${decoded.dept}/${decoded.username}`, {
                headers: { token: token },
            });
            setDataHistory(res.data)
        } catch (error) {
            console.log(error);
        }
    };
    const getDept = async () => {
        const token = localStorage.getItem("token");
        let tmp = []
        try {
            let res = await axios.get(`${BASE_URL}/get-dept`, {
                headers: { token: token },
            });
            res.data.map((item, i) => {
                tmp.push({
                    value: item.id,
                    label: item.name,
                });
            });
            setDataDept(tmp)
        } catch (error) {
            console.log(error);
        }
    };
    const getTname = async () => {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        let tmp = []
        try {
            let res = await axios.get(`${BASE_URL}/get-user-all`, {
                headers: { token: token },
            });

            res.data.map((item, i) => {
                tmp.push({
                    value: item.username,
                    label: item.tname,
                });
            });
            setDataTname(tmp)
        } catch (error) {
            console.log(error);
        }
    };
    const getPosition = async () => {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        let tmp = []
        try {
            let res = await axios.get(`${BASE_URL}/get-position`, {
                headers: { token: token },
            });

            res.data.map((item, i) => {
                tmp.push({
                    value: item.id,
                    label: item.name,
                });
            });
            setDataPosition(tmp)
        } catch (error) {
            console.log(error);
        }
    };
    const onSelectTname = (id) => {
        setFormData({ ...formData, username: id })
    }
    const onSelectDept = (id) => {
        setFormData({ ...formData, dept: id })
    }
    const onSelectPosition = (id) => {
        setFormData({ ...formData, position: id })
    }

    const onChangeDateStart = (date, dateString) => {
        setFormData({ ...formData, start_date: dateString });

    }
    const onChangeDateEnd = (date, dateString) => {
        setFormData({ ...formData, end_date: dateString });

    }

    const onOpenModal = () => {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        setFormData({ ...formData, staff: decoded.username, username: decoded.username, dept: decoded.dept })
        setOpen(true)
        onReset()
    }

    const onSubmit = async () => {
        const token = localStorage.getItem("token");
        // const [formData, setFormData] = useState({ id: null, username: null, dept: null, position: null, tcount: '', location: '', start_date: null, start_time: null, end_date: null, end_time: null, detail: '', staff: '' });

        if (formData.username == null || formData.dept == null || formData.position == null || formData.tcount == null ||
            formData.location == null || formData.start_date == null || formData.start_time == null || formData.end_date == null || formData.end_time == null) {
            openNotificationError('error')
        } else {
            try {
                let res = await axios.post(`${BASE_URL}/add-reserve-car`, formData, {
                    headers: { token: token },
                });
                openNotificationWithIconSuccess('success')
                onReset()
                setOpen(false)
                getReserve()
                socket.emit('user-reserve', formData.dept)
            } catch (error) {
                console.log(error);
            }
        }

    }
    const onCancelModal = () => {
        setOpen(false)
        onReset()
    }
    const onReset = () => {
        setFormData({ ...formData, id: null, position: null, tcount: '', location: '', start_date: null, start_time: null, end_date: null, end_time: null, detail: '' })
    }

    const deleteCar = async (id) => {
        const token = localStorage.getItem("token");
        let data = {
            id: id
        }
        try {
            let res = await axios.post(`${BASE_URL}/del-reserve-car`, data, {
                headers: { token: token },
            });
            openNotificationWithIconSuccess('success')
            getReserve()
            socket.emit('user-reserve')
        } catch (error) {
            console.log(error);
        }
    }
    const EditCar = async (id) => {
        const token = localStorage.getItem("token");
        let data = {
            id: id
        }

        try {
            let res = await axios.get(`${BASE_URL}/edit-reserve-car/${id}`, {
                headers: { token: token },
            });
            let r = res.data[0]
            console.log(r)
            setFormData({
                id: r.id, username: r.username, dept: r.dept, position: r.position, tcount: r.tcount, location: r.location,
                start_date: r.start_date_c, start_time: r.start_time, end_date: r.enddate_date_c, end_time: r.end_time, detail: r.detail,
                staff: r.staff
            })
            setOpen(true)

        } catch (error) {
            console.log(error);
        }
    }

    const onDetail = async (id) => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-approve-detail/${id}`, {
                headers: { token: token },
            });
            setData(res.data)
            setOpen2(true)
            // console.log(res.data[0])
        } catch (error) {
            console.log(error);
        }

    }

    // print pdf
    const onPdf = async (id) => {
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
        <div className="intro-y    h-10">
            <div className="flex mt-5">
                <CalendarCheck2 className="top-menu__sub-icon " size={32} />
                <span className="text-3xl  truncate ml-4">รายการจองรถ  </span>

            </div>
            <br />
            <div className="intro-y flex items-center h-2 mt-5">
                <div
                    className="form-check form-switch w-full sm:w-auto sm:ml-auto mt-0 sm:mt-0"
                    style={{ width: 150 }}
                ></div>
                <div
                    className="form-check form-switch w-full  mt-0 sm:mt-0"
                    style={{ width: 150 }}
                >
                    <button
                        className="btn btn-success  mr-2 mb-2  col-span-2  w-40"
                        // data-tw-toggle="modal"
                        // data-tw-target="#header-footer-modal-preview"
                        onClick={() => {
                            onOpenModal()
                            // formData.cid == ""
                            //     ? openNotificationWithIcon("error")
                            //     : getPatientId(formData.cid)
                            // setStatusEA('A')
                            // setActiveModal(2)
                        }
                        }
                    >
                        <Plus
                            className="top-menu__sub-icon "
                            size={22}
                            style={{ marginRight: 5 }}
                        />
                        <div>บันทึกจองรถ</div>
                    </button>
                </div>
            </div>
            <div className="intro-y flex items-center h-2 mt-5">
                จำนวนการจอง {dataHistory.length} รายการ
            </div>


            <div className="intro-y overflow-auto lg:overflow-visible mt-2 sm:mt-0">
                <table className="table table-report sm:mt-2">
                    <tbody style={{ marginTop: -50 }}>
                        {dataHistory.map((item, i) => {
                            return (

                                <tr className="intro-x cursor-pointer zoom-in box" key={i}
                                    onClick={() => {
                                        // getPatientId(item.cid)
                                        // setOpen(true)
                                        // // setFormData({ ...formData, cid: item.cid })
                                        // setStatusEA('A')
                                        // setActiveModal(2)
                                    }}
                                >
                                    <td className="w-20 ">
                                        <div className="flex">
                                            <div className="w-12 h-12 image-fit zoom-in">
                                                <img
                                                    alt="Midone - HTML Admin Template"
                                                    className="tooltip rounded-full"
                                                    src="dist/images/avatar.png"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-lg"> {item.location} </span>

                                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                            <span className="mr-2"> วันเวลาเดินทาง :  {moment(item.start_date).format('DD/MM/YYYY')}  {item.start_time}    </span>
                                            {/* <span className="ml-2">เวลาเดินทาง :  {item.start_time} </span> */}
                                        </div>
                                    </td>
                                    {/* <td className="text-left w-24">
                      <span className="text-sm"> {moment(item.nextdate).format('DD/MM/yyyy')} </span>

                      <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                        <span className="mr-2"> วันที่นัด</span>
                      </div>
                    </td> */}
                                    <td className="text-right w-40 " onClick={() => onDetail(item.id)}>
                                        <span className="text-sm"> {item.boss_admin == null || item.approve_status == 'N' ? '' : <>
                                            <Badge status="success" text=" " />{item.type_car}</>}
                                        </span>
                                        <div className="text-slate-500   whitespace-nowrap mt-0.5">
                                            {item.boss_admin == null ? <><Badge status="warning" text=" " /><span className="mr-0 text-warning"> รออนุมัติ</span></> :
                                                item.approve_status == 'Y' ?
                                                    <button className="btn btn-sm btn-primary  "><div>{item.no_car}</div></button> :
                                                    <> <Badge status="error" text=" " /><span className="mr-0 text-danger"> ไม่อนุมัติ</span></>
                                            }
                                        </div>
                                    </td>

                                    <td className="table-report__action w-48" >
                                        <div>
                                            <button className="btn btn-success mr-2 mb-2" onClick={() => onPdf(item.id)}>
                                                <Printer
                                                    className="top-menu__sub-icon "
                                                    size={14}
                                                />
                                            </button>
                                            {item.approve_status == null ?
                                                <button className="btn btn-warning mr-1 mb-2" onClick={() => EditCar(item.id)}>
                                                    <ClipboardEdit
                                                        className="top-menu__sub-icon "
                                                        size={14}
                                                    />
                                                </button> :
                                                <button className="btn btn-secondary mr-1 mb-2" >
                                                    <ClipboardEdit
                                                        className="top-menu__sub-icon "
                                                        size={14}
                                                    />
                                                </button>}

                                            {item.approve_status == null ?
                                                <Popconfirm
                                                    title="คุณต้องการลบหรือไม่"
                                                    onConfirm={() => deleteCar(item.id)}
                                                    // onCancel={cancel}
                                                    okText="ตกลง"
                                                    cancelText="ออก"
                                                >
                                                    <button className="btn btn-danger mr-1 mb-2">
                                                        <Trash
                                                            className="top-menu__sub-icon "
                                                            size={14}
                                                        />
                                                    </button>
                                                </Popconfirm> : <button className="btn btn-secondary mr-1 mb-2">
                                                    <Trash
                                                        className="top-menu__sub-icon "
                                                        size={14}
                                                    />
                                                </button>}


                                        </div>
                                    </td>
                                </tr>

                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Modal
                title={'บันทึกการจอง'}
                // centered
                open={open}
                onOk={onSubmit}
                onCancel={onCancelModal}
                width="60%"
                // className="modalStyle2"
                okText="บันทึก"
                cancelText="ยกเลิก"
                bodyStyle={{ backgroundColor: "#F8FAFC" }}
                closable={false}
                maskClosable={false}
            // visible={true}
            >
                <div className="modal-body " style={{ marginTop: -30 }}>

                    <div>
                        <div className=" grid grid-cols-12 gap-3">
                            {/* //--------------------------------------------------------- เลือกรายการนัด  -------------------------------------------------------------------// */}
                            <div className="col-span-12 lg:col-span-12">
                                <div className="box intro-y mt-3">
                                    <div className="box">
                                        <div className="intro-y box p-5 mt-5 sm:mt-2">
                                            <div className="col-span-12 lg:col-span-12 mt-3">
                                                <label style={{ marginRight: 27 }}>ชื่อ-สกุล &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                                {/* <Input placeholder="---ระบุชื่อ-สกุล---" style={{ width: '80%' }} /> */}
                                                <Select
                                                    style={{ width: '80%', marginLeft: 5 }}
                                                    showSearch
                                                    placeholder="---ระบุชื่อ-สกุล---"
                                                    optionFilterProp="children"
                                                    onChange={(e) => onSelectTname(e)}
                                                    // onSearch={onSearchClinic}
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? "")
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    options={DataTname}
                                                    value={
                                                        (formData.username == null
                                                            ? null
                                                            : formData.username)
                                                    }
                                                />

                                            </div>
                                            <div className="col-span-12 lg:col-span-12 mt-3">
                                                <label style={{ marginRight: 27 }}>แผนก &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </label>
                                                {/* <Input placeholder="---ระบุแผนก---" style={{ width: '80%' }} /> */}
                                                <Select
                                                    style={{ width: '80%', marginLeft: 5 }}
                                                    showSearch
                                                    placeholder="---ระบุแผนก---"
                                                    optionFilterProp="children"
                                                    onChange={(e) => onSelectDept(e)}
                                                    // onSearch={onSearchClinic}
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? "")
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    options={DataDept}
                                                    value={
                                                        (formData.dept == null
                                                            ? null
                                                            : parseInt(formData.dept))
                                                    }
                                                />
                                            </div>
                                            <div className="col-span-12 lg:col-span-12 mt-3">
                                                <label style={{ marginRight: 27 }}>ตำแหน่ง &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                                {/* <Input placeholder="---ระบุตำแหน่ง---" style={{ width: '80%' }} /> */}
                                                <Select
                                                    style={{ width: '80%', marginLeft: 5 }}
                                                    showSearch
                                                    placeholder="---ระบุตำแหน่ง---"
                                                    optionFilterProp="children"
                                                    onChange={(e) => onSelectPosition(e)}
                                                    // onSearch={onSearchClinic}
                                                    filterOption={(input, option) =>
                                                        (option?.label ?? "")
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase())
                                                    }
                                                    options={DataPosition}
                                                    value={
                                                        (formData.position == null
                                                            ? null
                                                            : parseInt(formData.position))
                                                    }
                                                />
                                            </div>
                                            <div className="col-span-12 lg:col-span-12 mt-3">
                                                <label style={{ marginRight: 27 }}>จำนวนคน &nbsp;&nbsp;&nbsp;&nbsp;</label>
                                                <Input value={formData.tcount} placeholder="---ระบุจำนวนคน---" style={{ width: '80%' }} onChange={(e) => setFormData({ ...formData, tcount: e.target.value })} />
                                            </div>


                                            <div className="col-span-12 lg:col-span-12 mt-3">
                                                <label style={{ marginRight: 27 }}>สถานที่ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                                <Input value={formData.location} placeholder="---ระบุสถานที่---" style={{ width: '80%' }} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
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
                                                <label style={{ marginRight: 35, marginLeft: 30 }}>
                                                    เวลา
                                                </label>
                                                <TimePicker
                                                    placeholder="00:00"
                                                    defaultValue={moment("08:00", "HH:mm")}
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
                                                    defaultValue={dayjs("16:30", "HH:mm")}
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

                                            <div className="col-span-12 lg:col-span-12  mt-3">
                                                <label style={{ marginRight: 27 }}>รายละเอียด </label>
                                                <Input value={formData.detail} placeholder="---รายละเอียด---" style={{ width: '80%' }} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* //------------------------------------------------------------- เลือกรายการนัด  ------------------------------------------------------------------// */}


                        </div>

                    </div>
                </div>
            </Modal>
            <Modal
                headStyle={{ backgroundColor: "red" }}
                title={"รายละเอียด"}
                // centered
                open={open2}
                onOk={() => setOpen2(false)}
                onCancel={() => setOpen2(false)}
                width="60%"
                className="modalStyle2"
                okText="ตกลง"
                cancelText="ยกเลิก"
            >
                <div className="modal-body " style={{ marginTop: -30 }}>
                    <Row className="mt-5">
                        <Col span={12}>
                            <div className="intro-y  px-5 pt-0 ">
                                {data.length > 0 ? data[0].boss_admin_date == null ?
                                    <div className="text-warning" style={{ fontSize: 30, textAlign: 'center', marginTop: 30 }}>
                                        รออนุมัติ
                                    </div>
                                    :
                                    data[0].approve_status == 'N' ? <div >
                                        <div className="text-danger" style={{ fontSize: 30, textAlign: 'center', marginTop: 30 }}>ไม่อนุมัติ</div>
                                        <p style={{ textAlign: 'center', marginTop: 10 }}>
                                            เหตุผล   : {data[0].comment}
                                        </p>
                                    </div> :
                                        <div className="intro-y col-span-12 md:col-span-3 zoom-in mt-5">
                                            <div className="intro-y box mt-5 lg:mt-0">
                                                <div className="relative flex items-center p-5" style={{ backgroundColor: 'white', borderRadius: 10 }}>
                                                    <div className="w-12 h-12 image-fit">
                                                        <img alt="Midone - HTML Admin Template" src={BASE_URL + '/' + data[0].image_car} data-action="zoom" className="w-full rounded-md" />
                                                    </div>
                                                    <div className="ml-4 mr-auto">
                                                        <div className="font-medium text-base">{data[0].type_car}</div>
                                                        <div className="text-slate-500">{data[0].no_car}</div>
                                                    </div>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle w-5 h-5 block" href="javascript:;" aria-expanded="false" data-tw-toggle="dropdown"> <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" icon-name="more-horizontal" data-lucide="more-horizontal" className="lucide lucide-more-horizontal w-5 h-5 text-slate-500"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg> </a>
                                                        <div className="dropdown-menu w-56">

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
                                                    <div className="flex flex-col sm:flex-row items-center">
                                                        <div className="mr-auto">
                                                            <a className="flex items-center text-primary font-medium" href>
                                                                <CalendarCheck2 className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} /> วันเวลาเดินทาง </a>
                                                        </div>
                                                        <div className="w-full sm:w-auto flex items-center mt-3 sm:mt-0">
                                                            <div className="bg-warning/ text-warning rounded px-2 mr-1">{moment(data[0].start_date).format("DD/MM/") + (parseInt(moment(data[0].start_date).format("YYYY")) + 543)}  {data[0].start_time}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-center mt-2">
                                                        <div className="mr-auto">
                                                            <a className="flex items-center text-primary font-medium" href>
                                                                <CalendarCheck2 className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} /> วันเวลากลับ </a>
                                                        </div>
                                                        <div className="w-full sm:w-auto flex items-center mt-3 sm:mt-0">
                                                            <div className=" text-success rounded px-2 mr-1">{moment(data[0].end_date).format("DD/MM/") + (parseInt(moment(data[0].end_date).format("YYYY")) + 543)}  {data[0].end_time} </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-center mt-2">
                                                        <div className="mr-auto">
                                                            <a className="flex items-center text-primary font-medium" href>
                                                                <User className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} /> จำนวนคนทั้งหมด </a>
                                                        </div>
                                                        <div className="w-full sm:w-auto flex items-center mt-3 sm:mt-0">
                                                            <div className="bg-danger text-white rounded px-2 mr-1">{data[0].tcount} คน</div>

                                                        </div>
                                                    </div>
                                                    {console.log(data)}
                                                    <div className="flex flex-col sm:flex-row items-center mt-2">
                                                        <div className="mr-auto">
                                                            <a className="flex items-center text-primary font-medium" href>
                                                                <User className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} /> คนขับรถ </a>
                                                        </div>
                                                        <div className="w-full sm:w-auto flex items-center mt-3 sm:mt-0">
                                                            <div className="bg-success text-white rounded px-2 mr-1">{data[0].keeper_name} </div>

                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-center mt-2">
                                                        <div className="mr-auto">
                                                            <a className="flex items-center text-primary font-medium" href>
                                                                <MapPin className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} /> สถานที่ </a>
                                                        </div>

                                                    </div>
                                                    <div className="mt-1 ml-6" style={{ color: 'grey', fontWeight: 2 }}>{data[0].location} </div>
                                                    <div className="flex flex-col sm:flex-row items-center mt-2">
                                                        <div className="mr-auto">
                                                            <a className="flex items-center text-primary font-medium" href>
                                                                <Database className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} /> รายละเอียด </a>
                                                        </div>

                                                    </div>
                                                    <div className="mt-1 ml-6" style={{ color: 'grey', fontWeight: 2 }}>
                                                        {data[0].detail}
                                                    </div>



                                                </div>


                                            </div>

                                        </div> : ''}



                            </div>

                        </Col>
                        <Col span={12}>
                            <div className="intro-y col-span-12 md:col-span-3 zoom-in mt-5">
                                <div className="intro-y box mt-5 lg:mt-0 mr-5 ml-5">
                                    <div className="text-xl mb-5">Timeline</div>
                                    {console.log(data)}
                                    {data.length > 0 ?
                                        <ConfigProvider locale={locale}>
                                            <Timeline
                                                items={[
                                                    {
                                                        color: 'green',
                                                        children: 'บันทึกการจองเรียบร้อยแล้ว',
                                                    },
                                                    {
                                                        color: `${data[0].boss_dept_date == null ? 'grey' : 'green'}`,
                                                        children: `${data[0].boss_dept_date == null ? 'รอหัวหน้าแผนกอนุมัติ' : 'หัวหน้าแผนกอนุมัติแล้ว ' + moment(data[0].boss_dept_date).format("DD/MM/") + (parseInt(moment(data[0].boss_dept_date).format("YYYY")) + 543) + " " + moment(data[0].boss_dept_date).format("HH:mm") + " น."}   `,
                                                    },
                                                    {
                                                        color: `${data[0].admin_approve_date == null ? 'grey' : 'green'}`,
                                                        children: `${data[0].admin_approve_date == null ? 'รอเจ้าหน้าที่รับการจอง' : 'เจ้าหน้าที่รับการจองแล้ว ' + moment(data[0].admin_approve_date).format("DD/MM/") + (parseInt(moment(data[0].admin_approve_date).format("YYYY")) + 543) + " " + moment(data[0].admin_approve_date).format("HH:mm") + " น."}   `,
                                                    },
                                                    {
                                                        color: `${data[0].boss_admin_date == null ? 'grey' : 'green'}`,
                                                        children: `${data[0].boss_admin_date == null ? 'รอหัวหน้าเจ้าหน้าที่อนุมัติ' : 'หัวหน้าเจ้าหน้าที่อนุมัติแล้ว ' + moment(data[0].boss_admin_date).format("DD/MM/") + (parseInt(moment(data[0].boss_admin_date).format("YYYY")) + 543) + " " + moment(data[0].boss_admin_date).format("HH:mm") + " น."}   `,
                                                    },
                                                    {
                                                        color: `${data[0].boss_admin_date == null ? 'grey' : 'green'}`,
                                                        children: 'เสร็จสิ้น',
                                                    },


                                                ]}
                                            /></ConfigProvider> : ''}
                                </div>
                            </div>
                        </Col>
                    </Row>


                </div>
            </Modal>
        </div>
    )
}

export default Reserve_