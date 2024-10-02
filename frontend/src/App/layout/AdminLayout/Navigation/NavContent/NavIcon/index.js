import React from 'react';
import FeatherIcon from 'feather-icons-react';
const navIcon = (props) => {
    let navIcons = false;
    if (props.items.icon) {
        navIcons = <span className="pcoded-micon"><FeatherIcon icon={props.items.icon} /></span>;
    }
    return navIcons;
};

export default navIcon;