import React, { useEffect, useState } from "react";
import { Activity, Bus, Clock2, Home } from "lucide-react";
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
import Chart1 from "./ChartDash/Chart1";
import Chart2 from "./ChartDash/Chart2";

const { TextArea } = Input;
const { Meta } = Card;
const BASE_URL = config.BASE_URL;
const socket = io(BASE_URL)
import { useRouter } from "next/router";

const Dashboard = () => {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [open, setOpen] = useState(false);
    const [notApprove, setNotApprove] = useState('');
    const [tabFilter, setTabFilter] = useState('waitapprove');
    const [isConnected, setIsConnected] = useState(socket.connected)

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        getDash1()
        getDash2()
        // onChangeFilter(tabFilter)
        // ------------------------------------------------------------------------------------------------- START CONNECT SOCKET
        socket.on("connect", () => {
            setIsConnected(true)
        })

        socket.on("disconnect", () => {
            setIsConnected(false)
        })
        // ------------------------------------------------------------------------------------------------- END CONNECT SOCKET

        // socket.on("user-add-reserve", (data) => {
        //     if (decoded.dept == data) {
        //         setTabFilter('waitapprove')
        //         getReserveAll('waitapprove')
        //         AlertNoti()
        //     }


        // })
        return () => {
            socket.off("connect")
            socket.off("disconnect")
        }

    }, []);

    const getDash1 = async (value) => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-dash1`, { headers: { "token": token } })
            setData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getDash2 = async (value) => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-dash2`, { headers: { "token": token } })
            setData2(res.data)
        } catch (error) {
            console.log(error)
        }
    }


    const boss_dept = () => {
        localStorage.setItem("NavId", 10);
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        console.log(decoded)
        if (decoded.role == 'admin' || decoded.role == 'superadmin') {
            router.push({
                pathname: '/admin-detail',
            })
        } else {
            router.push({
                pathname: '/boss-dept',
            })
        }

    }
    const admin_car = () => {
        localStorage.setItem("NavId", 3);
        router.push({
            pathname: '/admin-car',
        })
    }
    const boss_admin = () => {
        localStorage.setItem("NavId", 11);
        router.push({
            pathname: '/boss-admin',
        })
    }

    return (
        <>
            {data.length > 0 ?
                <div className="col-span-12 mt-8">
                    <div className="intro-y    h-10  mt-5">
                        <div className="flex  ">
                            <Home className="top-menu__sub-icon " size={32} />
                            <span className="text-3xl  truncate ml-4">หน้าหลัก</span>
                        </div>
                        <br />
                    </div>
                    <div className="grid grid-cols-12 gap-6 mt-5" >
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y" onClick={boss_dept}>
                            <div className="report-box zoom-in">
                                <div className="box p-5">
                                    <div className="flex">
                                        <Clock2 className="top-menu__sub-icon  lucide lucide-box w-8 h-8 mr-2 text-warning" />
                                        {/* <div className="ml-auto">
                                            <div className="report-box__indicator bg-success tooltip cursor-pointer"> 33% <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" icon-name="chevron-up" data-lucide="chevron-up" className="lucide lucide-chevron-up w-4 h-4 ml-0.5"><polyline points="18 15 12 9 6 15" /></svg> </div>
                                        </div> */}
                                    </div>
                                    <div className="text-3xl font-medium leading-8 mt-6">{data[0].sumBossDept}</div>
                                    <div className="text-base text-slate-500 mt-1">รอหัวหน้ากลุ่มงานอนุมัติ</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y" onClick={admin_car}>
                            <div className="report-box zoom-in">
                                <div className="box p-5">
                                    <div className="flex">
                                        <Clock2 className="top-menu__sub-icon  lucide lucide-box w-8 h-8 mr-2 text-warning" />
                                        {/* <div className="ml-auto">
                                            <div className="report-box__indicator bg-danger tooltip cursor-pointer"> 2% <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" icon-name="chevron-down" data-lucide="chevron-down" className="lucide lucide-chevron-down w-4 h-4 ml-0.5"><polyline points="6 9 12 15 18 9" /></svg> </div>
                                        </div> */}
                                    </div>
                                    <div className="text-3xl font-medium leading-8 mt-6">{data[0].sumAdminApprove}</div>
                                    <div className="text-base text-slate-500 mt-1">รอเจ้าหน้าที่จัดการรถ</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y" onClick={boss_admin}>
                            <div className="report-box zoom-in">
                                <div className="box p-5">
                                    <div className="flex">
                                        <Clock2 className="top-menu__sub-icon  lucide lucide-box w-8 h-8 mr-2 text-warning" />
                                        {/* <div className="ml-auto">
                                            <div className="report-box__indicator bg-success tooltip cursor-pointer"> 12% <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" icon-name="chevron-up" data-lucide="chevron-up" className="lucide lucide-chevron-up w-4 h-4 ml-0.5"><polyline points="18 15 12 9 6 15" /></svg> </div>
                                        </div> */}
                                    </div>
                                    <div className="text-3xl font-medium leading-8 mt-6">{data[0].sumBossAdmin}</div>
                                    <div className="text-base text-slate-500 mt-1">รอรองบริหารอนุมัติ</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                            <div className="report-box zoom-in">
                                <div className="box p-5">
                                    <div className="flex">
                                        <Bus className="top-menu__sub-icon  lucide lucide-box w-8 h-8 mr-2 text-success" />
                                    </div>
                                    <div className="text-3xl font-medium leading-8 mt-6">{data[0].total}</div>
                                    <div className="text-base text-slate-500 mt-1">จองรถทั้งหมด</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : ''
            }

            <div className="col-span-12 mt-10" >
                <div className="intro-y    h-10  mt-10">
                    <div className="flex  ">
                        <Activity className="top-menu__sub-icon " size={32} />
                        <span className="text-xl  truncate ml-4">{'จำนวนการจองรถ  แยกตามหน่าวยงาน(ครั้ง)'}</span>
                    </div>
                    <br />
                </div>
            </div>
            <div className="col-span-12 mt-0" >
                <table className="table table-report mt-2 table-responsive">

                    <tbody>
                        {data2.map((item, i) => {
                            return <tr className="intro-x">
                                <td className="w-5">
                                    <div className="flex">
                                        <div className="w-5 h-6 image-fit zoom-in text-xl">
                                            {i + 1}
                                        </div>

                                    </div>
                                </td>
                                <td>
                                    <a href className="font-medium whitespace-wrap auto-size " style={{ fontSize: 16 }}>{item.dept_name}</a>
                                    {/* <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">Photography</div> */}
                                </td>
                                {/* <td className="text-center">50</td>
                            <td className="w-40">
                                <div className="flex items-center justify-center text-success"> <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" icon-name="check-square" data-lucide="check-square" className="lucide lucide-check-square w-4 h-4 mr-2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg> Active </div>
                            </td> */}
                                <td className="table-report__action w-24">
                                    <div className="flex justify-center items-center text-xl">
                                        {item.tcount}
                                    </div>
                                </td>
                            </tr>
                        })}


                    </tbody>
                </table>
            </div>
            <div class="grid grid-cols-12 gap-6 mt-5">
                <div class="intro-y col-span-12 lg:col-span-6">
                    <div class="report-box-2 intro-y mt-12 sm:mt-5">
                        <div class="box ">
                            <div style={{ paddingLeft: 50, paddingTop: 20, paddingBottom: 20, fontSize: 20 }}>ข้อมูลการขอใช้รถแยกตาม ปี</div>
                            <Chart2 />
                        </div>
                    </div>
                </div>
                <div class="intro-y col-span-12 lg:col-span-6">
                    <div class="report-box-2 intro-y mt-12 sm:mt-5">
                        <div class="box ">
                            <div style={{ paddingLeft: 50, paddingTop: 20, paddingBottom: 20, fontSize: 20 }}>ข้อมูลการขอใช้รถแยกตาม เดือน</div>
                            <Chart1 />
                        </div>
                    </div>
                </div>
            </div>


            {/* <Chart1 /> */}

        </>

    )
}

export default Dashboard