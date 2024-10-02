import React from 'react'

export default function index() {
    return (
        <div>
            <div style={{ backgroundColor: 'white', padding: '10px', position: 'relative' }}>
                <div style={{ width: '200px', height: '200px', boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", borderRadius: '50%', overflow: 'hidden', position: 'relative', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ background: `linear-gradient(to right,#CBE5F6, #005DB0)`, width: '96px', height: '200px', marginRight: '8px' }}></div>
                        <div style={{ background: `linear-gradient(to right,#D36CEE, #9465F9)`, width: '96px', height: '200px', }}></div>
                    </div>

                    <div style={{ width: '8px', height: '205px', boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", position: 'absolute', backgroundColor: 'white', left: '96px', top: '0px' }}></div>

                    <div style={{ width: '128px', boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px", height: '124px', borderRadius: '50%', position: 'absolute', backgroundColor: 'white', left: '35px', top: '36px' }}></div>
                </div>
                <div style={{ width: '8px', height: '210px', position: 'absolute', backgroundColor: 'white', left: '106px', top: '5px' }}></div>

                <div style={{ display: 'flex',flexDirection:'column', alignItems:'center',position:'absolute',left: '75px', top: '70px' }}>
                    <p style={{ color: 'black', fontSize: '30px', margin: 0 }}>100%</p>
                    <p style={{ color: 'grey', fontSize: '15px' }}>Date</p>
                </div>
            </div>
        </div>
    )
}