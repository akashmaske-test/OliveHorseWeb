export function telHref(phone = "") {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(phone = "") {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

export function addressText(address) {
  return [
    address.academy,
    address.line1,
    address.line2,
    address.area,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
