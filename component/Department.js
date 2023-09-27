import React, { useEffect, useState } from "react";
import { Cog, Trash, Edit, Plus, Flag } from "lucide-react";
import { Switch, Modal, Form, Input, Select, Popconfirm } from "antd";
import axios from "axios";
import config from "../config";

const BASE_URL = config.BASE_URL;


const Department = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: ""
    });
    useEffect(() => {
        getDeptAll()
    }, []);

    const getDeptAll = async () => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-dept-all`, {
                headers: { token: token },
            });
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };


    const getDepId = async (id) => {
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-dept-id/${id}`, {
                headers: { token: token },
            });
            // console.log(res.data)
            setFormData({
                id: res.data[0].id,
                name: res.data[0].name
            })
            setOpen(true)
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async () => {
        // setOpen(false)
        // console.log(formData);
        const token = localStorage.getItem("token");


        try {
            let res = await axios.post(`${BASE_URL}/add-dept`, formData, {
                headers: { token: token },
            });
            getDeptAll();
            // onReset();
            setOpen(false)
            setFormData({ id: null, name: '' })
            // Alert()
        } catch (error) {
            console.log(error);
        }
    };
    const onExit = () => {
        // onReset();
        setOpen(false);
    };

    const onDelete = async (id) => {
        const token = localStorage.getItem("token");
        let data = {
            id: id
        }
        try {
            let res = await axios.post(`${BASE_URL}/delete-dept`, data, {
                headers: { token: token },
            });
            getDeptAll()
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="col-12 mt-6">
            <div className="intro-y    h-10">
                <div className="flex  ">
                    <Cog className="top-menu__sub-icon " size={32} />
                    <span className="text-3xl  truncate ml-4">จัดการหน่วยงาน</span>
                </div>
                <br />
            </div>

            <div className="intro-y box">
                <div id="vertical-form" className="p-5">
                    <div className="preview">
                        <div className="overflow-x-auto">
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
                                        className="btn btn-success  mr-2 mb-2 ml-2 col-span-2  w-40"
                                        // data-tw-toggle="modal"
                                        // data-tw-target="#header-footer-modal-preview"
                                        onClick={() => {
                                            setOpen(true)
                                        }}
                                    >
                                        <Plus
                                            className="top-menu__sub-icon "
                                            size={22}
                                            style={{ marginRight: 5 }}
                                        />
                                        เพิ่ม
                                    </button>
                                </div>
                            </div>

                            <table className="table  mt-10">
                                <thead
                                    className="bg-primary text-white"
                                    style={{ borderTopLeftRadius: 10 }}
                                >
                                    <tr>
                                        <th className="whitespace-nowrap">#</th>
                                        <th className="whitespace-nowrap">รหัส</th>
                                        <th className="whitespace-nowrap">ชื่อหน่วยงาน</th>
                                        <th className="whitespace-nowrap">#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, i) => {
                                        return (
                                            <tr key={i}>
                                                <td style={{width : '5%' }}>{i + 1}</td>
                                                <td style={{width : '5%' }}>{item.id}</td>
                                                <td style={{width : '70%' }}>{item.name}</td>

                                                <td style={{width : '10%' }}>
                                                    <div>
                                                        <button
                                                            className="btn btn-warning mr-1 mb-2"
                                                            onClick={() => getDepId(item.id)}
                                                        >
                                                            <Edit className="top-menu__sub-icon " size={14} />
                                                        </button>
                                                        <Popconfirm
                                                            title="คุณต้องการลบหรือไม่"
                                                            onConfirm={() => onDelete(item.id)}
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
                                                        </Popconfirm>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                headStyle={{ backgroundColor: "red" }}
                title={"เพิ่มหน่วยงาน"}
                // centered
                open={open}
                onOk={onSubmit}
                onCancel={onExit}
                width="50%"
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
                                {/* <Form.Item label="รหัส" rules={[{ required: true }]}>
                                    <Input
                                        value={formData.id}
                                        onChange={(e) => {
                                            setFormData({ ...formData, id: e.target.value });
                                        }}
                                    />
                                </Form.Item> */}
                                <Form.Item label="ชื่อหน่วยงาน" rules={[{ required: true }]} style={{ marginTop: 10 }}>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value });
                                        }}
                                    />
                                </Form.Item>




                                {/* <Form.Item label="สถานะ">
                                    <Switch
                                        checked={formData.status}
                                        onChange={(e) => onChangeStatus(e)}
                                    />
                                </Form.Item> */}
                            </Form>
                        </div>
                    </div>
                </div>
            </Modal>


        </div>
    )
}

export default Department