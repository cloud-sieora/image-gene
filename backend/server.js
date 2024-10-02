const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
var https = require('https');
var fs = require('fs');
const awsIot = require('aws-iot-device-sdk')
const socket_io = require('socket.io')
const moment = require('moment')
const db = require('./db')
const multer = require('multer');
const path = require('path');

const { Cashfree } = require('cashfree-pg');
require('dotenv').config();

Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION




const client_creation_api = require('./api/client_creation_api')
const site_creation_api = require('./api/site_creation_api')
const live_occupency_creation_api = require('./api/live_occupency_api')
const heat_map_creation_api = require('./api/heat_map_api')
const queue_creation_api = require('./api/queue_api')
const attendance_list_api = require('./api/attendance_list_api')
const face_list_api = require('./api/face_list_api')
const motion_api = require('./api/motion_count_api')
const attendance_group_creation_api = require('./api/attendance_group_creation_api')

const users_creation_api = require('./api/users_creation_api')
const enrollment_users_creation_api = require('./api/enrollment_user_creation_api')
const super_admin_users_api = require('./api/super_admin_users_api')
const device_creation_api = require('./api/device_creation_api')

const alert_creation_api = require('./api/alert_creation_api')
const analytics_api = require('./api/analytics_api')

const camera_creation_api = require('./api/camera_creation_api')

const plans_api = require('./api/plans_api')
const payments_api = require('./api/payments_api')
const dealer_creation_api = require('./api/dealer_creation_api')
const admin_dealer_creation_api = require('./api/admin_dealer_creation_api')
const subscription_api = require('./api/subscription_api')
const holiday_creation_api = require('./api/holiday_creation_api')
const tarif_creation_api = require('./api/tarif_creation_api')
const vehicle_parking_creation_api = require('./api/vehicle_parking_creation_api')
const vehicle_tag_creation_api = require('./api/vehicle_tag_creation')
const vehicle_database_creation_api = require('./api/vehicle_database_creation_api')
const vehicle_overtime_creation_api = require('./api/vehicle_overtime_creation_api')
const encoding_creation_api = require('./api/tentovision_encoding_creation_api')
const face_id_search_creation_api = require('./api/face_id_search_creation_api')
const anpr_list_api = require('./api/anpr_creation_api')

// const auth_ADMIN = require('./auth/auth_admin')
// const auth_KITCHEN = require('./auth/auth_kitchen')
// const auth_OTHER = require('./auth/auth_other')


var cors = require('cors')
const middleware = require('./middleware');
const tags_api = require('./api/tags_api');
const camera_group_api = require('./api/camera_group_api');
const { imageCovertTextDes, textToGetEmbedding_api } = require('./api/search_api');
const { default: axios } = require('axios');
const camera_creation = require('./models/camera_creation');

var https_options = {

  key: fs.readFileSync('./key/tentovision1.cloudjiffy.net.key'),

  cert: fs.readFileSync("./key/tentovision1.cloudjiffy.net.cer"),

  ca: [fs.readFileSync('./key/ca.cer')]
};

const app = express()
const server2 = require("http").createServer(https_options, app);
const io = socket_io(server2)
const connection = db.connection;
app.use(cors())
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser())


