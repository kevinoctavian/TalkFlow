export function convertDate2Timestamp(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth().toString().padStart(2, "0");
  const date1 = date.getDate().toString().padStart(2, "0");

  const hours = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${date1} ${hours}:${minute}:${second}`;
}
