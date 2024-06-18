export function clearTranscriptionItems(items) {
  items.forEach((item, key) => {
    if (!item.start_time) {
      const prev = items[key - 1]
      prev.alternatives[0].content += item.alternatives[0].content;
      delete items[key];
    }
  })

  return items.map((item) => {
    const start_time = item.start_time;
    const end_time = item.end_time;
    const content = item.alternatives[0].content;
    return { start_time, end_time, content }
  })
}


export function convertToSRT(items) {
  return items
    .filter(item => item && item.start_time && item.end_time && item.content) // filter out invalid items
    .map((item, index) => {
      const number = index + 1;
      const start_time = secondsToHms(item.start_time);
      const end_time = secondsToHms(item.end_time);
      const content = item.content;
      return `${number}\n${start_time} --> ${end_time}\n${content}\n\n`
    }).join('')
}


function secondsToHms(d) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor(d % 3600 / 60);
  const s = Math.floor(d % 3600 % 60);
  const ms = (d % 1).toFixed(3).slice(2, 5);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms}`;
}
