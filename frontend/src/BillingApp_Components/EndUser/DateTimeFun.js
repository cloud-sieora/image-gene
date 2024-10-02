export const date = () => {
    let currentDate = new Date()
    let date = currentDate.getDate()
    date = date <= 9 ? `0${date}` : date
    let month = currentDate.getMonth()
    month = month <= 9 ? `0${month + 1}` : month + 1
    let year = currentDate.getFullYear()

    let hour = currentDate.getHours()
    hour = hour <= 9 ? `0${hour}` : hour
    let minute = currentDate.getMinutes()
    minute = minute <= 9 ? `0${minute}` : minute

    let endDate = `${year}-${month}-${date}`
    let startDate = `${year}-${month}-${date}`

    return [startDate,endDate,hour,minute]
}