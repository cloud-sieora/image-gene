
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import axios from 'axios'
const userData = JSON.parse(localStorage.getItem("userData"))


// userData.position_type == 'Site Admin' ?
let userobj = {}
if (userData.position_type == 'Client Admin' || userData.position_type == 'Client') {
    userobj = {
        items: [

            {
                id: '1',
                title: 'Live',
                type: 'group',
                icon: 'video',
                children: [
                    {
                        id: 'UserCreation',
                        title: 'Live',
                        type: 'item',
                        url: '/Home/Home',
                        icon: 'video',
                    }
                ]
            },
            // {
            //     id: '12',
            //     title: 'Search',
            //     type: 'group',
            //     icon: 'video',
            //     children: [
            //         {
            //             id: 'Search',
            //             title: 'Search',
            //             type: 'item',
            //             url: '/Search',
            //             icon: 'search',
            //         }
            //     ]
            // },

            // {
            //     id: '2',
            //     title: 'Events and Analytics',
            //     type: 'group',
            //     icon: 'film',
            //     children: [
            //         {
            //             id: 'EventsandAnalytics',
            //             title: 'Events and Analytics',
            //             type: 'item',
            //             url: '/MotionEvents',
            //             icon: 'film',
            //         }
            //     ]
            // },

            // {
            //     id: '3',
            //     title: 'Alert Events',
            //     type: 'group',
            //     icon: 'alert-circle',
            //     children: [
            //         {
            //             id: 'AlertEvents',
            //             title: 'Alert Events',
            //             type: 'item',
            //             url: '/Alert',
            //             icon: 'alert-circle',
            //         }
            //     ]
            // },

            // {
            //     id: '4',
            //     title: 'Attendance',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Attendance',
            //             title: 'Attendance',
            //             type: 'item',
            //             url: '/Attendance',
            //             icon: 'calendar',
            //         }
            //     ]
            // },

            {
                id: '5',
                title: 'People Analytics',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'People Analytics',
                        title: 'People Analytics',
                        type: 'item',
                        url: '/CustomerAnalytics',
                        icon: 'bar-chart',
                    }
                ]
            },
            {
                id: '5',
                title: 'Image Generator',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Image Generator',
                        title: 'Image Generator',
                        type: 'item',
                        url: '/ImageGene',
                        icon: 'bar-chart',
                    }
                ]
            },
            // {
            //     id: '6',
            //     title: 'Vehicle Analytics',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Vehicle Analytics',
            //             title: 'Vehicle Analytics',
            //             type: 'item',
            //             url: '/VehicleAnalytics',
            //             icon: 'truck',
            //         }
            //     ]
            // },
            // {
            //     id: '7',
            //     title: 'Queue Analytics',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Queue Analytics',
            //             title: 'Queue Analytics',
            //             type: 'item',
            //             url: '/QueueAnalytics',
            //             icon: 'users',
            //         }
            //     ]
            // },
            // {
            //     id: '8',
            //     title: 'Heat Map',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Heat Map',
            //             title: 'Heat Map',
            //             type: 'item',
            //             url: '/Heatmap',
            //             icon: 'image',
            //         }
            //     ]
            // },
            // {
            //     id: '6',
            //     title: 'Customer Analytics',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Customer Analytics',
            //             title: 'Customer Analytics',
            //             type: 'item',
            //             url: '/Heatmap',
            //             icon: 'truck',
            //         }
            //     ]
            // },
            // {
            //     id: '9',
            //     title: 'Face Recognition',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Face Recognition',
            //             title: 'Face Recognition',
            //             type: 'item',
            //             url: '/FaceRecognition',
            //             icon: 'smile',
            //         }
            //     ]
            // },
            // {
            //     id: '10',
            //     title: 'ANPR',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Anpr',
            //             title: 'ANPR',
            //             type: 'item',
            //             url: '/Anpr',
            //             icon: 'crosshair',
            //         }
            //     ]
            // },
            // {
            //     id: '6',
            //     title: 'Smart Parking',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Smart Parking',
            //             title: 'Smart Parking',
            //             type: 'item',
            //             url: '/SmartParking',
            //             icon: 'truck',
            //         }
            //     ]
            // },

            {
                id: '11',
                title: 'Cameras Management',
                type: 'group',
                icon: 'camera',
                children: [
                    {
                        id: 'Cameras Management',
                        title: 'Cameras Management',
                        type: 'item',
                        url: '/SiteCreations/SiteCreations',
                        icon: 'camera',
                    }
                ]
            },

            // {
            //     id: '12',
            //     title: 'User Creation',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'User Creation',
            //             title: 'User Creation',
            //             type: 'item',
            //             url: '/UserCreations/UserCreations',
            //             icon: 'user-plus',
            //         }
            //     ]
            // },

            // {
            //     id: '5',
            //     title: 'Dashboard',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Dashboard',
            //             title: 'Dashboard',
            //             type: 'item',
            //             url: '/Dashboard',
            //             icon: 'trello',
            //         }
            //     ]
            // },
            // {
            //     id: '3',
            //     title: 'Device Creations',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'DeviceCreations',
            //             title: 'Device Creations',
            //             type: 'item',
            //             url: '/DeviceCreations/DeviceCreations',
            //             icon: 'feather icon-trending-up',
            //         }
            //     ]
            // },

            // {
            //     id: '6',
            //     title: 'Masking',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Masking',
            //             title: 'Masking',
            //             type: 'item',
            //             url: '/Masking',
            //             icon: 'feather icon-maximize',
            //         }
            //     ]
            // },

            // {
            //     id: '7',
            //     title: 'Voice Assist',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Voice Assist',
            //             title: 'Voice Assist',
            //             type: 'item',
            //             url: '/voiceAssist',
            //             icon: 'feather icon-mic',
            //         }
            //     ]
            // },

            // {
            //     id: '13',
            //     title: 'Multicam Playback',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Multicam Playback',
            //             title: 'Multicam Playback',
            //             type: 'item',
            //             url: '/Playback',
            //             icon: 'video',
            //         }
            //     ]
            // },
            // {
            //     id: '13',
            //     title: 'Playback',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Playback',
            //             title: 'Playback',
            //             type: 'item',
            //             url: '/PlayVideo',
            //             icon: 'video',
            //         }
            //     ]
            // },

            // {
            //     id: '14',
            //     title: 'Account',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'User Account',
            //             title: 'Account',
            //             type: 'item',
            //             url: '/Account',
            //             icon: 'user',
            //         }
            //     ]
            // },

            {
                id: '15',
                title: 'Logout',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Logout',
                        title: 'Logout',
                        type: 'item',
                        url: '/Login',
                        icon: 'log-out',
                    }
                ]
            },

        ]
    }
} else if (userData.position_type == 'Site Admin') {
    userobj = {
        items: [

            {
                id: '1',
                title: 'Live',
                type: 'group',
                icon: 'video',
                children: [
                    {
                        id: 'UserCreation',
                        title: 'Live',
                        type: 'item',
                        url: '/Home/Home',
                        icon: 'video',
                    }
                ]
            },

            {
                id: '2',
                title: 'Events and Analytics',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'EventsandAnalytics',
                        title: 'Events and Analytics',
                        type: 'item',
                        url: '/MotionEvents',
                        icon: 'film',
                    }
                ]
            },

            {
                id: '3',
                title: 'Alert Events',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'AlertEvents',
                        title: 'Alert Events',
                        type: 'item',
                        url: '/Alert',
                        icon: 'alert-circle',
                    }
                ]
            },

            {
                id: '4',
                title: 'Device Creations',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'DeviceCreations',
                        title: 'Device Creations',
                        type: 'item',
                        url: '/DeviceCreations/DeviceCreations',
                        icon: 'inbox',
                    }
                ]
            },

            // {
            //     id: '5',
            //     title: 'Attendance',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Attendance',
            //             title: 'Attendance',
            //             type: 'item',
            //             url: '/Attendance',
            //             icon: 'calendar',
            //         }
            //     ]
            // },

            {
                id: '6',
                title: 'People Analytics',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'People Analytics',
                        title: 'People Analytics',
                        type: 'item',
                        url: '/CustomerAnalytics',
                        icon: 'bar-chart',
                    }
                ]
            },

            // {
            //     id: '7',
            //     title: 'Vehicle Analytics',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Vehicle Analytics',
            //             title: 'Vehicle Analytics',
            //             type: 'item',
            //             url: '/VehicleAnalytics',
            //             icon: 'truck',
            //         }
            //     ]
            // },
            {
                id: '8',
                title: 'Queue Analytics',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Queue Analytics',
                        title: 'Queue Analytics',
                        type: 'item',
                        url: '/QueueAnalytics',
                        icon: 'users',
                    }
                ]
            },
            {
                id: '9',
                title: 'Heat Map',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Heat Map',
                        title: 'Heat Map',
                        type: 'item',
                        url: '/Heatmap',
                        icon: 'image',
                    }
                ]
            },

            // {
            //     id: '3',
            //     title: 'Group Creations',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'GroupCreations',
            //             title: 'Group Creations',
            //             type: 'item',
            //             url: '/GroupCreations/GroupCreations',
            //             icon: 'feather icon-trending-up',
            //         }
            //     ]
            // },

            {
                id: '10',
                title: 'Masking',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Masking',
                        title: 'Masking',
                        type: 'item',
                        url: '/Masking',
                        icon: 'edit-2',
                    }
                ]
            },

            // {
            //     id: '6',
            //     title: 'Voice Assist',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Voice Assist',
            //             title: 'Voice Assist',
            //             type: 'item',
            //             url: '/voiceAssist',
            //             icon: 'feather icon-mic',
            //         }
            //     ]
            // },

            {
                id: '11',
                title: 'Dashboard',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Dashboard',
                        title: 'Dashboard',
                        type: 'item',
                        url: '/Dashboard',
                        icon: 'trello',
                    }
                ]
            },

            {
                id: '12',
                title: 'User Creation',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'User Creation',
                        title: 'User Creation',
                        type: 'item',
                        url: '/UserCreations/UserCreations',
                        icon: 'user-plus',
                    }
                ]
            },

            {
                id: '13',
                title: 'Multicam Playback',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Multicam Playback',
                        title: 'Multicam Playback',
                        type: 'item',
                        url: '/Playback',
                        icon: 'video',
                    }
                ]
            },

            {
                id: '14',
                title: 'Account',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'User Account',
                        title: 'Account',
                        type: 'item',
                        url: '/Account',
                        icon: 'user',
                    }
                ]
            },

            {
                id: '15',
                title: 'Logout',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Logout',
                        title: 'Logout',
                        type: 'item',
                        url: '/Login',
                        icon: 'log-out',
                    }
                ]
            },


        ]
    }
} else {
    userobj = {
        items: [

            {
                id: '1',
                title: 'Live',
                type: 'group',
                icon: 'video',
                children: [
                    {
                        id: 'Live',
                        title: 'Live',
                        type: 'item',
                        url: '/Home/Home',
                        icon: 'video',
                    }
                ]
            },

            // {
            //     id: '2',
            //     title: 'Device Creations',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'DeviceCreations',
            //             title: 'Device Creations',
            //             type: 'item',
            //             url: '/DeviceCreations/DeviceCreations',
            //             icon: 'feather icon-trending-up',
            //         }
            //     ]
            // },

            // {
            //     id: '3',
            //     title: 'Group Creations',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'GroupCreations',
            //             title: 'Group Creations',
            //             type: 'item',
            //             url: '/GroupCreations/GroupCreations',
            //             icon: 'feather icon-trending-up',
            //         }
            //     ]
            // },

            {
                id: '2',
                title: 'Events and Analytics',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'EventsandAnalytics',
                        title: 'Events and Analytics',
                        type: 'item',
                        url: '/MotionEvents',
                        icon: 'film',
                    }
                ]
            },

            {
                id: '3',
                title: 'Alert Events',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'AlertEvents',
                        title: 'Alert Events',
                        type: 'item',
                        url: '/Alert',
                        icon: 'alert-circle',
                    }
                ]
            },

            // {
            //     id: '4',
            //     title: 'Attendance',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Attendance',
            //             title: 'Attendance',
            //             type: 'item',
            //             url: '/Attendance',
            //             icon: 'calendar',
            //         }
            //     ]
            // },

            {
                id: '5',
                title: 'People Analytics',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'People Analytics',
                        title: 'People Analytics',
                        type: 'item',
                        url: '/CustomerAnalytics',
                        icon: 'bar-chart',
                    }
                ]
            },

            // {
            //     id: '6',
            //     title: 'Vehicle Analytics',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Vehicle Analytics',
            //             title: 'Vehicle Analytics',
            //             type: 'item',
            //             url: '/VehicleAnalytics',
            //             icon: 'truck',
            //         }
            //     ]
            // },
            {
                id: '7',
                title: 'Queue Analytics',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Queue Analytics',
                        title: 'Queue Analytics',
                        type: 'item',
                        url: '/QueueAnalytics',
                        icon: 'users',
                    }
                ]
            },
            {
                id: '8',
                title: 'Heat Map',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Heat Map',
                        title: 'Heat Map',
                        type: 'item',
                        url: '/Heatmap',
                        icon: 'image',
                    }
                ]
            },

            // {
            //     id: '5',
            //     title: 'Masking',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Masking',
            //             title: 'Masking',
            //             type: 'item',
            //             url: '/Masking',
            //             icon: 'feather icon-maximize',
            //         }
            //     ]
            // },

            // {
            //     id: '6',
            //     title: 'Voice Assist',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'Voice Assist',
            //             title: 'Voice Assist',
            //             type: 'item',
            //             url: '/voiceAssist',
            //             icon: 'feather icon-mic',
            //         }
            //     ]
            // },

            {
                id: '9',
                title: 'Dashboard',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Dashboard',
                        title: 'Dashboard',
                        type: 'item',
                        url: '/Dashboard',
                        icon: 'trello',
                    }
                ]
            },

            // {
            //     id: '8',
            //     title: 'User Creation',
            //     type: 'group',
            //     icon: 'icon-navigation',
            //     children: [
            //         {
            //             id: 'User Creation',
            //             title: 'User Creation',
            //             type: 'item',
            //             url: '/UserCreations/UserCreations',
            //             icon: 'feather icon-power',
            //         }
            //     ]
            // },

            {
                id: '10',
                title: 'Multicam Playback',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Multicam Playback',
                        title: 'Multicam Playback',
                        type: 'item',
                        url: '/Playback',
                        icon: 'video',
                    }
                ]
            },

            {
                id: '11',
                title: 'Account',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'UserAccount',
                        title: 'Account',
                        type: 'item',
                        url: '/Account',
                        icon: 'user',
                    }
                ]
            },

            {
                id: '12',
                title: 'Logout',
                type: 'group',
                icon: 'icon-navigation',
                children: [
                    {
                        id: 'Logout',
                        title: 'Logout',
                        type: 'item',
                        url: '/Login',
                        icon: 'log-out',
                    }
                ]
            },

        ]
    }
}

export default userobj