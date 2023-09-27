import React, { useEffect, useState } from "react";
import { Figma, CalendarCheck2, MapPin, User, Database, Codesandbox, Check } from "lucide-react";
import { Switch, Modal, Form, Input, Select, DatePicker, Popconfirm, TimePicker, Card, Radio, notification } from "antd";
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

const { TextArea } = Input;
const { Meta } = Card;
const BASE_URL = config.BASE_URL;
const socket = io(BASE_URL)

const BossDept_ = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
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

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        getReserveAll()
        // onChangeFilter(tabFilter)
        // ------------------------------------------------------------------------------------------------- START CONNECT SOCKET
        socket.on("connect", () => {
            setIsConnected(true)
        })

        socket.on("disconnect", () => {
            setIsConnected(false)
        })
        // ------------------------------------------------------------------------------------------------- END CONNECT SOCKET

        socket.on("user-add-reserve", (data) => {
            if (decoded.dept == data) {
                setTabFilter('waitapprove')
                getReserveAll('waitapprove')
                // AlertNoti()
            }


        })

        return () => {
            socket.off("connect")
            socket.off("disconnect")
          }

    }, []);

    const AlertNoti = () => {
        openNotificationWithIconSuccess('success')
    }


    const getReserveAll = async (value) => {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        let tmp_value = value == 'waitapprove' ? value : tabFilter
        try {
            let res = await axios.get(`${BASE_URL}/get-approve-boss-dept/${tmp_value}/${decoded.dept}`, { headers: { "token": token } })
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const onChangeFilter = async ({ target: { value } }) => {
        setTabFilter(value)
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        try {
            let res = await axios.get(`${BASE_URL}/get-approve-boss-dept/${value}/${decoded.dept}`, { headers: { "token": token } })
            setData(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
        // setValue3(value);
    };

    const submit = async (id) => {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);

        let post = {
            head_id: id,
            staff: decoded.username
        }
        try {
            let res = await axios.post(`${BASE_URL}/add-approve-boss-dept`, post, { headers: { "token": token } })
            getReserveAll()
            socket.emit('boss-dept-approve')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className="intro-y    h-10  mt-5">
                <div className="flex  ">
                    <Codesandbox className="top-menu__sub-icon " size={32} />
                    <span className="text-3xl  truncate ml-4">หัวหน้าแผนก</span>
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
                        <div className="w-56 relative text-slate-500">
                            <input type="text" className="form-control w-56 box pr-10" placeholder="Search..." />
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" icon-name="search" className="lucide lucide-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" data-lucide="search"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
                        </div>
                    </div> */}
                </div>
                {/* BEGIN: Users Layout */}
                {data.map((item, i) => {
                    return <div className="intro-y col-span-12 md:col-span-3 zoom-in" key={i}>
                        <div className="intro-y box mt-5 lg:mt-0">
                            <div className="relative flex items-center p-5" style={{ backgroundColor: item.boss_dept == null ? 'white' : 'skyblue', borderRadius: 10 }}>
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

                            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400 ">
                                {/* <button className={` btn btn btn${item.approve_status == 'N' ? '-danger' : '-outline-danger'}    w-32`} onClick={() => {

                                    if (item.approve_status == 'N') {
                                        onNotApproveEdit(item.id)
                                    } else {

                                        onNotApprove(item.id)
                                    }

                                }}>
                                    <CalendarCheck2 className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} />
                                    <div>ไม่อนุมัติ</div>
                                    
                                </button> */}
                                {item.boss_dept == null ?
                                    <Popconfirm
                                        title="คุณต้องการอนุมัติหรือไม่"
                                        onConfirm={() => submit(item.id)}
                                        // onCancel={cancel}
                                        okText="ตกลง"
                                        cancelText="ออก"
                                    >
                                        <button type="button" className={` btn btn${item.boss_dept == null ? '-outline-success' : '-success'}  `} style={{ width: '100%' }}>
                                            <Check className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} />
                                            <div>อนุมัติ</div>
                                        </button>
                                    </Popconfirm> :
                                    <button type="button" className={` btn btn${item.boss_dept == null ? '-outline-success' : '-success'}  `} style={{ width: '100%' }}>
                                        <Check className="top-menu__sub-icon  lucide lucide-box w-4 h-4 mr-2" size={18} />
                                        <div>อนุมัติ</div>
                                    </button>}
                            </div>
                        </div>

                    </div>
                })}




            </div>





        </div>
    )
}

export default BossDept_