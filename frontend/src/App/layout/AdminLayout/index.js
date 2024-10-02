import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Fullscreen from "react-full-screen";
import windowSize from 'react-window-size';
import Navigation from './Navigation';
import NavBar from './NavBar';
import Loader from "../Loader";
import Enduserroutes from "../../../Enduser-routes";


import Aux from "../../../hoc/_Aux";
import * as actionTypes from "../../../store/actions";
import './app.scss';




// const distributorroutes = JSON.parse(localStorage.getItem("64654sdwse8hnd&*shg"))

class AdminLayout extends Component {

    // componentDidMount(){

    //     console.log("sdklfhsdjflkds")

    //     console.log(JSON.parse(localStorage.getItem("64654sdwse8hnd&*shg")))

    //     console.log (distributorroutes)
    //     console.log("sdklfhsdjflkds")

    // }

    fullScreenExitHandler = () => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            this.props.onFullScreenExit();
        }
    };

    componentWillMount() {
        if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
            this.props.onComponentWillMount();
        }

        
    }

    mobileOutClickHandler() {
        if (this.props.windowWidth < 992 && this.props.collapseMenu) {
            this.props.onComponentWillMount();
        }
    }

    render() {

        /* full screen exit call */
        document.addEventListener('fullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('webkitfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('mozfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('MSFullscreenChange', this.fullScreenExitHandler);


         if (localStorage.getItem("&s47$sfblm#5dfn") == "347fbxsdf*&^h&sdfkhj98sf*sdh0kjskdh*BDgdd&^%sdfg78&sdf876876adn"){
            var menu = Enduserroutes.map((route, index) => {
                return (route.component) ? (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                            <route.component {...props} />
                        )} />
                ) : (null);
            });
            
        }


        return (
            <Aux>
                <Fullscreen enabled={this.props.isFullScreen} >
                    <Navigation />
                    <NavBar />
                    <div className={localStorage.getItem("cashier_big") == "1" ?"pcoded-main-container2":"pcoded-main-container"} onClick={() => this.mobileOutClickHandler}>
                        <div className="pcoded-wrapper">
                            {/* <div className="pcoded-content"> */}
                            <div style={{padding:15,backgroundColor:"#e6e8eb",height:"100vh"}}>
                                <div className="pcoded-inner-content">
                                    {/* <Breadcrumb /> */}
                                    <div className="main-body">
                                        <div className="page-wrapper">
                                                <Switch>
                                                    {menu}
                                                    <Redirect from="/" to={this.props.defaultPath} />
                                                </Switch>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            {/* </div> */}
                        </div>
                    </div>
                </Fullscreen>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        defaultPath: state.defaultPath,
        isFullScreen: state.isFullScreen,
        collapseMenu: state.collapseMenu,
        configBlock: state.configBlock,
        layout: state.layout
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFullScreenExit: () => dispatch({ type: actionTypes.FULL_SCREEN_EXIT }),
        onComponentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(AdminLayout));