const corsOptions = {
  origin: '*', // Allow all origins (not recommended for production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));

// app.post('/login', auth_ADMIN.login)

app.post('/client_creation_api_get', client_creation_api.listProducts)
app.get('/client_creation_api/:id', client_creation_api.getuserbyid)
app.post('/client_creation_api', client_creation_api.createProduct)
app.put('/client_creation_api/:id', client_creation_api.editProduct)
app.delete('/client_creation_api/:id', client_creation_api.deleteProduct)
// app.post('/get_data_device', user_creation_api.get_data_device)
app.post('/client_creation_api_validate', client_creation_api.user_validate)

// app.post('/user_creation_api_edit_device',  user_creation_api.edit_device)
// app.post('/user_creation_api_get_device_user_data',  user_creation_api.get_device_user_data)

app.post('/site_creation_api_get', site_creation_api.listProducts)
app.get('/site_creation_api/:id', site_creation_api.getuserbyid)
app.post('/site_creation_api', site_creation_api.createProduct)
app.put('/site_creation_api/:id', site_creation_api.editProduct)
app.delete('/site_creation_api/:id', site_creation_api.deleteProduct)
app.post('/site_creation_list_by_client_id_api', site_creation_api.list_by_client_id)
app.post('/site_creation_list_by_client_admin_id_api', site_creation_api.list_by_client_admin_id)
app.post('/site_creation_list_by_site_admin_id_api', site_creation_api.list_by_site_admin_id)
app.post('/site_creation_list_by_user_id_api', site_creation_api.list_by_user_id)
// app.post('/get_data_device', user_creation_api.get_data_device)
// app.post('/client_creation_api_validate',  client_creation_api.user_validate)

// app.post('/user_creation_api_edit_device',  user_creation_api.edit_device)
// app.post('/user_creation_api_get_device_user_data',  user_creation_api.get_device_user_data)

app.post('/live_occupency_creation_api_get', live_occupency_creation_api.listProducts)
app.get('/live_occupency_creation_api/:id', live_occupency_creation_api.getuserbyid)
app.post('/live_occupency_creation_api', live_occupency_creation_api.createProduct)
app.put('/live_occupency_creation_api/:id', live_occupency_creation_api.editProduct)
app.delete('/live_occupency_creation_api/:id', live_occupency_creation_api.deleteProduct)

app.post('/heat_map_creation_api_get', heat_map_creation_api.listProducts)
app.post('/heat_map_list_api', heat_map_creation_api.list_heat_map)
app.get('/heat_map_creation_api/:id', heat_map_creation_api.getuserbyid)
app.post('/heat_map_creation_api', heat_map_creation_api.createProduct)
app.put('/heat_map_creation_api/:id', heat_map_creation_api.editProduct)
app.delete('/heat_map_creation_api/:id', heat_map_creation_api.deleteProduct)

app.post('/queue_creation_api_get', queue_creation_api.listProducts)
app.post('/queue_creation_api_list_all', queue_creation_api.list_all)
app.get('/queue_creation_api/:id', queue_creation_api.getuserbyid)
app.post('/queue_creation_api', queue_creation_api.createProduct)
app.post('/queue_api_list_camera_id1', queue_creation_api.get_camera_id1)
app.put('/queue_creation_api/:id', queue_creation_api.editProduct)
app.delete('/queue_creation_api/:id', queue_creation_api.deleteProduct)


app.get('/users_creation_api', users_creation_api.listProducts)
app.post('/users_creation_list_by_dealer_id_api', users_creation_api.list_by_dealer_id)
app.post('/users_creation_list_by_admin_owner_id_api', users_creation_api.list_by_admin_owner_id)
app.post('/users_creation_list_by_client_id_api', users_creation_api.list_by_client_id)
app.post('/users_creation_list_by_client_admin_id_api', users_creation_api.list_by_client_admin_id)
app.post('/users_creation_list_by_site_admin_id_api', users_creation_api.list_by_site_admin_id)
app.post('/users_creation_list_by_user_id_api', users_creation_api.list_by_user_id)
app.get('/users_creation_api/:id', users_creation_api.getuserbyid)
app.post('/users_creation_api', users_creation_api.createProduct)
app.put('/users_creation_api/:id', users_creation_api.editProduct)
app.delete('/users_creation_api/:id', users_creation_api.deleteProduct)
app.post('/users_creation_api_validate', users_creation_api.user_validate)
app.post('/users_creation_api_validate_application', users_creation_api.user_validate_application)
app.post('/users_creation_api_get_common_details', users_creation_api.get_common_details)
app.get('/add_new_column_user', users_creation_api.add_new_column)
app.get('/remove_new_column_user', users_creation_api.remove_new_column)

app.get('/dealer_creation_api', dealer_creation_api.listProducts)
app.get('/dealer_creation_api/:id', dealer_creation_api.getuserbyid)
app.post('/dealer_creation_dealer_id_api', dealer_creation_api.get_dealer_id)
app.post('/dealer_creation_api', dealer_creation_api.createProduct)
app.put('/dealer_creation_api/:id', dealer_creation_api.editProduct)
app.delete('/dealer_creation_api/:id', dealer_creation_api.deleteProduct)
app.post('/dealer_creation_api_validate', dealer_creation_api.user_validate)
app.post('/dealer_creation_api_get_common_details', dealer_creation_api.get_common_details)
app.get('/add_new_column_dealer', dealer_creation_api.add_new_column)
app.get('/remove_new_column_dealer', dealer_creation_api.remove_new_column)

app.get('/admin_dealer_creation_api', admin_dealer_creation_api.listProducts)
app.post('/get_dealer_admin_api', admin_dealer_creation_api.get_dealer_admin)
app.get('/admin_dealer_creation_api/:id', admin_dealer_creation_api.getuserbyid)
app.post('/admin_dealer_creation_api', admin_dealer_creation_api.createProduct)
app.put('/admin_dealer_creation_api/:id', admin_dealer_creation_api.editProduct)
app.delete('/admin_dealer_creation_api/:id', admin_dealer_creation_api.deleteProduct)
app.post('/admin_dealer_creation_api_validate', admin_dealer_creation_api.user_validate)
app.post('/admin_dealer_creation_api_get_common_details', admin_dealer_creation_api.get_common_details)
app.get('/add_new_column_admin_dealer', admin_dealer_creation_api.add_new_column)
app.get('/remove_new_column_admin_dealer', admin_dealer_creation_api.remove_new_column)


app.post('/device_creation_api_list', device_creation_api.listProducts)
app.post('/device_creation_api_list_dealer', device_creation_api.listdealer)

app.get('/device_creation_api/:id', device_creation_api.getuserbyid)
app.post('/device_creation_api', device_creation_api.createProduct)
app.post('/device_creation_api_orginal', device_creation_api.createProduct_orginal)
app.post('/list_device_camera', device_creation_api.list_device_camera)
app.post('/list_device_site_id', device_creation_api.list_device_site_id)
app.post('/device_creation_list_by_client_id_api', device_creation_api.list_by_client_id)
app.post('/device_creation_list_by_client_admin_id_api', device_creation_api.list_by_client_admin_id)
app.post('/device_creation_list_by_site_admin_id_api', device_creation_api.list_by_site_admin_id)
app.post('/device_creation_list_by_user_id_api', device_creation_api.list_by_user_id)
app.post('/device_creation_list_by_client_id_api_status', device_creation_api.list_by_client_id_status)
app.post('/device_creation_list_by_client_admin_id_api_status', device_creation_api.list_by_client_admin_id_status)
app.post('/device_creation_list_by_site_admin_id_api_status', device_creation_api.list_by_site_admin_id_status)
app.post('/device_creation_list_by_user_id_api_status', device_creation_api.list_by_user_id_status)
app.put('/device_creation_api/:id', device_creation_api.editProduct)
app.put('/device_creation_api_orginal/:id', device_creation_api.editProduct_orginal)
app.delete('/device_creation_api/:id', device_creation_api.deleteProduct)
app.delete('/device_creation_api_orginal/:id', device_creation_api.deleteProduct_orginal)
app.post('/device_creation_api_validate', device_creation_api.device_validate)
app.post('/device_creation_api_by_user', device_creation_api.user_get_device)
app.get('/add_new_column_device', device_creation_api.add_new_column)
app.get('/remove_new_column_device', device_creation_api.remove_new_column)
app.post('/device_creation_api_edit_device', device_creation_api.edit_device)
app.post('/device_creation_api_device_get', device_creation_api.device_get)



app.post('/camera_creation_api_list', camera_creation_api.listProducts)
app.get('/camera_creation_api/:id', camera_creation_api.getuserbyid)
app.post('/list_camera_user_id', camera_creation_api.list_camera_user_id)
app.post('/camera_creation_api', camera_creation_api.createProduct)
app.post('/list_camera_device_api', camera_creation_api.list_camer_device_id)
app.post('/list_camera_id_api', camera_creation_api.list_camera_id)
app.put('/camera_creation_api/:id', camera_creation_api.editProduct)
app.delete('/camera_creation_api/:id', camera_creation_api.deleteProduct)
app.post('/camera_creation_list_by_client_id_api', camera_creation_api.list_by_client_id)
app.post('/camera_creation_list_by_client_admin_id_api', camera_creation_api.list_by_client_admin_id)
app.post('/camera_creation_list_by_site_admin_id_api', camera_creation_api.list_by_site_admin_id)
app.post('/camera_creation_list_by_user_id_api', camera_creation_api.list_by_user_id)
app.post('/camera_creation_list_by_device_id_api', camera_creation_api.list_camera_device_id)
app.get('/add_new_column_camera', camera_creation_api.add_new_column)
app.get('/remove_new_column_camera', camera_creation_api.remove_new_column)


app.get('/super_admin_users_api', super_admin_users_api.listProducts)
app.get('/super_admin_users_api/:id', super_admin_users_api.getuserbyid)
app.post('/super_admin_users_api', super_admin_users_api.createProduct)
app.put('/super_admin_users_api/:id', super_admin_users_api.editProduct)
app.delete('/super_admin_users_api/:id', super_admin_users_api.deleteProduct)
app.post('/super_admin_users_api_validate', super_admin_users_api.user_validate)


app.get('/alert_creation_api', alert_creation_api.listProducts)
app.get('/alert_creation_api/:id', alert_creation_api.getuserbyid)
app.post('/alert_creation_api', alert_creation_api.createProduct)
app.put('/alert_creation_api/:id', alert_creation_api.editProduct)
app.delete('/alert_creation_api/:id', alert_creation_api.deleteProduct)
app.get('/add_new_column_alert', alert_creation_api.add_new_column)
app.get('/remove_new_column_alert', alert_creation_api.remove_new_column)
app.post('/alert_creation_api_device_get', alert_creation_api.get_alerts)
app.post('/alert_creation_api_list_by_date', alert_creation_api.accounts_dashboard)
app.post('/alert_api_get_analytics_data', alert_creation_api.get_analytics_data)
app.post('/alert_creation_api_list_by_date_time', alert_creation_api.getalerts_by_date_time)

app.get('/analytics_api', analytics_api.listProducts)
app.get('/analytics_api/:id', analytics_api.getuserbyid)
app.post('/analytics_api', analytics_api.createProduct)
app.put('/analytics_api/:id', analytics_api.editProduct)
app.delete('/analytics_api/:id', analytics_api.deleteProduct)
app.get('/add_new_column_analytics', analytics_api.add_new_column)
app.get('/remove_new_column_analytics', analytics_api.remove_new_column)
app.post('/analytics_api_device_get', analytics_api.get_alerts)
app.post('/analytics_api_list_by_date', analytics_api.accounts_dashboard)
app.post('/analytics_api_get_analytics_data', analytics_api.get_analytics_data)
app.post('/analytics_api_get_date_time', analytics_api.get_analytics_date_time)
app.post('/analytics_api_get_date_time_playback', analytics_api.get_analytics_date_time_playback)
app.post('/analytics_api_get_for_playback', analytics_api.get_analytics_for_playback)
app.post('/analytics_api_get_play_back_trim', analytics_api.play_back_trim)
app.post('/getAllCameraVideoUrl', analytics_api.getAllCameraVideoUrlApi)


app.get('/plans_api', plans_api.listProducts)
app.get('/plans_api/:id', plans_api.getuserbyid)
app.post('/plans_api', plans_api.createProduct)
app.put('/plans_api/:id', plans_api.editProduct)
app.delete('/plans_api/:id', plans_api.deleteProduct)
app.post('/plans_api_get', plans_api.get_plan)
app.get('/add_new_column_plan', plans_api.add_new_column)

app.get('/subscription_api', subscription_api.listProducts)
app.get('/subscription_api/:id', subscription_api.getuserbyid)
app.post('/subscription_api', subscription_api.createProduct)
app.post('/subscription_explain_api', subscription_api.subscription_explain)
app.put('/subscription_api/:id', subscription_api.editProduct)
app.delete('/subscription_api/:id', subscription_api.deleteProduct)
app.post('/subscription_api_get', subscription_api.get_plan)

app.get('/tag_api', tags_api.listProducts)
app.get('/tag_api/:id', tags_api.getuserbyid)
app.post('/tag_api', tags_api.createProduct)
app.put('/tag_api/:id', tags_api.editProduct)
app.delete('/tag_api/:id', tags_api.deleteProduct)
app.post('/tag_listProducts_user_id', tags_api.listProducts_user_id)
app.post('/tag_listbyall_id', tags_api.listbyall_id)
app.get('/add_new_column_tag', tags_api.add_new_column)

app.get('/camera_group_api', camera_group_api.listProducts)
app.get('/camera_group_api/:id', camera_group_api.getuserbyid)
app.post('/camera_group_api', camera_group_api.createProduct)
app.put('/camera_group_api/:id', camera_group_api.editProduct)
app.delete('/camera_group_api/:id', camera_group_api.deleteProduct)
app.post('/camera_listProducts_user_id', camera_group_api.listProducts_user_id)
app.post('/camera_listbyall_id', camera_group_api.listbyall_id)
app.get('/add_new_column_groups', camera_group_api.add_new_column)

app.post('/attendance_group_creation_api_get', attendance_group_creation_api.listProducts)
app.get('/attendance_group_creation_api/:id', attendance_group_creation_api.getuserbyid)
app.post('/attendance_group_creation_api', attendance_group_creation_api.createProduct)
app.put('/attendance_group_creation_api/:id', attendance_group_creation_api.editProduct)
app.delete('/attendance_group_creation_api/:id', attendance_group_creation_api.deleteProduct)
app.post('/attendance_group_creation_list_by_client_id_api', attendance_group_creation_api.list_by_client_id)
app.post('/attendance_group_creation_list_by_client_admin_id_api', attendance_group_creation_api.list_by_client_admin_id)
app.post('/attendance_group_creation_list_by_site_admin_id_api', attendance_group_creation_api.list_by_site_admin_id)
app.post('/attendance_group_creation_list_by_user_id_api', attendance_group_creation_api.list_by_user_id)

app.get('/enrollment_users_creation_api', enrollment_users_creation_api.listProducts)
app.post('/enrollment_users_creation_list_by_user_id_api', enrollment_users_creation_api.list_by_user_id)
app.post('/enrollment_users_creation_list_by_site_id_api', enrollment_users_creation_api.list_by_site_id)
app.get('/enrollment_users_creation_api/:id', enrollment_users_creation_api.getuserbyid)
app.post('/enrollment_users_creation_api', enrollment_users_creation_api.createProduct)
app.post('/enrollment_users_list_emp_id_api', enrollment_users_creation_api.list_user_id)
app.post('/enrollment_users_list_client_id_api', enrollment_users_creation_api.list_client_id)
app.put('/enrollment_users_creation_api/:id', enrollment_users_creation_api.editProduct)
app.put('/enrollment_users_creation_orginal_api/:id', enrollment_users_creation_api.editProduct_orginal)
app.delete('/enrollment_users_creation_api/:id', enrollment_users_creation_api.deleteProduct)
app.get('/add_new_column_enrollment_user', enrollment_users_creation_api.add_new_column)
app.get('/remove_new_column_enrollment_user', enrollment_users_creation_api.remove_new_column)


app.post('/update_embeding_count', (req, res) => {
  io.emit("new embeding", JSON.stringify({ id: req.body.emp_id, data: req.body.embedding_count }));
  enrollment_users_creation_api.update_embeding_count(req, res)
})


app.post('/enroll_image', (req, res) => {
  const filePath = path.join(__dirname, req.body.key);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('Error accessing HLS file:', err);
      res.status(500).send('HLS file not available');
      return;
    }

    res.sendFile(filePath);
  });
});

