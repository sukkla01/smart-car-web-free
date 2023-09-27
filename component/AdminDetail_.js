import React, { useEffect, useState } from "react";
import { Activity, Bus, Clock2, Figma } from "lucide-react";
import axios from "axios";
import config from "../config";
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");
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

const BASE_URL = config.BASE_URL;

const AdminDetail_ = () => {
    const [dataHistory, setDataHistory] = useState([]);


    useEffect(() => {
        getReserve()
    }, []);


    const getReserve = async () => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-wait-approve-bossdept`, {
                headers: { token: token },
            });
            console.log(res.data)
            setDataHistory(res.data)
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="intro-y    h-10  mt-5">
            <div className="flex  ">
                <Figma className="top-menu__sub-icon " size={32} />
                <span className="text-3xl  truncate ml-4">รายการรอหัวหน้าอนุมัติ</span>
            </div>
            <br />
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
                                            <span className="ml-2">ผู้ขอ :  {item.tname} </span>
                                            <span className="ml-2">หน่วยงาน :  {item.dept_name} </span>
                                        </div>
                                    </td>
                                    {/* <td className="text-left w-24">
                      <span className="text-sm"> {moment(item.nextdate).format('DD/MM/yyyy')} </span>

                      <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                        <span className="mr-2"> วันที่นัด</span>
                      </div>
                    </td> */}
                                    <td className="text-right w-40 " >
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


                                </tr>

                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default AdminDetail_