import React, { useEffect, useState } from "react";
import { Cog, Trash, Edit, Plus, Flag } from "lucide-react";
import { Switch, Modal, Form, Input, Select, Popconfirm, Upload } from "antd";
import axios from "axios";
import config from "../config";

const BASE_URL = config.BASE_URL;

const ManageCar_ = () => {
  const [data, setData] = useState([]);
  const [dataKeeper, setDataKeeper] = useState([]);
  const [open, setOpen] = useState(false);
  const [clickStatus, setclickStatus] = useState('');
  const [formData, setFormData] = useState({
    no_car: "",
    type_car: "",
    keeper: "",
    status: true,
    count_seat: "",
  });
  const [fileList, setFileList] = useState([])
  const [imgArr, setImgArr] = useState([])
  const [previewImage, setPreviewImage] = useState('')
  const [previewVisible, setPreviewVisible] = useState(false)

  const uploadButton = (
    <div>
      <Plus />
      <div className="ant-upload-text">รูปภาพ</div>
    </div>
  );

  useEffect(() => {
    getCarAll()
    getKeeper()

  }, []);

  const getCarAll = async () => {
    const token = localStorage.getItem("token");

    try {
      let res = await axios.get(`${BASE_URL}/get-car-all`, { headers: { "token": token } })
      setData(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  const getKeeper = async () => {
    const token = localStorage.getItem("token");
    try {
      let res = await axios.get(`${BASE_URL}/get-keeper-all`, { headers: { "token": token } })
      setDataKeeper(res.data)
    } catch (error) {
      console.log(error)
    }
  }



  const openModal = () => {
    setOpen(true)
    onReset()
  }


  const onSubmit = async () => {
    const token = localStorage.getItem("token");
    let imageEdit = ''
    fileList.map((item, i) => {
      if (item.name.substr(0, 2) == 'e_') {
        let comma = i == 0 ? '' : ','
        imageEdit = imageEdit + comma + item.name
      }

    })

    let data = {
      formData: formData,
      image: imgArr,
      imageEdit: imageEdit
    }


    try {
      let res = await axios.post(`${BASE_URL}/add-manage-car`, data, { headers: { "token": token } })
      getCarAll()
      onReset()
      setOpen(false)

      // Alert()

    } catch (error) {
      console.log(error)
    }


  }
  const onExit = () => {
    setOpen(false)
  }

  const handlePreview = async (file) => {
    //console.log(file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
  }
  const handleCancel = () => {
    setPreviewVisible(false)
  }

  const uploadChange = async ({ fileList: newFileList }) => {
    // console.log(file)
    // console.log(fileList)
    // setFileList(fileList)
    // // if (file.status == 'done' || file.status == 'error') {
    // file.preview = await getBase64(file.originFileObj)

    // setImgArr(file.preview);
    // // }


    // image
    setFileList(newFileList)
    let tmp_img = []
    if (newFileList[0] != null) {
      // console.log(newFileList[0].type.split('/')[0])
      if (newFileList[0].type.split("/")[0] == "image") {
        let NewBase64 = await getBase64(newFileList[0].originFileObj)
        //  console.log(NewBase64)
        tmp_img.push(NewBase64)
        setImgArr(tmp_img)

      } else {
        console.log(false)
      }
    }
  }
  const onRemove = async (img) => {
    // setIsRemove(true)
    if (typeof (img.uid) == 'string') {
      img.preview = await getBase64(img.originFileObj)
      setImgArr(imgArr.filter(item => item !== img.preview));
    } else {
      setFileList(fileList.filter(item => item.status !== "removed"));
    }
  }

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      //reader.onerror = error => reject(error);
    });
  }


  const onSelectKeeper = (value) => {
    setFormData({ ...formData, keeper: value });
  }

  const onReset = () => {
    setFormData({
      no_car: "",
      type_car: "",
      keeper: "",
      status: true,
      count_seat: "",
    })

    setFileList([])
    setImgArr([])
  }

  const del = async (no) => {
    const token = localStorage.getItem("token");

    let data = {
      no: no
    }


    try {
      let res = await axios.post(`${BASE_URL}/delete-car`, data, { headers: { "token": token } })
      getCarAll()
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="col-12 mt-6">
      <div className="intro-y    h-10">
        <div className="flex  ">
          <Cog className="top-menu__sub-icon " size={32} />
          <span className="text-3xl  truncate ml-4">จัดการรถ</span>
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
                    onClick={() => openModal()}
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
                    <th className="whitespace-nowrap">รูป</th>
                    <th className="whitespace-nowrap">ทะเบียนรถ</th>
                    <th className="whitespace-nowrap">ประเภทรถ</th>
                    <th className="whitespace-nowrap">ผู้ดูแลรถ</th>
                    <th className="whitespace-nowrap">จำนวนที่นั่ง</th>
                    <th className="whitespace-nowrap">สถานะ</th>
                    <th className="whitespace-nowrap">#</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          {/* <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                            <img alt="Midone - HTML Admin Template" className="rounded-full" src={BASE_URL + '/' + item.image_car} />
                          </div> */}

                          <div className="w-12 h-12 mr-6 float-left image-fit">
                            <img alt="Midone - HTML Admin Template" src={BASE_URL + '/' + item.image_car} data-action="zoom" className="w-full rounded-md" />
                          </div>


                        </td>
                        <td>{item.no_car}</td>
                        <td>{item.type_car}</td>
                        <td>{item.keeper_name}</td>
                        <td>{item.count_seat}</td>
                        <td>
                          {item.status == 'Y' ? (
                            <Switch
                              defaultChecked disabled
                            // onChange={(e) => onChangeStatus(e, item.usr_username)}
                            />
                          ) : (
                            <Switch disabled />
                          )}
                        </td>
                        <td>
                          <div>
                            {/* <button
                              className="btn btn-warning mr-1 mb-2"
                              onClick={() => onEdit(item.no)}
                            >
                              <Edit className="top-menu__sub-icon " size={14} />
                            </button> */}
                            <Popconfirm
                              title="คุณต้องการลบหรือไม่"
                              onConfirm={() => del(item.no)}
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
        title={"เพิ่มรถ"}
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
                <Form.Item label="ทะเบียนรถ" rules={[{ required: true }]}>
                  <Input
                    value={formData.no_car}
                    onChange={(e) => {
                      setFormData({ ...formData, no_car: e.target.value });
                    }}
                  />
                </Form.Item>
                <Form.Item label="ประเภทรถ" rules={[{ required: true }]}>
                  <Input
                    value={formData.type_car}
                    onChange={(e) => {
                      setFormData({ ...formData, type_car: e.target.value });
                    }}
                  />
                </Form.Item>
                <Form.Item label="ผู้ดูแลรถ" rules={[{ required: true }]}>
                  <Select
                    value={formData.keeper}
                    onChange={onSelectKeeper}
                  // filterOption={(input, option) =>
                  //   (option?.label ?? "")
                  //     .toLowerCase()
                  //     .includes(input.toLowerCase())
                  // }
                  >
                    {dataKeeper.map((item, i) => {
                      return <Select.Option key={i} value={item.id}>
                        {item.name}
                      </Select.Option>
                    })}


                  </Select>
                </Form.Item>
                <Form.Item label="จำนวนที่นั่ง" rules={[{ required: true }]}>
                  <Input
                    // type="password"
                    value={formData.count_seat}
                    onChange={(e) => {
                      setFormData({ ...formData, count_seat: e.target.value });
                    }}
                  />
                </Form.Item>
                <Form.Item label="รูปภาพ" rules={[{ required: true }]}>
                  <Upload
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={uploadChange}
                    onRemove={onRemove}
                    beforeUpload={() => {
                      return false
                    }}
                  // disabled={isUpload}
                  >
                    {fileList.length >= 1 ? null : uploadButton}

                  </Upload>
                  <Modal open={previewVisible} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Form.Item>


                <Form.Item label="สถานะ">
                  <Switch
                    checked={formData.status}
                    onChange={(e) => onChangeStatus(e)}
                  />
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManageCar_