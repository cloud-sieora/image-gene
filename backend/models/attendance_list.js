const cuid = require('cuid')
const db = require('../db')

const User = db.model('attendance_list', {
    _id: { type: String, default: cuid },
    user_id: { type: String, required: true },
    user_name: { type: String, required: true },
    emp_id: { type: String, required: true },
    site_id: { type: String, required: true },
    in_time: { type: String, required: true },
    out_time: { type: String, required: true },
    post_type: { type: String, required: false, default: 'Automatic' },
    date: { type: String, required: true },
})

module.exports = {
    get,
    list,
    create,
    edit,
    remove,
    get2,
    list_by_user_id,
    list_by_site_id,
    list_by_user_id_date,
    list_by_site_id_date,
    create_mobile,
    list_by_user_id_date,
    list_by_user_id_date_time,
    list_by_user_id_date_time_present,
    model: User
}

async function list(id) {
    const user = await User.find({ user_id: id })
    return user
}

async function list_by_user_id(id) {
    const user = await User.find({ user_id: id })
    return user
}

async function list_by_user_id_date(id, date) {
    const user = await User.find({ user_id: id, date: date })
    return user
}

async function list_by_site_id(id) {
    const user = await User.find({ site_id: id })
    return user
}

async function list_by_site_id_date(id, startDate, endDate) {
    const user = await User.find({ site_id: id, date: { $gte: startDate, $lte: endDate } })
    return user
}

async function list_by_user_id_date_time(id, startDate, endDate) {
    const user = await User.find({ user_id: id, date: { $gte: startDate, $lte: endDate } })
    return user
}

async function list_by_user_id_date_time_present(id, startDate, endDate) {
    const user = await User.find({ user_id: id, date: { $gte: startDate, $lte: endDate } })
    return { present: user.length }
}



async function get(_id) {
    const product = await User.findById(_id)
    return product
}

async function get2(id2) {
    const user = await User.find({ site_name: id2 })
    if (user.length == 0) {
        return { success: false }
    }
    else {
        return { success: true, data: user }
    }
}

async function create(fields) {

    const user = await User.findOne({ user_id: fields.user_id, date: { $gte: fields.date, $lte: fields.date } })
    console.log(user)

    if (user == null) {
        const product = await new User(fields).save()
        
        return product
    } else {
        await edit(user._id, { ...fields, out_time: fields.out_time })
        return { success: true }
    }
}

async function create_mobile(fields) {
    try {
        const user = await User.findOne({ user_id: fields.user_id, date: fields.date });

        if (user == null) {
            const newUser = await new User(fields).save();
            return { success: true, data: newUser };
        } else {
            const updatedUser = await User.findOneAndUpdate(
                { user_id: fields.user_id, date: fields.date },
                { $set: { out_time: fields.out_time } },
                { new: true }
            );
            return { success: true, data: updatedUser };
        }
    } catch (error) {
        console.error('Error in create_mobile:', error);
        return { success: false, message: 'An error occurred' };
    }
}




async function edit(_id, change) {

    const isDataFound = await User.findOne({_id})
    if(!isDataFound){
        return {status : false, data : 'Not found'}
    }

    const updatedData = await User.findOneAndUpdate({_id}, {$set : change}, {new : true})
    if(updatedData){
        return {status : true, data : updatedData}
    }
    else{
        return {status : false, data : 'Error While updating data'}
    }
}


async function remove(_id) {
    await User.deleteOne({ _id })

} 
