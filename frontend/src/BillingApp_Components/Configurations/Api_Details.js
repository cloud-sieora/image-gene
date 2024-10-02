import { backendUrl, imageGeneratorUrl, jetsonIpUrl, localBackend } from "./configBackend";


export const LOGIN = 'http://tentovision.cloudjiffy.net/admin_creation_api_validate/';
export const OPERATOR_LOGIN = 'http://tentovision.cloudjiffy.net/operator_creation_api_validate/';
export const CREATE_AGENCY = 'http://sieora.cloudjiffy.net:5008/agency_creation_api/';
export const CREATE_STOCK = 'http://tentovision.cloudjiffy.net/product_creation_api/';
export const GET_STOCKS_BY_ID = 'http://tentovision.cloudjiffy.net/product_creation_api_list/';
export const GET_STOCKS_ALERTS = 'http://tentovision.cloudjiffy.net/check_lower_stocks/';
export const GET_STOCKS_BARCODE = 'http://tentovision.cloudjiffy.net/product_creation_api_list_barcode/';
export const STOCKS_UPDATE = 'http://tentovision.cloudjiffy.net/stocks_update/';
export const OPERATOR_CREATION = 'http://tentovision.cloudjiffy.net/operator_creation_api/';
export const OPERATOR_LIST = 'http://tentovision.cloudjiffy.net/operator_creation_api_list/';
export const GET_ENTRIES_BY_DATE = 'http://tentovision.cloudjiffy.net/entries_getbydate/';
export const STOCK_TRACKER = "http://tentovision.cloudjiffy.net/stock_tracker_api_list/";
export const STOCK_IN_TRACKER = "http://tentovision.cloudjiffy.net/stock_in_tracking_api/";
export const STOCK_IN_TRACKER_LIST = "http://tentovision.cloudjiffy.net/stock_in_tracker_api_list/";
export const STOCK_IN_TRACKER_GETBYDATE = "http://tentovision.cloudjiffy.net/stock_in_tracker_getbydate";
export const STOCK_TRACKER_GETBYDATE = "http://tentovision.cloudjiffy.net/stock_tracker_getbydate/";
export const STOCKS_UPDATE_FOR_TRACKER = 'http://tentovision.cloudjiffy.net/stock_tracker_api/';
export const CREATE_CLIENT_ADMIN = 'http://tentovision.cloudjiffy.net/admin_users_api/';
export const GET_CLIENT_ADMIN_LIST = 'http://tentovision.cloudjiffy.net/admin_users_api/';
export const STAFFALERTS = 'http://tentovision.cloudjiffy.net/user_creation_api_get/';
export const EXPENSEMANAGEMENT = 'http://tentovision.cloudjiffy.net/expense_management_api/';
export const EXPENSEDASHBOARD = 'http://tentovision.cloudjiffy.net/expense_dashboard/';
export const STAFF_UPDATE = 'http://tentovision.cloudjiffy.net/user_creation_api/';
export const ENTRIES = "http://tentovision.cloudjiffy.net/entries/";
export const ADMIN_API = "http://tentovision.cloudjiffy.net/admin_users_api/";
export const PURCHASEMANAGEMENT = "http://tentovision.cloudjiffy.net/purchase_management_api/";
export const PURCHASEDASHBOARD = "http://tentovision.cloudjiffy.net/purchase_dashboard/";
export const STAFFALERTS_IPADDRESS = ':5002/user_creation_api_get/';
export const GET_ENTRIES_BY_DATE_IPADDRESS = ':5002/entries_getbydate/';
export const ENTRIES_IPADDRESS = ":5002/entries/";
export const MENU_CREATE = "http://tentovision.cloudjiffy.net/menu_management_main_category_api/";

export const SUB_MENU_GET_BYCLIENTID_ALL = "http://tentovision.cloudjiffy.net/menu_management_sub_category_get_by_client_id/";
export const FOOD_MENU_GET_BYCLIENTID_ALL = "http://tentovision.cloudjiffy.net/menu_management_sub_category_food_items_get_by_client_id/";
export const MENU_GET_BYCLIENTID_ALL = "http://tentovision.cloudjiffy.net/menu_management_main_category_get_by_client_id/";


export const MENU_GET_BYCLIENTID = "http://tentovision.cloudjiffy.net/menu_management_main_category_get_by_client_id_for_billing/";
export const SUB_MENU_GET_BYCLIENTID = "http://tentovision.cloudjiffy.net/menu_management_sub_category_get_by_client_id_for_billing/";
export const FOOD_MENU_GET_BYCLIENTID = "http://tentovision.cloudjiffy.net/menu_management_sub_category_food_items_get_by_client_id_for_billing";


