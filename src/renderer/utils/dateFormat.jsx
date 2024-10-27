function dateFormat(dateStr) {
  const formatterCN = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  const date = new Date(dateStr)
  return formatterCN.format(date).toString().replaceAll('/', '-')
}

export default dateFormat
