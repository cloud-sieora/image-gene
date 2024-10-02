import React from 'react';
import DEMO from './../../../../../store/constant';
import Aux from "../../../../../hoc/_Aux";
import tentofaceLogo from './5.png'

const navLogo = (props) => {
    const userData = JSON.parse(localStorage.getItem("userData"))
    let company_name = ''
    // const [closebutton, setclosebutton] = useState(false);


    let toggleClass = ['mobile-menu'];
    if (props.collapseMenu) {
        toggleClass = [...toggleClass, 'off'];
    }

    if (userData.company_name.length > 15) {
        company_name = `${userData.company_name.slice(0, 14)}...`
    } else {
        company_name = userData.company_name
    }

    return (

        <Aux>

            <div className="navbar-brand header-logo" style={{ marginRight: 20, display: 'flex', alignItems: 'center', justifyContent: props.collapseMenu == false ? '' : 'center', backgroundColor: '#181828' }}>
                <div>
                    {/* <img src={tentofaceLogo} alt="tentoface logo" width="100%" height="60"></img> */}
                    {
                        props.collapseMenu == false ?
                            <p style={{ fontSize: '25px', margin: 0, fontWeight: 'bolder',color:'#e22747' }}>{company_name}</p>
                            :
                            <div style={{ backgroundColor: '#e22747', color: 'white', borderRadius: '50%', paddingLeft: '10px', paddingRight: '10px', width: '100%' }}>
                                <p style={{ fontSize: '25px', margin: 0, fontWeight: 'bolder' }}>{company_name[0]}</p>
                            </div>
                    }
                </div>

                {/* <a href={DEMO.BLANK_LINK} className="b-brand">
                    {
                        localStorage.getItem("org_name").length > 14 ? (

                            <span className="b-title" style={{ fontSize: 17, fontFamily: 'Poppins-SemiBold', paddingRight: 10 }}>{localStorage.getItem("org_name").toUpperCase().substring(0, 14)}..</span>

                        ) : (
                            <span className="b-title" style={{ fontSize: 17, fontFamily: 'Poppins-SemiBold', paddingRight: 10 }}>{localStorage.getItem("org_name").toUpperCase().substring(0, 14)}</span>

                        )

                    }

                </a> */}

                <a href={DEMO.BLANK_LINK} className={toggleClass.join(' ')} id="mobile-collapse" onClick={props.onToggleNavigation}><span /></a>
            </div>
        </Aux>
    );
};

export default navLogo;
