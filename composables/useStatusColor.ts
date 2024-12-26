export const useStatusColor = (status: string) => {
  if (status == "จอง") return "#9E9E9E";
  if (status == "รับเงินจอง") return "#2096F3";
  if (status == "รับรถ") return "#FB8C00";
  if (status == "คืนรถ") return "#8D6E63";
  if (status == "คืนมัดจำ") return "#4CAF4F";
  if (status == "ยกเลิก") return "#FF0000";
};