export const SUB_MENU_CREATE = "http://tentovision.cloudjiffy.net/menu_management_sub_category_api/";


export const FOOD_CREATE = "http://tentovision.cloudjiffy.net/menu_management_sub_category_food_item_api/";
export const COPY_MENU_CATEGORY = "http://tentovision.cloudjiffy.net/menu_management_copy_menu/";
export const TABLE_MANAGEMENT = "http://tentovision.cloudjiffy.net/tables_management_api/";
export const TABLE_MANAGEMENT_LIST = "http://tentovision.cloudjiffy.net/tables_management_api_list/";
export const SUBMENULIST = "http://tentovision.cloudjiffy.net/sub_menu_category_overall/";
export const BILLING_MANAGEMENT_API = "http://tentovision.cloudjiffy.net/billing_management_api/";
export const BILLING_DASHBOARD_API = "http://tentovision.cloudjiffy.net/billing_dashboard/";
export const DRIVER_CREATION = "http://tentovision.cloudjiffy.net/driver_users_api/";
export const DRIVER_LIST = "http://tentovision.cloudjiffy.net/driver_users_api_list/";
export const CUSTOMER_ADDRESS_DETAILS = "http://tentovision.cloudjiffy.net/billing_management_api_get_customer_details/";
export const BIILING_DASHBOARD = 'http://tentovision.cloudjiffy.net/billing_dashboard/';
export const PURCHASE = 'http://tentovision.cloudjiffy.net/purchase_dashboard/';
export const STOCKIN_TRACKER = 'http://tentovision.cloudjiffy.net/stock_in_tracker_getbydate/';
export const EXPENSE = 'http://tentovision.cloudjiffy.net/expense_dashboard/';
export const DINE_IN_LIST = "http://tentovision.cloudjiffy.net/dine_in_management_api_list/";
export const DINE_IN_BILLING_DATA = "http://tentovision.cloudjiffy.net/billing_management_api_list/";
export const OPERATOR_LOGIN_OTHER_DETAILS = "http://tentovision.cloudjiffy.net/admin_creation_api_get_common_details";
export const DRIVER_LOCATION_DETAILS = "http://tentovision.cloudjiffy.net/get_driver_details";


export const BILLING_BULK_SETTLED = "http://tentovision.cloudjiffy.net/bulk_settle/";
export const TABLE_BULK_ACTIVE = "http://tentovision.cloudjiffy.net/bulk_table/";

export const BILLING_MANAGEMENT_STANDARD_API = "http://tentovision.cloudjiffy.net/billing_management_api_create_standard/";

export const BILLING_MANAGEMENT_STANDARD_EDIT = "http://tentovision.cloudjiffy.net/billing_management_api_edit_standard/";
export const BILLING_MANAGEMENT_STANDARD_CANCEL = "http://tentovision.cloudjiffy.net/billing_management_api_cancel_standard/";
export const GET_SUPER_ADMIN_LIST = "https://tentovision1.cloudjiffy.net/dealer_creation_api/";
export const SUPER_ADMIN_LIST = "http://tentovision.cloudjiffy.net/client_list_for_super_admin/";
export const CREATE_SUPER_ADMIN = "https://tentovision1.cloudjiffy.net/dealer_creation_api/";
export const EDIT_SUPER_ADMIN = "https://tentovision1.cloudjiffy.net/dealer_creation_api/";

export const SUPER_ADMIN_LOGIN = "http://tentovision.cloudjiffy.net/super_admin_users_api_validate/";

export const USER_LIST = "http://tentovision.cloudjiffy.net/billing_management_api_customer_info";

export const DEALER_DATA = 'http://tentovision.cloudjiffy.net/admin_users_api/';