app.post('/attendance_list_api_get', attendance_list_api.listProducts)
app.get('/attendance_list_api/:id', attendance_list_api.getuserbyid)
app.post('/attendance_list_api', attendance_list_api.createProduct)
app.post('/attendance_list_mobile_api', attendance_list_api.createMobile)
app.put('/attendance_list_api/:id', attendance_list_api.editProduct)
app.delete('/attendance_list_api/:id', attendance_list_api.deleteProduct)
app.post('/attendance_list_by_user_id_api', attendance_list_api.list_by_user_id)
app.post('/attendance_list_by_site_id_api', attendance_list_api.list_by_site_id)
app.post('/attendance_list_by_user_id_date_api', attendance_list_api.list_by_user_id_date)
app.post('/attendance_list_by_site_id_date_api', attendance_list_api.list_by_site_id_date)
app.post('/attendance_list_by_user_id_date_time_api', attendance_list_api.list_by_user_id_date_time)
app.post('/attendance_list_by_user_id_date_time_present_api', attendance_list_api.list_by_user_id_date_time_present)

app.post('/tarif_list_api_get', tarif_creation_api.listProducts)
app.get('/tarif_list_api/:id', tarif_creation_api.getuserbyid)
app.post('/tarif_list_api', tarif_creation_api.createProduct)
app.put('/tarif_list_api/:id', tarif_creation_api.editProduct)
app.delete('/tarif_list_api/:id', tarif_creation_api.deleteProduct)

