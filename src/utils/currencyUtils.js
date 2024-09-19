export const shortHandFormat = (value) => {
  if (Math.abs(value) > 999999999) {
    return Math.abs(value)/1000000000 + 'B'
  } else if (Math.abs(value) > 999999) {
    return Math.abs(value)/1000000 + 'M'
  } else if (Math.abs(value) > 999) {
    return Math.abs(value)/1000 + 'K'
  }
  return value;
}

export const formatVNDCurrency = (value) => {
  const result = Number(value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'VND'
  })
  return result
}

export const getPriceAfterDiscount = (oldPrice, discount) => {
  const newPrice = oldPrice * (100 - discount) / 100;
  return newPrice;
}