export const DEALER_LOGIN = 'https://tentovision1.cloudjiffy.net/dealer_creation_api_validate/';
export const USER_DATA = 'https://tentovision1.cloudjiffy.net/users_creation_api/';
export const USER_DATA_GET_BY_DEALER_ID = 'https://tentovision1.cloudjiffy.net/users_creation_list_by_dealer_id_api';
export const DEVICE_DATA = 'https://tentovision1.cloudjiffy.net/device_creation_api/';
export const DEVICE_LIST_SITE_ID = 'https://tentovision1.cloudjiffy.net/list_device_site_id/';
export const DEVICE_DATA_GET_BY_DEALER_ID = 'https://tentovision1.cloudjiffy.net/device_creation_api_list_dealer/';
export const LIST_DEVICE_DATA_CLIENT_ID = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_client_id_api/';
export const LIST_DEVICE_DATA_CLIENT_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_client_admin_id_api/';
export const LIST_DEVICE_DATA_SITE_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_site_admin_id_api/';
export const LIST_DEVICE_DATA_USER_ID = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_user_id_api/';

export const LIST_DEVICE_DATA_CLIENT_ID_STATUS = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_client_id_api_status/';
export const LIST_DEVICE_DATA_CLIENT_ADMIN_ID_STATUS = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_client_admin_id_api_status/';
export const LIST_DEVICE_DATA_SITE_ADMIN_ID_STATUS = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_site_admin_id_api_status/';
export const LIST_DEVICE_DATA_USER_ID_STATUS = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_user_id_api_status/';
export const SITE_CREATION = 'https://tentovision1.cloudjiffy.net/site_creation_api/';
export const ATTENDANCE_SITE_CREATION = 'https://tentovision1.cloudjiffy.net/attendance_group_creation_api/';
export const ALERT_CREATION = 'https://tentovision1.cloudjiffy.net/alert_creation_api/';
export const ANALYTICS_CREATION = 'https://tentovision1.cloudjiffy.net/analytics_api/';
export const ANALYTICS_GET_DATE_TIME = 'https://tentovision1.cloudjiffy.net/analytics_api_get_date_time';
export const SITE_LIST_BY_DEVICE_ID = 'https://tentovision1.cloudjiffy.net/site_creation_api_get/';
export const CAMERA_CREATION = 'https://tentovision1.cloudjiffy.net/camera_creation_api/';
export const ENROLLMENT_USER_CREATION = 'http://10.147.21.167:5008/enrollment_users_creation_api/';
export const ENROLLMENT_USER_CREATION_EDIT = 'https://tentovision1.cloudjiffy.net/enrollment_users_creation_orginal_api/';
export const ATTENDANCE_LIST_CREATION = 'https://tentovision1.cloudjiffy.net/attendance_list_api/';
export const LIST_CAMERA_ID = 'https://tentovision1.cloudjiffy.net/list_camera_id_api/';
export const CAMERA_LIST_BY_SITE_ID = 'https://tentovision1.cloudjiffy.net/camera_creation_api_list/';
export const ENROLLMENT_LIST_BY_SITE_ID = 'http://10.147.21.167:5008/enrollment_users_creation_list_by_site_id_api/';
export const ATTENDANCE_LIST_BY_SITE_ID = 'https://tentovision1.cloudjiffy.net/attendance_list_by_site_id_api/';
export const ATTENDANCE_LIST_BY_SITE_ID_DATE = 'https://tentovision1.cloudjiffy.net/attendance_list_by_site_id_date_api/';
export const ATTENDANCE_LIST_BY_SITE_ID_DATE_BY_LOCAL = 'http://10.147.21.167:5008/attendance_list_by_site_id_date_api/';
export const FACE_LIST_BY_SITE_ID_DATE = 'https://tentovision1.cloudjiffy.net/face_list_by_site_id_date_api/';
export const USER_LOGIN = 'https://tentovision1.cloudjiffy.net/users_creation_api_validate/';
export const LIST_CAMERA_USER_ID = 'https://tentovision1.cloudjiffy.net/list_camera_user_id/';
export const ANALYTICS_LIST = 'https://tentovision1.cloudjiffy.net/analytics_api_list_by_date/';
export const ANALYTICS_GET = 'https://tentovision1.cloudjiffy.net/analytics_api_get_analytics_data/';
export const ANALYTICS_ALERT_GET = 'https://tentovision1.cloudjiffy.net/alert_api_get_analytics_data/';
export const ANALYTICS_FOR_PLAYBACK = 'https://tentovision1.cloudjiffy.net/analytics_api_get_for_playback/';
export const ANALYTICS_FOR_PLAYBACK_MOTION = 'https://tentovision1.cloudjiffy.net/analytics_api_get_date_time_playback/';
export const ALERT_LIST = `${backendUrl}/alert_creation_api_list_by_date/`;
export const TAG_API_CREATE = 'https://tentovision1.cloudjiffy.net/tag_api/';
export const GROUP_API_CREATE = 'https://tentovision1.cloudjiffy.net/camera_group_api/';
export const TAG_API_LIST = 'https://tentovision1.cloudjiffy.net/tag_listProducts_user_id/';
export const TAG_API_LIST_ALL_ID = 'https://tentovision1.cloudjiffy.net/tag_listbyall_id/';
export const GROUP_API_LIST = 'https://tentovision1.cloudjiffy.net/camera_listProducts_user_id/';
export const GROUP_API_LIST_ALL_ID = 'https://tentovision1.cloudjiffy.net/camera_listbyall_id/';
export const DEVICE_DATA_BY_USER_ID = 'https://tentovision1.cloudjiffy.net/device_creation_api_by_user/';
export const DEVICE_DATA_BY_STATUS = 'https://tentovision1.cloudjiffy.net/device_creation_api_list_device_status/';
export const LIST_USER_DATA_CLIENT_ID = 'https://tentovision1.cloudjiffy.net/users_creation_list_by_client_id_api/';
export const LIST_USER_DATA_CLIENT_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/users_creation_list_by_client_admin_id_api/';
export const LIST_USER_DATA_SITE_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/users_creation_list_by_site_admin_id_api/';
export const LIST_USER_DATA_USER_ID = 'https://tentovision1.cloudjiffy.net/users_creation_list_by_user_id_api/';
export const LIST_SUBSCRIPTION_PLAN = 'https://tentovision1.cloudjiffy.net/subscription_explain_api/';


