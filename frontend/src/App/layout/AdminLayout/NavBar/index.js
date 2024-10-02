import React, { Component } from 'react';
import { connect } from 'react-redux';

import NavLeft from "./NavLeft";
import NavRight from "./NavRight";
import Aux from "../../../../hoc/_Aux";
import DEMO from "../../../../store/constant";
import * as actionTypes from "../../../../store/actions";
import tentofaceLogo from '../Navigation/NavLogo/tentofaceLogo.jpeg'

class NavBar extends Component {
    render() {
        let headerClass = ['navbar', 'pcoded-header', 'navbar-expand-lg', this.props.headerBackColor];
        if (this.props.headerFixedLayout) {
            headerClass = [...headerClass, 'headerpos-fixed'];
        }

        let toggleClass = ['mobile-menu'];
        if (this.props.collapseMenu) {
            toggleClass = [...toggleClass, 'on'];
        }

        return (
            <Aux>

                <header className={headerClass.join(' ')}>

                    <div className="m-header" style={{ height: 10, marginTop: 20 }}>
                        <a href={DEMO.BLANK_LINK} className="b-brand">
                            {
                                localStorage.getItem("org_name").length > 20 ?
                                    (
                                        <span className="b-title" style={{ fontSize: 17, color: 'white' }}>Hi, {localStorage.getItem("org_name").substring(0, 20).toUpperCase()} ...</span>

                                    ) :
                                    (
                                        <span className="b-title" style={{ fontSize: 17, color: 'white' }}>Hi, {localStorage.getItem("org_name").substring(0, 20).toUpperCase()}</span>

                                    )

                            }

                        </a>
                    </div>
                    <div className="m-header">


                        <a className={toggleClass.join(' ')} id="mobile-collapse1" href={DEMO.BLANK_LINK} onClick={this.props.onToggleNavigation}><span /></a>
                        <a href={DEMO.BLANK_LINK} className="b-brand">

                            {/* <span className="b-title" style={{ fontWeight: 'bold' }}>Restaurant Management</span> */}
                        </a>
                    </div>
                    <a className="mobile-menu" id="mobile-header" href={DEMO.BLANK_LINK}><i className="feather icon-more-horizontal" /></a>
                    <div className="collapse navbar-collapse">
                        {/* <NavLeft/>
                        <NavRight rtlLayout={this.props.rtlLayout} /> */}
                    </div>
                </header>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        rtlLayout: state.rtlLayout,
        headerBackColor: state.headerBackColor,
        headerFixedLayout: state.headerFixedLayout,
        collapseMenu: state.collapseMenu
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