app.post('/vehicle_overtime_list_api_get', vehicle_overtime_creation_api.listProducts)
app.get('/vehicle_overtime_list_api/:id', vehicle_overtime_creation_api.getuserbyid)
app.post('/vehicle_overtime_list_api', vehicle_overtime_creation_api.createProduct)
app.put('/vehicle_overtime_list_api/:id', vehicle_overtime_creation_api.editProduct)
app.delete('/vehicle_overtime_list_api/:id', vehicle_overtime_creation_api.deleteProduct)

app.post('/vehicle_database_list_api_get', vehicle_database_creation_api.listProducts)
app.post('/vehicle_database_list_client_id_api_get', vehicle_database_creation_api.list_client_id)
app.get('/vehicle_database_list_api/:id', vehicle_database_creation_api.getuserbyid)
app.post('/vehicle_database_list_api', vehicle_database_creation_api.createProduct)
app.put('/vehicle_database_list_api/:id', vehicle_database_creation_api.editProduct)
app.delete('/vehicle_database_list_api/:id', vehicle_database_creation_api.deleteProduct)

app.post('/vehicle_parking_list_api_get', vehicle_parking_creation_api.listProducts)
app.post('/vehicle_parking_list_in_out_api_get', vehicle_parking_creation_api.list_vehicle_in_out)
app.post('/vehicle_parking_list_payment_status_api_get', vehicle_parking_creation_api.list_vehicle_payment_status)
app.post('/vehicle_parking_list_alert_api_get', vehicle_parking_creation_api.list_vehicle_alert)
app.get('/vehicle_parking_list_api/:id', vehicle_parking_creation_api.getuserbyid)
app.post('/vehicle_parking_list_api', vehicle_parking_creation_api.createProduct)
app.put('/vehicle_parking_list_api/:id', vehicle_parking_creation_api.editProduct)
app.delete('/vehicle_parking_list_api/:id', vehicle_parking_creation_api.deleteProduct)

