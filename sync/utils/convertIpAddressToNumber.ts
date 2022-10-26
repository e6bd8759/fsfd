export const convertIpAddressToNumber = (ip: string) =>
    ip.split('.').reduce((ipInt, octet) => (ipInt << 8) + parseInt(octet, 10), 0) >>> 0;
