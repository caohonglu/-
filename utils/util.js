const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}




const countdown = date => {
  let timestamp = parseInt((date * 1000 - new Date().getTime()) / 1000)
  let hour = parseInt(timestamp / 3600).toString().padStart(2, 0)
  let minute = parseInt(timestamp % 3600 / 60).toString().padStart(2, 0)
  let second = parseInt(timestamp % 60).toString().padStart(2, 0)
  return `${hour}:${minute}:${second}`
}
const countdownDay = date => {
  let timestamp = parseInt((date * 1000 - new Date().getTime()) / 1000)
  let day = parseInt(timestamp / (24 * 3600 * 1000)).toString().padStart(2, 0)
  let hour = parseInt(timestamp / 3600 % 24).toString().padStart(2, 0)
  let minute = parseInt(timestamp % 3600 / 60).toString().padStart(2, 0)
  let second = parseInt(timestamp % 60).toString().padStart(2, 0)
  return `${day}天${hour}时${minute}分${second}秒`
}
module.exports = {
  formatTime: formatTime,
  countdown: countdown,
  countdownDay
}