export const LIST_TARIF_CLIENT_ID = 'https://tentovision1.cloudjiffy.net/tarif_list_api_get/';
export const TARIF_CREATION = 'https://tentovision1.cloudjiffy.net/tarif_list_api/';

export const VEHICLE_TAG_API_CREATE = 'https://tentovision1.cloudjiffy.net/vehicle_tag_creation_api/';
export const VEHICLE_TAG_LIST_CLIENT_ID_API = 'https://tentovision1.cloudjiffy.net/vehicle_tag_creation_listProducts_user_id/';


export const VEHICLE_DATABASE_CLIENT_ID_API = 'https://tentovision1.cloudjiffy.net/vehicle_database_list_client_id_api_get/';
export const VEHICLE_DATABASE_CREATION_API = 'https://tentovision1.cloudjiffy.net/vehicle_database_list_api/';


export const VEHICLE_OVERTIME_CREATION_API = 'https://tentovision1.cloudjiffy.net/vehicle_overtime_list_api/';
export const VEHICLE_OVERTIME_CLIENT_ID_API = 'https://tentovision1.cloudjiffy.net/vehicle_overtime_list_api_get/';

export const VEHICLE_PARKING_IN_OUT_CREATION = 'https://tentovision1.cloudjiffy.net/vehicle_parking_list_in_out_api_get/';
export const VEHICLE_PARKING_CREATION = 'https://tentovision1.cloudjiffy.net/vehicle_parking_list_api/';
export const VEHICLE_PARKING_CREATION_ORDER_STATUS = 'https://tentovision1.cloudjiffy.net/vehicle_parking_list_payment_status_api_get/';
export const VEHICLE_PARKING_AlERT = 'https://tentovision1.cloudjiffy.net/vehicle_parking_list_alert_api_get/';

export const LIST_ANALYTICS_COUNT_CAMERA_ID = 'https://tentovision1.cloudjiffy.net/motion_api_list_camera_id1/';
export const LIST_QUEUE_COUNT_CAMERA_ID = 'https://tentovision1.cloudjiffy.net/queue_api_list_camera_id1/';
export const LIST_ALL_QUEUE_COUNT_CAMERA_ID = 'https://tentovision1.cloudjiffy.net/queue_creation_api_list_all/';

export const LIST_SITE_DATA_CLIENT_ID = 'https://tentovision1.cloudjiffy.net/site_creation_list_by_client_id_api/';
export const LIST_SITE_DATA_CLIENT_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/site_creation_list_by_client_admin_id_api/';
export const LIST_SITE_DATA_SITE_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/site_creation_list_by_site_admin_id_api/';
export const LIST_SITE_DATA_USER_ID = 'https://tentovision1.cloudjiffy.net/site_creation_list_by_user_id_api/';

