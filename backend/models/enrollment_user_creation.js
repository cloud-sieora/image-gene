const cuid = require('cuid')
const db = require('../db')
const AWS = require('aws-sdk');
const client_user = require('./users_creation')
const encoding_data = require('./tentovision_encoding_creation')
const moment = require('moment')


const User = db.model('enrollment_users_creation', {
    _id: { type: String, default: cuid },
    user_id: { type: String, required: true },
    user_name: { type: String, required: true },
    mobile_number: { type: String, required: true },
    list_type: { type: String, required: true },
    mail: { type: String, required: true },
    image_url: { type: Array, required: false, default: [] },
    site_id: { type: String, require: true },
    created_date: { type: String, required: true },
    created_time: { type: String, required: true },
    updated_date: { type: String, required: true },
    updated_time: { type: String, required: true },
    gender: { type: String, required: true },
    enroll_mode: { type: String, required: true },
    embedding_id: { type: Array, required: true },
    embedding_count: { type: Number, default: 0 },
    clientt_id: { type: String, default: 'None' },
    client_admin_id: { type: String, default: 'None' },

})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    add_new_column,
    remove_new_column,
    list_by_user_id,
    list_by_site_id,
    list_user_id,
    edit_orginal,
    list_client_id,
    update_embeding_count,
    model: User
}

async function add_new_column() {
    const user = await User.updateMany({}, { $set: { "enrollment_flag": false } })
    return user
}
async function remove_new_column() {
    const user = await User.updateMany({}, { $unset: { "currentcy": 1 } })
    return user
}
async function list() {
    const user = await User.find({})
    return user
}

async function list_user_id(id, emp) {
    const user = await User.find({ clientt_id: id, user_id: emp })
    return user
}

async function list_client_id(id, emp) {
    const user = await User.find({ clientt_id: id })
    return user
}

async function list_by_site_id(id) {
    const user = await User.find({ attendance_group_id: id })
    return user
}

async function list_by_user_id(id) {
    const user = await User.find({ user_id: id })
    return user
}



async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function update_embeding_count(user_id, embedding_count ) {
    const product = await User.findOne({ user_id: user_id })
    console.log(product);

    if (product != null) {
        const product1 =await edit_orginal(product._id, { embedding_count: embedding_count })
        return product1
    }else{
        return 'no emp id match'
    }
}

async function create(fields) {
    const product = await new User(fields).save()
    return { success: true, msg: '', data: product }

}

// async function create(fields) {
//     const user = await User.find({ clientt_id: fields.clientt_id })
//     const user_details = await client_user.model.findById(fields.clientt_id)
//     fields = { ...fields, rek_id: `${Date.now()}` }

//     if (user_details.attendance_count > user.length && moment(new Date(), 'YYYY-MM-DD').isSameOrBefore(moment(user_details.plan_end_date, 'YYYY-MM-DD'))) {
//         AWS.config.update({
//             accessKeyId: process.env.AWS_ACCESS_KEY,
//             secretAccessKey: process.env.AWS_SECRET_KEY,
//             region: "ap-south-1"
//         });

//         const s3 = new AWS.S3();
//         const bucketName = process.env.AWS_BUCKET_NAME;
//         const store_face = []



//         AWS.config.update({ region: 'ap-south-1' }); // Replace with your desired AWS region

//         const rekognition = new AWS.Rekognition();

//         let not_face = []
//         let count = 0

//         const params = {
//             CollectionId: fields.clientt_id,
//         };

//         let flag = false

//         try {
//             const chk_cll = await rekognition.describeCollection(params).promise()
//             flag = true
//         } catch (err) {
//             flag = false
//         }

//         if (!flag) {
//             try {
//                 const data = await rekognition.createCollection(params).promise();
//                 console.log("Collection created successfully:", data.CollectionArn);
//                 try {
//                     const user = await rekognition.createUser({ CollectionId: fields.clientt_id, UserId: fields.rek_id }).promise();
//                 } catch (err) {
//                     console.log('error');
//                 }