app.get('/vehicle_tag_creation_api', vehicle_tag_creation_api.listProducts)
app.get('/vehicle_tag_creation_api/:id', vehicle_tag_creation_api.getuserbyid)
app.post('/vehicle_tag_creation_api', vehicle_tag_creation_api.createProduct)
app.put('/vehicle_tag_creation_api/:id', vehicle_tag_creation_api.editProduct)
app.delete('/vehicle_tag_creation_api/:id', vehicle_tag_creation_api.deleteProduct)
app.post('/vehicle_tag_creation_listProducts_user_id', vehicle_tag_creation_api.listProducts_user_id)
app.post('/vehicle_tag_creation_listbyall_id', vehicle_tag_creation_api.listbyall_id)
app.get('/add_new_column_vehicle_tag', vehicle_tag_creation_api.add_new_column)

app.post('/holiday_creation_api_get', holiday_creation_api.listProducts)
app.get('/holiday_creation_api/:id', holiday_creation_api.getuserbyid)
app.post('/holiday_creation_api', holiday_creation_api.createProduct)
app.put('/holiday_creation_api/:id', holiday_creation_api.editProduct)
app.delete('/holiday_creation_api/:id', holiday_creation_api.deleteProduct)
app.post('/holiday_creation_list_by_client_id_api', holiday_creation_api.list_by_client_id)

app.post('/motion_api_get', motion_api.listProducts)
app.get('/motion_api/:id', motion_api.getuserbyid)
app.post('/motion_api', motion_api.createProduct)
app.put('/motion_api/:id', motion_api.editProduct)
app.delete('/motion_api/:id', motion_api.deleteProduct)
app.post('/motion_api_list_camera_id1', motion_api.get_camera_id1)
app.post('/motion_api_list_camera_vehicle', motion_api.get_camera_vehicle)
app.post('/motion_api_list_region_heatmap', motion_api.get_heat_map)
app.post('/motion_api_list_raw_data', motion_api.get_motion_count_raw_data)
app.get('/add_new_column_motion', analytics_api.add_new_column)
app.get('/remove_new_column_motion', analytics_api.remove_new_column)

