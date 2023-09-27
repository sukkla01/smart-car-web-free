import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Home,
  ChevronDown,
  Archive,
  LogOut,
  CalendarCheck2,
  Cog,
  BarChart2,
  Tag,
  Car,
  Figma,
  Codesandbox,
  UserCheck,
  FileText,
  BellRing
} from "lucide-react";
import Link from "next/link";
import jwt_decode from "jwt-decode";
import config from "../../config";
import { Modal, Form, Input, notification } from "antd";
import axios from "axios";
const BASE_URL = config.BASE_URL;
const { TextArea } = Input;

const Menu_ = () => {
  const router = useRouter();
  const [selectId, setSelectId] = useState(0);
  const [ActiveText, setIsActiveText] = useState("");
  const [isShowMenu, setIsShowMenu] = useState(true);
  const [open3, setOpen3] = useState(false);
  const [lineToken, setLineToken] = useState("");

  const [role, setRole] = useState('');

  useEffect(() => {
    setSelectId(localStorage.getItem("NavId"));
    const token = localStorage.getItem("token");

    if (!(token == null || token == undefined)) {
      const decoded = jwt_decode(token);
      setRole(decoded.role)
    }

  }, []);


  const openNotificationWithIconSuccess = (type,text_msg) => {
    console.log('test')
    notification[type]({
      message: "แจ้งเตือน",
      description: text_msg,
      duration: 5,
      style: { backroundColor: "#164E63" },
    });
  };



  const onSelect = (id, path) => {
    localStorage.setItem("NavId", id);
    console.log(id)

    router.push({
      pathname: path,
      // query: { dep: dep, date: date, profile: profile, tname: tname, hn_: hn, time: '' },
    });


  };

  const AddToken = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);

    let post = {
      username: decoded.username,
      line_token: lineToken
    }
    try {
      let res = await axios.post(`${BASE_URL}/add-line-token-user`, post, { headers: { "token": token } })
      setOpen3(false)
    } catch (error) {
      console.log(error)
    }
  }
  const onCancel = () => {
    setOpen3(false)
  }


  const getTokenId = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);

    try {
      let res = await axios.get(`${BASE_URL}/get-user-id/${decoded.username}`, { headers: { "token": token } })
      console.log(res.data)
      setLineToken(res.data[0].token_line)
      setOpen3(true)

    } catch (error) {
      console.log(error)
    }



  }


  const sendLine = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);

    let post = {
      username: decoded.username
    }
    try {
      let res = await axios.post(`${BASE_URL}/user-line-token-test`, post, { headers: { "token": token } })
      if (JSON.parse(res.data.status).status == 200) {

        openNotificationWithIconSuccess('success','ส่ง Line ทดสอบสำเร็จ')
      } else {
        openNotificationWithIconSuccess('error','ไม่สำเร็จ')

      }

    } catch (error) {
      console.log(error)
    }



  }


  return (
    // <div>
    <nav
      className="top-nav"
      style={{ marginTop: -107, marginLeft: 0, marginRight: 0, zIndex: 10 }}
    >
      <ul style={{ backgroundColor: "#C8D6DC", borderRadius: 10, height: 62 }}>
        <li onClick={() => onSelect(1, '/')}>
          <a
            href="#"
            className={selectId == 1 ? "top-menu top-menu--active" : "top-menu"}
          >
            <div className="top-menu__icon">
              <Home
                className="top-menu__sub-icon"
                color="#164E63"
                size={22}
              />
            </div>
            <div className="top-menu__title">หน้าหลัก</div>
          </a>
        </li>


        {/* <li onClick={() => onSelect(1, '/')}>
          <a
            href="#"
            className={selectId == 1 ? "top-menu top-menu--active" : "top-menu"}
          >
            <div className="top-menu__icon">
              <Home className="top-menu__sub-icon" color="#164E63" size={22} />
            </div>
            <div className="top-menu__title">
              หน้าหลัก
            </div>
          </a>
        </li> */}
        <li onClick={() => onSelect(2, '/reserve')}>
          <a
            href="#"
            className={selectId == 2 ? "top-menu top-menu--active" : "top-menu"}
          >
            <div className="top-menu__icon">
              <CalendarCheck2
                className="top-menu__sub-icon"
                color="#164E63"
                size={22}
              />
            </div>
            <div className="top-menu__title">จองรถ</div>
          </a>
        </li>
        <li onClick={() => onSelect(10, '/boss-dept')}>
          <a
            href="#"
            className={selectId == 10 ? "top-menu top-menu--active" : "top-menu"}
          >
            <div className="top-menu__icon">
              <Codesandbox
                className="top-menu__sub-icon"
                color="#164E63"
                size={24}
              />
            </div>
            <div className="top-menu__title">
              หัวหน้าแผนก
            </div>
          </a>
        </li>
        <li onClick={() => onSelect(3, '/admin-car')}>
          <a
            href="#"
            className={selectId == 3 ? "top-menu top-menu--active" : "top-menu"}
          >
            <div className="top-menu__icon">
              <Figma
                className="top-menu__sub-icon"
                color="#164E63"
                size={24}
              />
            </div>
            <div className="top-menu__title">
              จัดการจองรถ
            </div>
          </a>
        </li>

        {role == 'boss_admin' || role == 'superadmin' ?
          <li onClick={() => onSelect(11, '/boss-admin')}>
            <a
              href="#"
              className={selectId == 11 ? "top-menu top-menu--active" : "top-menu"}
            >
              <div className="top-menu__icon">
                <UserCheck
                  className="top-menu__sub-icon"
                  color="#164E63"
                  size={24}
                />
              </div>
              <div className="top-menu__title">
                รองบริหาร
              </div>
            </a>
          </li> : ''
        }
        {role == 'admin' || role == 'superadmin' ?
          <li>
            <a href="#" className={selectId == 4 ? "top-menu top-menu--active" : "top-menu"}>
              <div className="top-menu__icon">
                <Cog className="top-menu__sub-icon" color="#164E63" size={22} />
              </div>
              <div className="top-menu__title">
                ตั่งค่า
                <ChevronDown
                  className="top-menu__sub-icon"
                  color="#164E63"
                  size={16}
                />
              </div>
            </a>

            <ul className>
              <li onClick={() => onSelect(4, '/dept')}>
                <a
                  href="#"
                  className="top-menu"
                >
                  <div className="top-menu__icon"> </div>
                  <div className="top-menu__title">
                    <Tag color="#164E63" size={16} style={{ marginRight: 10 }} />
                    หน่วยงาน
                  </div>
                </a>
              </li>
              <li onClick={() => onSelect(5, '/users')}>
                <a
                  href="#"
                  className="top-menu"
                >
                  <div className="top-menu__icon"> </div>
                  <div className="top-menu__title">
                    <Tag color="#164E63" size={16} style={{ marginRight: 10 }} />
                    ผู้ใช้งาน
                  </div>
                </a>
              </li>

              <li onClick={() => onSelect(6, '/manage-car')}>
                <a
                  href="#"
                  className="top-menu"
                >
                  <div className="top-menu__icon"> </div>
                  <div className="top-menu__title">
                    <Tag color="#164E63" size={16} style={{ marginRight: 10 }} />
                    จัดการรถ
                  </div>
                </a>
              </li>
            </ul>
          </li>
          : ''}
        <li >
          <a href={`${BASE_URL}/doc_car.pdf`} className="top-menu" target="_blank">
            <div className="top-menu__icon">
              <FileText
                className="top-menu__sub-icon"
                color="#164E63"
                size={22}
              />
            </div>
            <div className="top-menu__title"> คู่มือ </div>
          </a>
        </li>
        <li onClick={getTokenId}>
          <a href='#' className="top-menu">
            <div className="top-menu__icon">
              <BellRing
                className="top-menu__sub-icon"
                color="#164E63"
                size={22}
              />
            </div>
            <div className="top-menu__title"> Line Notify </div>
          </a>
        </li>
        <li onClick={() => onSelect(9, '/login')}>
          <a href="#" className="top-menu">
            <div className="top-menu__icon">
              <LogOut
                className="top-menu__sub-icon"
                color="#164E63"
                size={22}
              />
            </div>
            <div className="top-menu__title"> LOGOUT </div>
          </a>
        </li>
      </ul>


      <Modal
        headStyle={{ backgroundColor: "red" }}
        title={"บันทึก/แก้ไข Line Token"}
        // centered
        open={open3}
        onOk={AddToken}
        onCancel={onCancel}
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
                  <label style={{ marginRight: 27 }}></label>
                  <TextArea value={lineToken} rows={1} placeholder="กรอก Line Token" style={{ width: '80%' }} onChange={(e) => setLineToken(e.target.value)} />
                </div>


                <div className="col-span-12 lg:col-span-12 mt-3">
                  <label style={{ marginRight: 27 }}></label>
                  <a href={`${BASE_URL}/doc_line.pdf`} style={{ color: 'blue' }} target="_blank" >การตั้งค่า</a>
                  <span style={{ color: 'Green', marginLeft: 20, cursor: 'pointer' }} onClick={sendLine}  >ทดสอบส่ง Line</span>

                </div>




              </Form>
            </div>
          </div>
        </div>
      </Modal>
    </nav>
    // </div>
  );
};

export default Menu_;