//                 for (let index = 0; index < fields.image_url.length; index++) {
//                     const face = await rekognition.indexFaces({
//                         CollectionId: fields.clientt_id,
//                         Image: { 'S3Object': { 'Bucket': bucketName, 'Name': fields.image_url[index] } },
//                         ExternalImageId: fields.image_url[index],
//                         MaxFaces: 1,
//                         QualityFilter: "AUTO",
//                         DetectionAttributes: ['ALL']
//                     }).promise();

//                     if (face.FaceRecords.length !== 0) {
//                         store_face.push(face.FaceRecords[0].Face.FaceId)
//                     } else {
//                         not_face.push(fields.image_url[index])
//                         count = count + 1

//                         if (count == fields.image_url.length) {
//                             not_face.map((val) => {
//                                 const params = {
//                                     Bucket: process.env.AWS_BUCKET_NAME,
//                                     Key: val
//                                 };

//                                 s3.deleteObject(params, async (error, data) => {
//                                     if (error) {
//                                         count = count + 1
//                                         console.log('error file delete in s3');
//                                     } else {
//                                         count = count + 1
//                                         console.log("File has been deleted successfully");
//                                     }
//                                 });
//                             })
//                         }
//                     }
//                 }

//                 const assosiate_face = await rekognition.associateFaces({ CollectionId: fields.clientt_id, UserId: fields.rek_id, FaceIds: store_face }).promise();

//                 const product = await new User(fields).save()
//                 console.log(product);
//                 return { success: true, msg: '', data: product }

//             } catch (err) {
//                 console.error("Error creating collection:", err);
//             }
//         } else {
//             try {
//                 const user = await rekognition.createUser({ CollectionId: fields.clientt_id, UserId: fields.rek_id }).promise();
//             } catch (err) {
//                 console.log('error');
//             }

//             try {
//                 for (let index = 0; index < fields.image_url.length; index++) {
//                     const face = await rekognition.indexFaces({
//                         CollectionId: fields.clientt_id,
//                         Image: { 'S3Object': { 'Bucket': bucketName, 'Name': fields.image_url[index] } },
//                         ExternalImageId: fields.image_url[index],
//                         MaxFaces: 1,
//                         QualityFilter: "AUTO",
//                         DetectionAttributes: ['ALL']
//                     }).promise();

//                     if (face.FaceRecords.length !== 0) {
//                         store_face.push(face.FaceRecords[0].Face.FaceId)
//                         count = count + 1
//                     } else {
//                         not_face.push(fields.image_url[index])
//                         count = count + 1

//                         if (count == fields.image_url.length) {
//                             not_face.map((val) => {
//                                 const params = {
//                                     Bucket: process.env.AWS_BUCKET_NAME,
//                                     Key: val
//                                 };

//                                 s3.deleteObject(params, async (error, data) => {
//                                     if (error) {
//                                         count = count + 1
//                                         console.log('error file delete in s3');
//                                     } else {
//                                         count = count + 1
//                                         console.log("File has been deleted successfully");
//                                     }
//                                 });
//                             })
//                         }
//                     }
//                 }
//             } catch (err) {
//                 console.log('error', err);
//             }

//             if (store_face.length != 0) {
//                 const assosiate_face = await rekognition.associateFaces({ CollectionId: fields.clientt_id, UserId: fields.rek_id, FaceIds: store_face }).promise();
//                 const product = await new User(fields).save()


//                 if (not_face.length != 0) {
//                     return { success: false, msg: fields.user_name }
//                 } else {
//                     return { success: true, msg: '', data: product }
//                 }
//             } else {
//                 return { success: false, msg: fields.user_name }
//             }
//         }
//     } else {
//         // return { success: false, msg: 'Not Eligibal' }
//     }

// }

async function edit_orginal(_id, change) {
    const product = await get({ _id })

    Object.keys(change).forEach(function (key) {
        product[key] = change[key]
    })
    await product.save()
    return { status: true, data: product }
}

