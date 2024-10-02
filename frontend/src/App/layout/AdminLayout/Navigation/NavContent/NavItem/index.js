import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import windowSize from 'react-window-size';
import Aux from "../../../../../../hoc/_Aux";
import NavIcon from "./../NavIcon";
import NavBadge from "./../NavBadge";
import * as actionTypes from "../../../../../../store/actions";
import mobike from "../../../../../../assets/images/user/mo2.png"
import dinein from "../../../../../../assets/images/user/dinein (1).png"

class NavItem extends Component {

    render() {
        let itemTitle = this.props.item.title;
        if (this.props.item.icon) {
            itemTitle = <span className="pcoded-mtext">{this.props.item.title}</span>;
        }

        let itemTarget = '';
        if (this.props.item.target) {
            itemTarget = '_blank';
        }

        let subContent;
        if (this.props.item.external) {

            subContent = (
                <a href={this.props.item.url} target='_blank' rel='noopener noreferrer'>
                    <NavIcon items={this.props.item} />
                    {itemTitle}
                    <NavBadge layout={this.props.layout} items={this.props.item} />
                </a>
            );
        } else {
            subContent = (
                <NavLink to={this.props.item.url} className="nav-link" exact={true} target={itemTarget}>
                    {


                        localStorage.getItem("cashier_big") == "1" ? (
                            this.props.item.title == "DINE IN" ?

                                (

                                    <img src={dinein} style={{ height: "80px", width: "95px" }} alt="" />

                                ) :
                                this.props.item.title == "DELIVERY" ?

                                    (

                                        <img src={mobike} style={{ height: "80px", width: "95px" }} alt="" />

                                    ) :

                                    <h1 style={{ color: 'white', fontSize: 40, backgroundColor: 'darkblue', textAlign: 'center', padding: 15 }} ><i className={this.props.item.icon} /></h1>
                        ) : (
                            <>
                                <NavIcon items={this.props.item} />
                                {itemTitle}
                            </>
                        )
                    }

                    <NavBadge layout={this.props.layout} items={this.props.item} />
                </NavLink>
            );
        }
        let mainContent = '';
        if (this.props.layout === 'horizontal') {
            mainContent = (
                <li onClick={this.props.onItemLeave}>{subContent}</li>
            );
        } else {
            if (this.props.windowWidth < 992) {
                mainContent = (
                    <li className={this.props.item.classes} onClick={this.props.onItemClick}>{subContent}</li>
                );
            } else {
                mainContent = (
                    <li className={this.props.item.classes}>{subContent}</li>
                );
            }
        }

        return (
            <Aux>
                {mainContent}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        layout: state.layout,
        collapseMenu: state.collapseMenu
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onItemClick: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
        onItemLeave: () => dispatch({ type: actionTypes.NAV_CONTENT_LEAVE })
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(windowSize(NavItem)));