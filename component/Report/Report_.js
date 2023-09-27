import React from 'react'
import { ConfigProvider, DatePicker } from "antd";
import * as moment from "moment";
import "moment/locale/th";
moment.locale("th");
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import locale from 'antd/locale/th_TH';
const Report_ = () => {
    return (
        <div>
            <div className="col-span-12 lg:col-span-8">
                <div className="box intro-y mt-5">
                    <div className="box">
                        <div className="intro-y box p-5 mt-5 sm:mt-2">
                            <div className="col-span-12 lg:col-span-12 ">
                                <div className="intro-y flex items-center h-2 mt-3 mb-3">
                                    <div className="col-span-12 lg:col-span-12 mt-1">
                                        เลือกรายการ
                                        <ConfigProvider locale={locale}>
                                            <DatePicker
                                                // onChange={onChangeDateStart}
                                                placeholder="--เลือกวันที่นัด--"
                                                style={{ marginLeft: 20, marginRight: 20 }}
                                            // value={
                                            //     formData.start_date == null
                                            //         ? null
                                            //         : dayjs(formData.start_date, 'YYYY-MM-DD')
                                            // }
                                            />
                                        </ConfigProvider>
                                        ถึง
                                        <ConfigProvider locale={locale}>
                                            <DatePicker
                                                // onChange={onChangeDateStart}
                                                placeholder="--เลือกวันที่นัด--"
                                                style={{ marginLeft: 20 }}
                                            // value={
                                            //     formData.start_date == null
                                            //         ? null
                                            //         : dayjs(formData.start_date, 'YYYY-MM-DD')
                                            // }
                                            />
                                        </ConfigProvider>


                                    </div>

                                    <div className="col-span-12 lg:col-span-12 mt-4">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-8">
                <div className="box intro-y mt-5">
                    <div className="box">
                        <div className="intro-y box p-5 mt-5 sm:mt-2">
                            <div className="col-span-12 lg:col-span-12 ">
                                <div className="intro-y flex items-center h-2 mt-3 mb-3">
                                    xxx
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Report_