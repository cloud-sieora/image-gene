import * as actionTypes from './actions';
import config from '../config';
import { date } from '../BillingApp_Components/EndUser/DateTimeFun';
const date1 = date()

const initialState = {
    isOpen: [], //for active default menu
    isTrigger: [], //for active default menu, set blank for horizontal
    ...config,
    isFullScreen: false, // static can't change

    collapseMenu: true, // static can't change


    billingdatarecord: [],
    billingdatarecordvalue: [],
    loginIndicator: 0,
    billingrecord1: [],
    cartTotal1: 0,
    cartQty1: 0,

    billingrecord2: [],
    cartTotal2: 0,
    cartQty2: 0,
    cartTotalFinal1: 0,
    cartTotalFinal2: 0,

    billingrecord3: [],
    cartTotal3: 0,
    cartQty3: 0,
    cartTotalFinal3: 0,
    cartTotalFinal3: 0,


    'page': 0,
    // date1[0]
    'startdate': date1[0],
    'starttime': '00:00',
    // date1[1]
    'enddate': date1[1],
    'endtime': `${date1[2]}:${date1[3]}`,
    'apply': true,
    'select': false,
    'socket': {},
    'selected_cameras': [],
    'selected_region': []

};

console.log(initialState.collapseMenu,'(ment)');
const reducer = (state = initialState, action) => {
    let trigger = [];
    let open = [];

    switch (action.type) {
        case actionTypes.COLLAPSE_MENU:
            return {
                ...state,
                collapseMenu: !state.collapseMenu
            };
        case actionTypes.LOGIN_INDICATOR:

            console.log("LOin value is" + action.loginIndicator)
            return {
                ...state,
                loginIndicator: action.loginIndicator,
            };
        case actionTypes.COLLAPSE_TOGGLE:
            if (action.menu.type === 'sub') {
                open = state.isOpen;
                trigger = state.isTrigger;

                const triggerIndex = trigger.indexOf(action.menu.id);
                if (triggerIndex > -1) {
                    open = open.filter(item => item !== action.menu.id);
                    trigger = trigger.filter(item => item !== action.menu.id);
                }

                if (triggerIndex === -1) {
                    open = [...open, action.menu.id];
                    trigger = [...trigger, action.menu.id];
                }
            } else {
                open = state.isOpen;
                const triggerIndex = (state.isTrigger).indexOf(action.menu.id);
                trigger = (triggerIndex === -1) ? [action.menu.id] : [];
                open = (triggerIndex === -1) ? [action.menu.id] : [];
            }

            return {
                ...state,
                isOpen: open,
                isTrigger: trigger
            };
        case actionTypes.NAV_CONTENT_LEAVE:
            return {
                ...state,
                isOpen: open,
                isTrigger: trigger,
            };

        case actionTypes.BILLING_DATA:

            const billingdatamerge = state.billingdatarecord.concat(action.billingdatarecord)
            const sumofbillingdatamerge = billingdatamerge.reduce((a, c) => {
                let x = a.find(e => e.barcode === c.barcode)
                if (!x) a.push(Object.assign({}, c))
                else x.size += c.size
                return a
            }, [])
            return {
                ...state,
                billingdatarecord: sumofbillingdatamerge
            };

        case actionTypes.EDIT_BILLING_DATA:

            const editbillingdatamerge = action.editbillingdatarecord
            const editsumofbillingdatamerge = editbillingdatamerge.reduce((a, c) => {
                let x = a.find(e => e.barcode === c.barcode)
                if (!x) a.push(Object.assign({}, c))
                else x.size += c.size
                return a
            }, [])

            return {
                ...state,
                billingdatarecord: editsumofbillingdatamerge,
            };

        case actionTypes.BILLING_RECORD_DATA:

            const billingdata_recordmerge = state.billingdatarecord.concat(action.billingdatarecord)
            const sumofbillingdatarecordmerge = billingdata_recordmerge.reduce((a, c) => {
                let x = a.find(e => e.food_name === c.food_name)
                if (!x) a.push(Object.assign({}, c))
                else x.size += c.size
                return a
            }, [])
            return {
                ...state,
                billingdatarecordvalue: sumofbillingdatarecordmerge
            };

        case actionTypes.EDIT_BILLING_RECORD_DATA:

            const editbillingdatarecordmerge = action.editbillingdatarecord
            const editsumofbillingdatrecordamerge = editbillingdatarecordmerge.reduce((a, c) => {
                let x = a.find(e => e.barcode === c.barcode)
                if (!x) a.push(Object.assign({}, c))
                else x.size += c.size
                return a
            }, [])

            return {
                ...state,
                billingdatarecordvalue: editsumofbillingdatrecordamerge,
            };

        case actionTypes.BILLING_RECORD1:

            const editbilingdataheck = action.billingrecord1


            return {
                ...state,
                billingrecord1: editbilingdataheck
            };

        case actionTypes.BILLING_RECORD1_FINAL_BILL_AMOUNT:
            return {
                ...state,
                cartTotalFinal1: action.cartTotalFinal1

            }

        case actionTypes.BILLING_RECORD1_TOTAL_AMOUNT:
            return {
                ...state,
                cartTotal1: action.cartTotal1

            }

        case actionTypes.BILLING_RECORD1_TOTAL_QTY:
            return {
                ...state,
                cartQty1: action.cartQty1,

            }

        case actionTypes.BILLING_RECORD2:

            const editbilingdataheck2 = action.billingrecord2


            return {
                ...state,
                billingrecord2: editbilingdataheck2
            };

        case actionTypes.BILLING_RECORD2_TOTAL_AMOUNT:
            return {
                ...state,
                cartTotal2: action.cartTotal2

            }

        case actionTypes.BILLING_RECORD2_TOTAL_QTY:
            return {
                ...state,
                cartQty2: action.cartQty2,

            }

        case actionTypes.BILLING_RECORD2_FINAL_BILL_AMOUNT:
            return {
                ...state,
                cartTotalFinal2: action.cartTotalFinal2

            }





        case actionTypes.BILLING_RECORD3:

            const editbilingdataheck3 = action.billingrecord3


            return {
                ...state,
                billingrecord3: editbilingdataheck3
            };
        case actionTypes.BILLING_RECORD3_TOTAL_AMOUNT:

            return {
                ...state,
                cartTotal3: action.cartTotal3

            }

        case actionTypes.BILLING_RECORD3_TOTAL_QTY:
            return {
                ...state,
                cartQty3: action.cartQty3,

            }

        case actionTypes.BILLING_RECORD3_FINAL_BILL_AMOUNT:
            return {
                ...state,
                cartTotalFinal3: action.cartTotalFinal3

            }





        case actionTypes.NAV_COLLAPSE_LEAVE:
            if (action.menu.type === 'sub') {
                open = state.isOpen;
                trigger = state.isTrigger;
                const triggerIndex = trigger.indexOf(action.menu.id);
                if (triggerIndex > -1) {
                    open = open.filter(item => item !== action.menu.id);
                    trigger = trigger.filter(item => item !== action.menu.id);
                }
                return {
                    ...state,
                    isOpen: open,
                    isTrigger: trigger,
                };
            }
            return { ...state };
        case actionTypes.FULL_SCREEN:
            return {
                ...state,
                isFullScreen: !state.isFullScreen
            };
        case actionTypes.FULL_SCREEN_EXIT:
            return {
                ...state,
                isFullScreen: false
            };
        case actionTypes.CHANGE_LAYOUT:
            return {
                ...state,
                layout: action.layout
            };

        case actionTypes.PAGE:
            return { ...state, 'page': action.value };

        case actionTypes.STARTDATE:
            console.log('reducer');
            return { ...state, 'startdate': action.value };

        case actionTypes.STARTTIME:
            return { ...state, 'starttime': action.value };

        case actionTypes.ENDDATE:
            return { ...state, 'enddate': action.value };

        case actionTypes.ENDTIME:
            return { ...state, 'endtime': action.value };

        case actionTypes.APPLY:
            return { ...state, 'apply': action.value };

        case actionTypes.SELECTED_CAMERAS:
            return { ...state, 'selected_cameras': action.value };
        case actionTypes.SOCKET:
            return { ...state, 'socket': action.value };

        case actionTypes.SELECT:
            return { ...state, 'select': action.value };
        default:
            return state;
    }
};

export default reducer;