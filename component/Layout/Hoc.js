import React from 'react'
import Header_ from './Header_'
import Menu_ from './Menu_'

const Hoc = (props) => {
    return (
        <div>
            {/* <Header_ /> */}
            <Header_  />
            {/* <Menu_ /> */}
            <style jsx>{`
              
              
              @media (min-width: 600px) {
                .content-padding {
                  margin-left : 15px;
                  margin-right : 15px;
                }
              }
              
            `}</style>
            <div className="content content--top-nav content-padding" >
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 2xl:col-span-12">
                        {props.children}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Hoc