async function edit(_id, change) {
    const product = await get({ _id })

    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: "ap-south-1"
    });

    const s3 = new AWS.S3();
    const bucketName = process.env.AWS_BUCKET_NAME;
    const store_face = []



    AWS.config.update({ region: 'ap-south-1' }); // Replace with your desired AWS region
    const rekognition = new AWS.Rekognition();

    let not_face = []
    let valid_face = []
    let count1 = 0


    try {
        for (let index = 0; index < change.image_url.length; index++) {
            const face = await rekognition.indexFaces({
                CollectionId: change.clientt_id,
                Image: { 'S3Object': { 'Bucket': bucketName, 'Name': change.image_url[index] } },
                ExternalImageId: change.image_url[index],
                MaxFaces: 1,
                QualityFilter: "AUTO",
                DetectionAttributes: ['ALL']
            }).promise();

            if (face.FaceRecords.length !== 0) {
                store_face.push(face.FaceRecords[0].Face.FaceId)
                valid_face.push(change.image_url[index])
                count1 = count1 + 1
            } else {
                not_face.push(change.image_url[index])
                count1 = count1 + 1
                if (count1 == change.image_url.length) {
                    not_face.map((val) => {
                        const params = {
                            Bucket: process.env.AWS_BUCKET_NAME,
                            Key: val
                        };

                        s3.deleteObject(params, async (error, data) => {
                            if (error) {
                                console.log('error file delete in s3');
                            } else {
                                console.log("File has been deleted successfully");
                            }
                        });
                    })
                }
            }
        }
    } catch (e) {
        console.log(e);
    }

    change.image_url = valid_face
    console.log(not_face);

    if (store_face != 0) {
        const assosiate_face = await rekognition.associateFaces({ CollectionId: change.clientt_id, UserId: product.rek_id, FaceIds: store_face }).promise();

        Object.keys(change).forEach(function (key) {
            product[key] = change[key]
        })
        await product.save()
        if (not_face.length != 0) {
            console.log({ success: false, msg: change.user_name });
            return { success: false, msg: change.user_name }
        } else {
            return { success: true, data: product }
        }
    } else {
        console.log('else');
        return { success: false, msg: change.user_name }
    }
    // let data = await User.find({ mail: change.mail, client_id: change.client_id })
    // let filter = data.filter((val) => product._id === val._id)

    // if (filter.length !== 0) {
    //   Object.keys(change).forEach(function (key) {
    //     product[key] = change[key]
    //   })
    //   await product.save()
    //   return { status: true, data: product }
    // } else {
    //   return { status: false }
    // }
}

async function remove(_id) {
    const product = await get({ _id })
    const encoding = await encoding_data.list_user_id(product._id)

    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: "ap-south-1"
    });

    const s3 = new AWS.S3();
    const bucketName = process.env.AWS_BUCKET_NAME;
    const store_face = []

    if (product.image_url.length != 0) {

        AWS.config.update({ region: 'ap-south-1' }); // Replace with your desired AWS region

        const rekognition = new AWS.Rekognition();

        try {
            const user = await rekognition.deleteUser({ CollectionId: product.clientt_id, UserId: product.rek_id }).promise();
        } catch (err) {
            console.log('error');
        }

        let count = 0

        product.image_url.map((val) => {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: val
            };

            s3.deleteObject(params, async (error, data) => {
                if (error) {
                    count = count + 1
                    console.log('error file delete in s3');
                } else {
                    count = count + 1
                    console.log("File has been deleted successfully");
                }

                if (count == product.image_url.length) {
                    await User.deleteOne({ _id })
                    if (encoding != null) {
                        await encoding_data.remove(encoding._id)
                    }
                    return { success: true }
                }
            });
        })
    } else {
        await User.deleteOne({ _id })
        if (encoding != null) {
            await encoding_data.remove(encoding._id)
        }
        return { success: true }
    }
}