app.post('/face_list_api_get', face_list_api.listProducts)
app.get('/face_list_api/:id', face_list_api.getuserbyid)
app.post('/face_list_api', face_list_api.createProduct)
app.put('/face_list_api/:id', face_list_api.editProduct)
app.delete('/face_list_api/:id', face_list_api.deleteProduct)
app.post('/face_list_by_user_id_api', face_list_api.list_by_user_id)
app.post('/face_list_by_site_id_api', face_list_api.list_by_site_id)
app.post('/face_list_by_user_id_date_api', face_list_api.list_by_user_id_date)
app.post('/face_list_by_site_id_date_api', face_list_api.list_by_site_id_date)
app.post('/face_list_by_user_id_date_time_api', face_list_api.list_by_user_id_date_time)
app.post('/face_list_by_site_user_id_date_time_api', face_list_api.list_by_user_site_date_time)
app.get('/add_new_column_face_user', face_list_api.add_new_column)
app.get('/remove_new_column_face_user', face_list_api.remove_new_column)

app.post('/face_id_search_list_api_get', face_id_search_creation_api.listProducts)
app.get('/face_id_search_list_api/:id', face_id_search_creation_api.getuserbyid)
app.post('/face_id_search_list_api', face_id_search_creation_api.createProduct)
app.put('/face_id_search_list_api/:id', face_id_search_creation_api.editProduct)
app.delete('/face_id_search_list_api/:id', face_id_search_creation_api.deleteProduct)

app.post('/anpr_list_api_get', anpr_list_api.listProducts)
app.get('/anpr_list_api/:id', anpr_list_api.getuserbyid)
app.post('/anpr_list_api', anpr_list_api.createProduct)
app.put('/anpr_list_api/:id', anpr_list_api.editProduct)
app.delete('/anpr_list_api/:id', anpr_list_api.deleteProduct)
app.post('/anpr_list_by_camera_id_date_time_api', anpr_list_api.list_by_camera_id_date_time)
app.get('/add_new_column_anpr', anpr_list_api.add_new_column)
app.get('/remove_new_column_anpr', anpr_list_api.remove_new_column)


app.post('/encoding_list_api_get', encoding_creation_api.listProducts)
app.post('/encoding_list_user_id_api', encoding_creation_api.list_user_id)
app.post('/encoding_list_site_id_api', encoding_creation_api.list_site_id)
app.get('/encoding_list_api/:id', encoding_creation_api.getuserbyid)
app.post('/encoding_list_api', encoding_creation_api.createProduct)
app.put('/encoding_list_api/:id', encoding_creation_api.editProduct)
app.delete('/encoding_list_api/:id', encoding_creation_api.deleteProduct)


app.get('/payments_api', payments_api.listProducts)
app.get('/payments_api/:id', payments_api.getuserbyid)
app.post('/payments_api', payments_api.createProduct)
app.put('/payments_api/:id', payments_api.editProduct)
app.delete('/payments_api/:id', payments_api.deleteProduct)
app.post('/payments_api_get_all', payments_api.get_payment_all)
app.post('/payments_api_get_dealer', payments_api.get_payment_dealer)
app.post('/payments_api_get_user', payments_api.get_payment_user)











// Image Search
app.post('/convertImageToText', imageCovertTextDes)
app.post('/getEmbeddingFromText', textToGetEmbedding_api)




















const upload = multer({
  dest: 'uploads'
}); // Create a new folder named 'uploads'

app.post('/upload_image', upload.single('image'), (req, res) => {
  const uploadedFile = req.file;
  if (uploadedFile) {
    const newPath = path.join('uploads', uploadedFile.originalname);
    fs.rename(uploadedFile.path, newPath, (err) => {
      if (err) {
        console.error('Error moving file:', err);
        res.status(500).send('Error uploading image');
      } else {
        console.log('File uploaded successfully:', newPath);
        res.json({ message: 'File uploaded successfully', path: newPath });
      }
    });
  } else {
    console.error('No file uploaded');
    res.status(400).send('No file uploaded');
  }
});


app.post('/read_image_from_path', (req, res) => {
  let allImageData = req.body.map((image) => {
    const imagePath = path.join(image.imageurl);

    try {
      // Read image file as buffer
      const imageBuffer = fs.readFileSync(imagePath);

      // Convert image buffer to base64 string
      const imageBase64 = imageBuffer.toString('base64');

      // Return the image data in the response
      return { ...image, imageurl: imageBase64 };
    } catch (err) {
      console.error(`Error reading image: ${imagePath}`, err);
      return { ...image, imageurl: null, error: "Image not found or error reading file" };
    }
  });

  res.send({ status: true, data: allImageData });
});


app.post('/download_image_from_path', (req, res) => {
  const imagePath = path.join(req.body.path); // Path to image

  try {
    // Read image file as buffer
    const imageBuffer = fs.readFileSync(imagePath);

    // Set headers and send the binary image data
    res.setHeader('Content-Type', 'image/png'); // Set correct content type for the image
    res.status(200).send(imageBuffer); // Send image buffer directly
  } catch (err) {
    console.error(`Error reading image: ${imagePath}`, err);
    res.status(500).send({ status: false, message: 'Image not found or error reading file' });
  }
});

app.post('/delete_image', (req, res) => {
  try {
    const filePath = path.join(__dirname, req.body.image_key);
    fs.unlinkSync(filePath);
    console.log('File deleted successfully!');
    res.json({ message: 'File deleted successfully!' })
  } catch (err) {
    console.error('An error occurred:', err);
    res.json({ message: 'An error occurred' })
  }
});

