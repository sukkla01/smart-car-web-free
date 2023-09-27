import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import axios from "axios";
import config from "../../config";

const ChartCol = dynamic(() => import('react-apexcharts'), {
    ssr: false,
})

const BASE_URL = config.BASE_URL;
const Chart2 = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        chartLoad()
    }, [])


    const chartLoad = async () => {
        let dataDash = []
        let labelDash = []
        const token = localStorage.getItem("token");
        try {
            let res = await axios.get(`${BASE_URL}/get-chart2`, { headers: { "token": token } })
            console.log(res.data)
            res.data.map((item, i) => {
                dataDash.push(item.tcount)
                labelDash.push(item.tyear)
            })
        } catch (error) {
            console.log(error)
        }

        setData({
            series: [{
                name: 'Inflation',
                data: dataDash
            }],
            options: {
                colors: '#FF4560',
                chart: {
                    height: 350,
                    type: 'bar',
                },
                plotOptions: {
                    bar: {
                        borderRadius: 10,
                        dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val + "ครั้ง";
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                    }
                },

                xaxis: {
                    categories: labelDash,
                    position: 'bottom',
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    crosshairs: {
                        fill: {
                            type: 'gradient',
                            gradient: {
                                colorFrom: '#D8E3F0',
                                colorTo: '#BED1E6',
                                stops: [0, 100],
                                opacityFrom: 0.4,
                                opacityTo: 0.5,
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                    }
                },
                yaxis: {
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        show: false,
                        formatter: function (val) {
                            return val + "%";
                        }
                    }

                },
                title: {
                    text: ' ',
                    floating: true,
                    offsetY: 330,
                    align: 'left',
                    style: {
                        color: '#444'
                    }
                }
            },
        })
    }

    return (
        <div>{data.length == 0 ? '' :
            <ChartCol options={data.options} series={data.series} type="bar" height={500} style={{ backgroundColor: 'white', borderRadius: 20 }} />}
        </div>
    )
}

export default Chart2