export const LIST_ATTENDANCE_SITE_DATA_CLIENT_ID = 'https://tentovision1.cloudjiffy.net/attendance_group_creation_list_by_client_id_api/';
export const LIST_ATTENDANCE_SITE_DATA_CLIENT_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/attendance_group_creation_list_by_client_admin_id_api/';
export const LIST_ATTENDANCE_SITE_DATA_SITE_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/attendance_group_creation_list_by_site_admin_id_api/';
export const LIST_ATTENDANCE_SITE_DATA_USER_ID = 'https://tentovision1.cloudjiffy.net/attendance_group_creation_list_by_user_id_api/';

export const LIST_CAMERA_DATA_CLIENT_ID = 'https://tentovision1.cloudjiffy.net/camera_creation_list_by_client_id_api/';
export const LIST_CAMERA_DATA_CLIENT_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/camera_creation_list_by_client_admin_id_api/';
export const LIST_CAMERA_DATA_SITE_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/camera_creation_list_by_site_admin_id_api/';
export const LIST_CAMERA_DATA_USER_ID = 'https://tentovision1.cloudjiffy.net/camera_creation_list_by_user_id_api/';
export const LIST_FACE_SEARCH_ID = 'https://tentovision1.cloudjiffy.net/face_id_search_list_api_get/';
export const LIST_FACE_SITE_USER_ID = 'https://tentovision1.cloudjiffy.net/face_list_by_site_user_id_date_time_api/';
export const CREATE_FACE_SEARCH_ID = 'https://tentovision1.cloudjiffy.net/face_id_search_list_api/';
export const ANPR_LIST_CAMERA_DATE_TIME = 'https://tentovision1.cloudjiffy.net/anpr_list_by_camera_id_date_time_api/';
export const HEATMAP_LIST_REGION_ID = 'https://tentovision1.cloudjiffy.net/motion_api_list_region_heatmap/';
export const HEATMAP_LIST_CAMERA_ID = 'https://tentovision1.cloudjiffy.net/heat_map_list_api/';


// export const CAMERAS_HEALTH = 'https://antmedia.cloudjiffy.net/WebRTCAppEE/rest/v2/broadcasts/';
export const CAMERAS_HEALTH = 'https://live.tentovision.com:5443/WebRTCAppEE/rest/v2/broadcasts/';
export const BACKEND_URI = 'http://localhost:5008/';

//FOR LOCAL TENTOVISION
export const LIST_DEVICE_DATA_CLIENT_ID_LOCAL = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_client_id_api/';
export const LIST_DEVICE_DATA_CLIENT_ADMIN_ID_LOCAL = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_client_admin_id_api/';
export const LIST_DEVICE_DATA_SITE_ADMIN_ID_LOCAL = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_site_admin_id_api/';
export const LIST_DEVICE_DATA_USER_ID_LOCAL = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_user_id_api/';
export const DEVICE_DATA_LOCAL = 'https://tentovision1.cloudjiffy.net/device_creation_api/';
export const DEVICE_CREATION_LOCAL = 'https://tentovision1.cloudjiffy.net/device_creation_api_orginal/';

// comment for
// export const DEVICE_DATA = 'https://tentovision1.cloudjiffy.net/device_creation_api/';
// export const USER_LOGIN = 'https://tentovision1.cloudjiffy.net/users_creation_api_validate/';
// export const LIST_DEVICE_DATA_CLIENT_ID = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_client_id_api/';
// export const LIST_DEVICE_DATA_CLIENT_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_client_admin_id_api/';
// export const LIST_DEVICE_DATA_SITE_ADMIN_ID = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_site_admin_id_api/';
// export const LIST_DEVICE_DATA_USER_ID = 'https://tentovision1.cloudjiffy.net/device_creation_list_by_user_id_api/';



export const CONVERT_IMAGE_TO_IMAGE = `${backendUrl}/convertImageToText`
export const CONVERT_TEXT_TO_EMBEDDING = `${backendUrl}/getEmbeddingFromText`





export const GET_ALL_CAMERA_VIDEO_URL = `${backendUrl}/getAllCameraVideoUrl`




export const GET_IMAGES_FOR_INITIAL = `${jetsonIpUrl}/Search_Initial`
export const POSTER_CREATION_IMAGE_API = `${imageGeneratorUrl}/Poster_creattion`
export const READ_IMAGE_FROM_PATH = `${localBackend}/read_image_from_path`
export const DOWNLOAD_IMAGE_FROM_PATH = `${localBackend}/download_image_from_path`


export const GET_IMAGES_FOR_IMAGE_SEARCH = 'http://10.147.21.167:5000/Search_Api'