import IPCIDR from "ip-cidr";

export const getRange = (ipAddress: string) => {
  const cidr = new IPCIDR(ipAddress);
  return [cidr.start(), cidr.end()];
};