app.post('/secret', async (req, res) => {

  console.log(req.body, 'post method');
  const stripe = require('stripe')('sk_test_51PDG2USJ5GDjCi3yMd6RWwYwqWPWLfuIWnHt1lHw9xwPoLbU8k7dDngdEUHJ9SGKdMZXqP2nubHyQSHDAXpAJqSR00T07a4LEk');
  const intent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: req.body.currency,
    description: 'Software development services',
    shipping: {
      name: req.body.name,
      address: req.body.address,
    },
  });

  let payment = {
    plan_name: 'NONE',
    payment_mode: "Online",
    payment_gateway: 'Stripe',
    amount: req.body.amount,
    start_date: req.body.sub.cameras[0].start_date,
    start_time: req.body.sub.cameras[0].start_time,
    end_date: req.body.sub.cameras[0].end_date,
    end_time: req.body.sub.cameras[0].end_time,
    status: 'COMPLETED',
    user_id: req.body.sub.client_id,
    dealer_id: req.body.dealer_id,
    payment_gateway_id: intent.client_secret,
  }

  const subscription = require('./models/subscription')
  const payments = require('./models/payments')

  const sub_data = await subscription.create(req.body.sub)
  await payments.create(payment)
  res.json({ client_secret: intent.client_secret });
});

//----------------------------------------------------Cashfree Payment Integration-----------------------------------------------------

app.post('/payment', async (req, res) => {

  try {

    let request = {
      "order_amount": req.body.amount,
      "order_currency": req.body.currency,
      "order_id": `tvision${Date.now()}`,
      "customer_details": req.body.customer_details,
      "order_meta": {
        "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/card?order_id={order_id}"
      }
    }

    Cashfree.PGCreateOrder('2023-08-01', request).then(response => {
      console.log(response.data, 'newe data');
      res.json(response.data);

    }).catch(error => {
      console.error(error.response.data.message);
      res.json({ error: error.response.data.message });
    })


  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }


})

app.post('/verify', async (req, res) => {

  try {

    let {
      orderId
    } = req.body;

    Cashfree.PGOrderFetchPayments("2023-08-01", orderId).then((response) => {

      res.json(response.data);
    }).catch(error => {
      console.error(error.response.data.message);
    })


  } catch (error) {
    console.log(error);
  }
})

app.post('/save_sub_plan', async (req, res) => {
  let payment = {
    plan_name: 'NONE',
    payment_mode: "Online",
    payment_gateway: req.body.gateway_name,
    amount: req.body.amount,
    start_date: req.body.sub.cameras[0].start_date,
    start_time: req.body.sub.cameras[0].start_time,
    end_date: req.body.sub.cameras[0].end_date,
    end_time: req.body.sub.cameras[0].end_time,
    status: 'COMPLETED',
    user_id: req.body.sub.client_id,
    dealer_id: req.body.dealer_id,
    payment_gateway_id: req.body.orderId,
  }



  const subscription = require('./models/subscription')
  const payments = require('./models/payments')

  await subscription.create(req.body.sub)
  await payments.create(payment)
  console.log('saved');
  return { success: true }
})

//-------------------------------------------------------------------------------------------------------------------------------------------------

// app.post('/alert_creation_api_send_noti',  alert_creation_api.send_notification)





// var https_options = {

//   key: fs.readFileSync('./key/tentovision1.cloudjiffy.net.key'),

//   cert: fs.readFileSync("./key/tentovision1.cloudjiffy.net.cer"),

//   ca: [fs.readFileSync('./key/ca.cer')]
// };


// https.createServer(https_options, app).listen(5008);

io.on('connect', (socket) => {
  console.log('user connected', socket.id);
  io.emit('frontend', 'Backend connected')

  socket.on('disconnect', () => {
    console.log('disconnect');
  })
})


app.post('/liveCamera/getMotionForCamera', async (req, res) => {
  try {
    let {camera_id, motion_type} = req.body
    console.log(camera_id, motion_type);
    console.log('motion_type', motion_type, camera_id);
    
    const isUpdated = await camera_creation.edit(camera_id, {
      motion_type: motion_type
    })
    if(isUpdated){
      io.emit('motion', { camera_id, motion_type })
      res.status(200).json({ status: true, message: 'motion sent' })
    }else{
      res.status(200).json({ status: false, message: 'motion not sent' })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, data: err.message })
  }
})


app.post('/search/imageChanges', async(req, res) =>{
  let payload = req.body
  console.log(payload)
  try{
    io.emit('search_image', {payload})
    // let allImageData = req.body.map((image) => {
    //   const imagePath = path.join(image.imageurl);
  
    //   try {
    //     // Read image file as buffer
    //     const imageBuffer = fs.readFileSync(imagePath);
  
    //     // Convert image buffer to base64 string
    //     const imageBase64 = imageBuffer.toString('base64');
  
    //     // Return the image data in the response
    //     return { ...image, imageurl: imageBase64 };
    //   } catch (err) {
    //     console.error(`Error reading image: ${imagePath}`, err);
    //     return { ...image, imageurl: null, error: "Image not found or error reading file" };
    //   }
    // });
  
    res.send({ status: true });
     
  }catch (err) {
    console.log(err);
    res.status(500).json({ status: false, data: err.message })
  }
})


