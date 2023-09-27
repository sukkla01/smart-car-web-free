import React, { useEffect, useState } from "react";
import { Search, Bell } from "lucide-react";
import Menu_ from "./Menu_";
import Link from "next/link";
import jwt_decode from "jwt-decode";
import axios from "axios";
import config from "../../config";

const BASE_URL = config.BASE_URL;

const Header_ = () => {
  const [profile, setProfile] = useState([]);
  const [data, setData] = useState([]);
  const [isShowMenu, setIsShowMenu] = useState(false);

  // const  test  = pttype.filter((item)=> item != '02' )

  // console.log(test)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!(token == null || token == undefined)) {
      const decoded = jwt_decode(token);
      setIsShowMenu(decoded.role == 'admin' ? true : false)
      getProfile();
    }

    // getAlert()
  }, []);

  const getProfile = () => {
    const token = localStorage.getItem("token");
    if (token == null) {
    } else {
      const decoded = jwt_decode(token);
      setProfile(decoded);
    }

    // console.log(decoded);
  };

  const onClick = () => {
    // console.log("dd");
  };

  const getAlert = async () => {
    const token = localStorage.getItem("token");
    try {
      let res = await axios.get(`${BASE_URL}/get-alert`, {
        headers: { token: token },
      });
      console.log(res.data)
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onAlert = async () => {

    const token = localStorage.getItem("token");
    let data = {
      oapp_id: '',
    };
    try {
      let res = await axios.post(`${BASE_URL}/update-view-doctor`, data, {
        headers: { token: token },
      });
      // getAlert()
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
     <style jsx>{`
               @media (min-width: 600px) {
                .content-layout {
                  margin-bottom: 98px;
                  
                }
              }
  
              
            `}</style>
      <div className="top-bar-boxed top-bar-boxed--top-menu h-[70px] md:h-[65px] z-[51] border-b border-white/[0.08] content-layout -mt-7  md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 fix-nav md:border-b-0 relative md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-10 md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700">
        <div className="h-full flex items-center">
          {/* BEGIN: Logo */}
          <a className="logo -intro-x  md:flex xl:w-[180px]  mr-2">
            <img
              alt="Midone - HTML Admin Template"
              className="logo__image w-6"
              src="dist/images/logo.svg"
            />
            <span className="logo__text text-white text-lg ml-3 hidden sm:block">
              SmartCar
            </span>
          </a>
          {/* END: Logo */}
          {/* BEGIN: Breadcrumb */}
          <nav aria-label="breadcrumb" className="-intro-x h-[45px] mr-auto">
            {/* <ol className="breadcrumb breadcrumb-light">
                            <li className="breadcrumb-item"><a href="#">Application</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                        </ol> */}
            <ol className="breadcrumb breadcrumb-light">
              โรงพยาบาลศรีสังวรสุโขทัย
            </ol>
          </nav>
          {/* END: Breadcrumb */}
          {/* BEGIN: Search */}
          <div className="intro-x relative mr-3 sm:mr-6">
            <div className="search hidden sm:block">
              <input
                type="text"
                className="search__input form-control border-transparent"
                placeholder="Search..."
              />
              <Search
                className="search__icon dark:text-slate-500"
                color="#164E63"
                size={22}
              />
            </div>

            <div className="search-result">
              <div className="search-result__content">
                <div className="search-result__content__title">Pages</div>
                <div className="mb-5">
                  <a className="flex items-center">
                    <div className="w-8 h-8 bg-success/20 dark:bg-success/10 text-success flex items-center justify-center rounded-full">
                      <i className="w-4 h-4" />
                    </div>
                    <div className="ml-3">Mail Settings</div>
                  </a>
                  <a className="flex items-center mt-2">
                    <div className="w-8 h-8 bg-pending/10 text-pending flex items-center justify-center rounded-full">
                      <i className="w-4 h-4" />
                    </div>
                    <div className="ml-3">Users &amp; Permissions</div>
                  </a>
                  <a className="flex items-center mt-2">
                    <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 text-primary/80 flex items-center justify-center rounded-full">
                      <i className="w-4 h-4" />
                    </div>
                    <div className="ml-3">Transactions Report</div>
                  </a>
                </div>
                <div className="search-result__content__title">Users</div>
                <div className="mb-5">
                  <a className="flex items-center mt-2">
                    <div className="w-8 h-8 image-fit">
                      <img
                        alt="Midone - HTML Admin Template"
                        className="rounded-full"
                        src="dist/images/profile-10.jpg"
                      />
                    </div>
                    <div className="ml-3">Al Pacino</div>
                    <div className="ml-auto w-48 truncate text-slate-500 text-xs text-right">
                      alpacino@left4code.com
                    </div>
                  </a>
                  <a className="flex items-center mt-2">
                    <div className="w-8 h-8 image-fit">
                      <img
                        alt="Midone - HTML Admin Template"
                        className="rounded-full"
                        src="dist/images/profile-5.jpg"
                      />
                    </div>
                    <div className="ml-3">Keanu Reeves</div>
                    <div className="ml-auto w-48 truncate text-slate-500 text-xs text-right">
                      keanureeves@left4code.com
                    </div>
                  </a>
                  <a className="flex items-center mt-2">
                    <div className="w-8 h-8 image-fit">
                      <img
                        alt="Midone - HTML Admin Template"
                        className="rounded-full"
                        src="dist/images/profile-7.jpg"
                      />
                    </div>
                    <div className="ml-3">Angelina Jolie</div>
                    <div className="ml-auto w-48 truncate text-slate-500 text-xs text-right">
                      angelinajolie@left4code.com
                    </div>
                  </a>
                  <a className="flex items-center mt-2">
                    <div className="w-8 h-8 image-fit">
                      <img
                        alt="Midone - HTML Admin Template"
                        className="rounded-full"
                        src="dist/images/profile-2.jpg"
                      />
                    </div>
                    <div className="ml-3">Robert De Niro</div>
                    <div className="ml-auto w-48 truncate text-slate-500 text-xs text-right">
                      robertdeniro@left4code.com
                    </div>
                  </a>
                </div>
                <div className="search-result__content__title">Products</div>
                <a className="flex items-center mt-2">
                  <div className="w-8 h-8 image-fit">
                    <img
                      alt="Midone - HTML Admin Template"
                      className="rounded-full"
                      src="dist/images/preview-9.jpg"
                    />
                  </div>
                  <div className="ml-3">Nike Tanjun</div>
                  <div className="ml-auto w-48 truncate text-slate-500 text-xs text-right">
                    Sport &amp; Outdoor
                  </div>
                </a>
                <a className="flex items-center mt-2">
                  <div className="w-8 h-8 image-fit">
                    <img
                      alt="Midone - HTML Admin Template"
                      className="rounded-full"
                      src="dist/images/preview-7.jpg"
                    />
                  </div>
                  <div className="ml-3">Samsung Galaxy S20 Ultra</div>
                  <div className="ml-auto w-48 truncate text-slate-500 text-xs text-right">
                    Smartphone &amp; Tablet
                  </div>
                </a>
                <a className="flex items-center mt-2">
                  <div className="w-8 h-8 image-fit">
                    <img
                      alt="Midone - HTML Admin Template"
                      className="rounded-full"
                      src="dist/images/preview-9.jpg"
                    />
                  </div>
                  <div className="ml-3">Nike Tanjun</div>
                  <div className="ml-auto w-48 truncate text-slate-500 text-xs text-right">
                    Sport &amp; Outdoor
                  </div>
                </a>
                <a className="flex items-center mt-2">
                  <div className="w-8 h-8 image-fit">
                    <img
                      alt="Midone - HTML Admin Template"
                      className="rounded-full"
                      src="dist/images/preview-4.jpg"
                    />
                  </div>
                  <div className="ml-3">Nikon Z6</div>
                  <div className="ml-auto w-48 truncate text-slate-500 text-xs text-right">
                    Photography
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className="intro-x  mr-2 ">
            <div className="  notification notification--bullet cursor-pointer" role="button" aria-expanded="false" data-tw-toggle="dropdown">
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" icon-name="bell" data-lucide="bell" className=" animate__animated animate__headShake lucide lucide-bell notification__icon dark:text-slate-500"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg> </div>

          </div>

          {/* END: Search */}
          {/* BEGIN: Notifications */}
          <div className="intro-x dropdown mr-2 sm:mr-6"  >
            {isShowMenu ?
              <div
                className={`dropdown-toggle notification ${data.length > 0 ? 'notification--bullet' : ""}  cursor-pointer`}
                role="button"
                aria-expanded="false"
                data-tw-toggle="dropdown"
              >
                <Bell
                  className="notification__icon dark:text-slate-500"
                  color="white"
                  size={22}
                  onClick={onAlert}
                />
              </div> : ''}
            <div className="notification-content pt-2 dropdown-menu">
              <div className="notification-content__box dropdown-content">
                <div className="notification-content__title">Notifications</div>
                {data.map((item, i) => {
                  return <div className="cursor-pointer relative flex items-center mt-5">
                    <div className="w-12 h-12 flex-none image-fit mr-1">
                      <img
                        alt="Midone - HTML Admin Template"
                        className="rounded-full"
                        src="dist/images/avatar.png"
                      />
                      <div className="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white" />
                    </div>
                    <div className="ml-2 overflow-hidden">
                      <div className="flex items-center">
                        <a href="#" className="font-medium truncate mr-5">
                          {item.tname}
                        </a>
                        <div className="text-xs text-slate-400 ml-auto whitespace-nowrap">
                          {item.cname}
                        </div>
                      </div>
                      <div className="w-full truncate text-slate-500 mt-0.5">
                        {item.app_user}
                      </div>
                    </div>
                  </div>
                })}


              </div>
            </div>
          </div>
          {/* END: Notifications */}
          {/* BEGIN: Account Menu */}
          <div className="intro-x dropdown w-8 h-8">
            <div
              className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
              role="button"
              aria-expanded="false"
              data-tw-toggle="dropdown"
            >
              <img
                alt="Midone - HTML Admin Template"
                src="dist/images/avatar.png"
              />
            </div>
            <div className="dropdown-menu w-56">
              <ul className="dropdown-content bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
                <li className="p-2">
                  <div className="font-medium">{profile.fullname}</div>
                  <div className="text-xs text-white/60 mt-0.5 dark:text-slate-500">
                    {profile.deptname} {"[" + profile.dept + "]"}
                  </div>
                </li>
                <li>
                  <hr className="dropdown-divider border-white/[0.08]" />
                </li>


                <li>
                  <hr className="dropdown-divider border-white/[0.08]" />
                </li>
                <li>
                  <Link href={"/login"}>
                    <a className="dropdown-item hover:bg-white/5">
                      <i className="w-4 h-4 mr-2" /> Logout
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* END: Account Menu */}
        </div>
        <Menu_ />
      </div>
    </div>
  );
};

export default Header_;
