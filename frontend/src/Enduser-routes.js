import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Home = React.lazy(() => import('./BillingApp_Components/EndUser/Home'));
const CameraLiveView = React.lazy(() => import('./BillingApp_Components/EndUser/CameraLiveView'));
const EventMenu = React.lazy(() => import('./BillingApp_Components/EndUser/EventMenu'));
const MotionEvents = React.lazy(() => import('./BillingApp_Components/EndUser/MotionEvents/index'));
const Dashboard = React.lazy(() => import('./BillingApp_Components/EndUser/Dashboard/index'));
const Alert = React.lazy(() => import('./BillingApp_Components/EndUser/Alert/index'));
const voiceAssist = React.lazy(() => import('./BillingApp_Components/EndUser/VoiceAssist/index'));
const Masking = React.lazy(() => import('./BillingApp_Components/EndUser/Mask/index'));
const DeviceCreations = React.lazy(() => import('./BillingApp_Components/EndUser/Device_creation/Device_list'));
const UserCreation = React.lazy(() => import('./BillingApp_Components/EndUser/user_creation/index'));
const GroupCreation = React.lazy(() => import('./BillingApp_Components/EndUser/CameraGroup/index'));
const UserAccount = React.lazy(() => import('./BillingApp_Components/EndUser/UserAccount'))
const PlayBack = React.lazy(() => import('./BillingApp_Components/EndUser/Playback/index'));
const Attendance = React.lazy(() => import('./BillingApp_Components/EndUser/Attendance/index'));
const Customer_analytics = React.lazy(() => import('./BillingApp_Components/EndUser/Customer_Analytics/index'));
const Vehicle_analytics = React.lazy(() => import('./BillingApp_Components/EndUser/Vehicle_Analytics/index'));
const Queue_analytics = React.lazy(() => import('./BillingApp_Components/EndUser/Queue_Analytics/index'));
const Face_recoination = React.lazy(() => import('./BillingApp_Components/EndUser/FaceRecogination/index'));
const Anpr = React.lazy(() => import('./BillingApp_Components/EndUser/Anpr/index'));
const Heat_map = React.lazy(() => import('./BillingApp_Components/EndUser/Heatmap/index'));
const Smart_parking = React.lazy(() => import('./BillingApp_Components/EndUser/Smart_parking/index'));
const authentication = React.lazy(() => import('./BillingApp_Components/EndUser/Mobile_app/authentication'));
const playbackTwo = React.lazy(() => import('./BillingApp_Components/EndUser/PlayVideo/PlayBack'));
const Search = React.lazy(() => import('./BillingApp_Components/EndUser/Search/Search'));
const ImageGene = React.lazy(() => import('./BillingApp_Components/EndUser/ImageGene/ImageGene'));

const routes = [
    { path: '/Home/Home', exact: true, name: 'Default', component: Home },
    { path: '/Home/Home/:id', exact: true, name: 'Default', component: CameraLiveView },
    { path: '/Home/Home/Eventmenu', exact: true, name: 'Default', component: EventMenu },
    { path: '/MotionEvents', exact: true, name: 'Default', component: MotionEvents },
    { path: '/Dashboard', exact: true, name: 'Default', component: Dashboard },
    { path: '/Alert', exact: true, name: 'Default', component: Alert },
    { path: '/voiceAssist', exact: true, name: 'Default', component: voiceAssist },
    { path: '/Masking', exact: true, name: 'Default', component: Masking },
    { path: '/DeviceCreations/DeviceCreations', exact: true, name: 'Default', component: DeviceCreations },
    { path: '/UserCreations/UserCreations', exact: true, name: 'Default', component: UserCreation },
    { path: '/SiteCreations/SiteCreations', exact: true, name: 'Default', component: GroupCreation },
    { path: '/Playback', exact: true, name: 'Default', component: PlayBack },
    { path: '/Search', exact: true, name: 'Default', component: Search },
    { path: '/PlayVideo', exact: true, name: 'Default', component: playbackTwo },
    { path: '/Account', exact: true, name: 'Default', component: UserAccount },
    { path: '/Attendance', exact: true, name: 'Default', component: Attendance },
    { path: '/CustomerAnalytics', exact: true, name: 'Default', component: Customer_analytics },
    { path: '/VehicleAnalytics', exact: true, name: 'Default', component: Vehicle_analytics },
    { path: '/QueueAnalytics', exact: true, name: 'Default', component: Queue_analytics },
    { path: '/FaceRecognition', exact: true, name: 'Default', component: Face_recoination },
    { path: '/ANPR', exact: true, name: 'Default', component: Anpr },
    { path: '/Heatmap', exact: true, name: 'Default', component: Heat_map },
    { path: '/SmartParking', exact: true, name: 'Default', component: Smart_parking },
    { path: '/ImageGene', exact: true, name: 'Default', component: ImageGene },

];

export default routes;