connection.once("open", () => {
  console.log("MongoDB database connected");

  console.log("Setting change streams");
  const thoughtChangeStream = connection.collection("queue").watch()
  const livetChangeStream = connection.collection("live_occupencies").watch()
  const embedingtChangeStream = connection.collection("enrollment_users_creation").watch()
  const alertChangeStream = connection.collection("Alert_creation").watch()
  thoughtChangeStream.on("change", (change) => {
    console.log("called");
    console.log(change.operationType)
    // console.log(change.fullDocument);
    switch (change.operationType) {
      case "insert":

        io.emit("new queue", change.fullDocument);
        break;

      // case "delete":
      //   io.of("/api/socket").emit("deletedThought", change.documentKey._id);
      //   break;

      // case 'update':
      //   let option = {
      //     key: change.documentKey,
      //     updateDescription: change.updateDescription.updatedFields
      //   }

      //   io.emit("update alert", option);
      //   break;
    }
  });

  livetChangeStream.on("change", async (change) => {
    console.log("called");
    console.log(change.operationType)
    // console.log(change);
    switch (change.operationType) {
      case "insert":

        io.emit("new live", change.fullDocument);
        break;

      // case "delete":
      //   io.of("/api/socket").emit("deletedThought", change.documentKey._id);
      //   break;

      case 'update':
        let data = await live_occupency_creation_api.getuserbyid_static(change.documentKey._id)
        io.emit("new live", JSON.stringify(data));
        break;

      //   io.emit("update alert", option);
      //   break;
    }
  });

  embedingtChangeStream.on("change", async (change) => {
    console.log("called");
    console.log(change.operationType)
    // console.log(change.fullDocument);
    switch (change.operationType) {
      // case "insert":

      //   io.emit("new live", change.fullDocument);
      //   break;

      // case "delete":
      //   io.of("/api/socket").emit("deletedThought", change.documentKey._id);
      //   break;

      case 'update':
        // let data = await enrollment_users_creation_api.getuserbyid_static(change.documentKey._id)
        io.emit("new embeding", JSON.stringify({ id: change.documentKey._id, data: change.updateDescription.updatedFields }));
        break;

      //   io.emit("update alert", option);
      //   break;
    }
  });

  alertChangeStream.on("change", (change) => {
    console.log("called");
    console.log(change.operationType)
    // console.log(change.fullDocument);
    switch (change.operationType) {
      case "insert":

        // io.emit("new alert", change.fullDocument);
        break;

      // case "delete":
      //   io.of("/api/socket").emit("deletedThought", change.documentKey._id);
      //   break;

      // case 'update':
      //   let option = {
      //     key: change.documentKey,
      //     updateDescription: change.updateDescription.updatedFields
      //   }

      //   io.emit("update alert", option);
      //   break;
    }
  });
});

const device = awsIot.device({
  keyPath: './Jetson_Test/private.pem.key',
  certPath: './Jetson_Test/certificate.pem.crt',
  caPath: './Jetson_Test/AmazonRootCA1.pem',
  clientId: 'tentovision_iot_321',
  region: 'ap-south-1',
  host: process.env.AWS_MQTT_KEY
});

device.on('connect', () => {
  console.log('Connected to AWS IoT');

  device.subscribe('get_camera', (error, result) => {
    if (error) {
      console.error('Error subscribing to topic1:', error);
    } else {
      console.log('Subscribed to topic1:', result);
    }
  });

  device.subscribe('get_mask_image', (error, result) => {
    if (error) {
      console.error('Error subscribing to topic1:', error);
    } else {
      console.log('Subscribed to topic1:', result);
    }
  });

  device.subscribe('post_camera_mp', (error, result) => {
    if (error) {
      console.error('Error subscribing to topic1:', error);
    } else {
      console.log('Subscribed to topic1:', result);
    }
  });
});

device.on('message', (topic, payload) => {
  // if (topic == 'get_camera') {
  //   // io.emit('cameraDetails', payload.toString())
  // } else {
  //   // io.emit('mask_image', payload.toString())
  // }

  console.log(topic);
  if (topic == 'post_camera_mp') {
    const data = JSON.parse(payload.toString());
    io.to(data.socket_id).emit("camera_mp", payload.toString());
  }
  console.log(`Received message on topic ${topic}: ${payload.toString()}`);
});
















































// Handle errors
device.on('error', (error) => {
  console.error('Error:', error);
});

// Handle close event
// device.on('close', () => {
//   console.log('Connection to AWS IoT closed');
// });

// Handle offline event
// device.on('offline', () => {
//   console.log('Device is offline');
// });


app.use(middleware.handleValidationError)
app.use(middleware.handleError)
app.use(middleware.notFound)


server2.listen(5008, () =>
  console.log(`Server listening on port ${5008}`)
)

// if (require.main !== module) {
//   module.exports = server2
// }

// user_creation.create_from_files()
// daily_entries.create_from_files()
// menu_management_main_category.copy_menu("3","delivery","44")
// menu_management_main_category.remove("ckvhkdmtj0000sxrvh05u3wu1")


//  setInterval(function(){
//  order_management_try.process()
//  order_management_subscribe.process()
//  }, 1000);      