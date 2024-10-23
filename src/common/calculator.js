function padStart(str, length, char) {
  let n = length
  while (n > 0) {
    str = `${char}` + str
    n--
  }
  return str
}

function padEnd(str, length, char) {
  let n = length
  while (n > 0) {
    str += `${char}`
    n--
  }
  return str
}

/**
  console.assert(divide(10, 2) === 5, "整数除法失败");
  console.assert(divide(3.14, 2).toFixed(2) == 1.57, "小数除法失败");
  console.assert(divide(7, 1) === 7, "除数为1失败");
  console.assert(divide(0, 5) === 0, "被除数为0失败");
  console.assert(divide(1000000, 0.1) === 10000000, "大数除法失败");
  console.assert(divide(-15, 3) === -5, "负数除法失败");
  console.assert(divide(0.1, 0.3).toFixed(2) == 0.33, "小数除法失败");
  console.assert(divide(1, 0.1) === 10, "整数除以小数失败");
  console.assert(divide(Number.MAX_SAFE_INTEGER, 2) === 4503599627370495.5, "大数除法失败");
  console.assert(isNaN(divide(NaN, 5)), "NaN 处理失败");
  console.assert(!isFinite(divide(1, 0)), "除以零处理失败");
  console.assert(divide(1.23456, 2.1).toFixed(4) === '0.5879', "不同精度小数相除失败");
  console.assert(divide('3.14159265359', '1.41421356237').toFixed(6) === '2.221441', "多位小数除法失败");
  console.assert(divide(1e5, 1e-5) === 1e10, "科学计数法表示的数相除失败");
  console.assert(divide('10', '3') === 3.3333333333333335, "字符串形式的数字输入失败");
  console.assert(divide(-15, 4) === -3.75, "正负数混合运算失败");
  console.assert(divide(1e-6, 1e-9) === 1000, "非常小的数除法失败");
 */
function divide(num1, num2) {
  let n1 = `${Number(num1)}`
  let n2 = `${Number(num2)}`
  const [n1Integer, n1Decimal = ''] = n1.split('.')
  const [n2Integer, n2Decimal = ''] = n2.split('.')
  const n1DecimalLength = n1Decimal.length
  const n2DecimalLength = n2Decimal.length
  if (n1DecimalLength === 0 && n2DecimalLength === 0) {
    console.log(`${num1} / ${num2} = ${Number(n1) / Number(n2)}`)
    return Number(n1) / Number(n2)
  }

  n1 = n1Integer + n1Decimal
  n2 = n2Integer + n2Decimal

  if (n1DecimalLength > n2DecimalLength) {
    n2 = padEnd(n2, n1DecimalLength - n2DecimalLength, '0')
  }
  if (n1DecimalLength < n2DecimalLength) {
    n1 = padEnd(n1, n2DecimalLength - n1DecimalLength, '0')
  }

  let result = Number(n1) / Number(n2)

  console.log(`${num1} / ${num2} = ${result}`)

  return result
}

/**
  console.assert(multiply(2, 3) === 6, "整数乘法失败");
  console.assert(multiply(1.5, 2) === 3, "小数乘以整数失败");
  console.assert(multiply(0.1, 0.2).toFixed(2) === "0.02", "小数乘法精度问题");
  console.assert(multiply(1000, 1000) === 1000000, "大数乘法失败");
  console.assert(multiply(-5, 3) === -15, "负数乘法失败");
  console.assert(multiply(-0.5, 0.03) === -0.015, "负数乘法失败");
  console.assert(multiply(0, 100) === 0, "零乘法失败");
  console.assert(multiply(0.1, 0.1) === 0.01, "小数精确乘法失败");
  console.assert(multiply(9.9, 9.9) === 98.01, "两位小数乘法失败");
  console.assert(multiply(0.0001, 10000) === 1, "极小数与大数乘法失败");
  console.assert(multiply('3.14', '2.0') === 6.28, "字符串数字输入失败");
 */
function multiply(num1, num2) {
  let n1 = `${Number(num1)}`
  let n2 = `${Number(num2)}`
  const [n1Integer, n1Decimal = ''] = n1.split('.')
  const [n2Integer, n2Decimal = ''] = n2.split('.')
  const n1DecimalLength = n1Decimal.length
  const n2DecimalLength = n2Decimal.length
  if (n1DecimalLength === 0 && n2DecimalLength === 0) {
    console.log(`${num1} * ${num2} = ${Number(n1) * Number(n2)}`)
    return Number(n1) * Number(n2)
  }

  n1 = n1Integer + n1Decimal
  n2 = n2Integer + n2Decimal

  let result = Number(n1) * Number(n2)
  result = `${result}`

  const prefix = result < 0 ? '-' : ''
  if (prefix) {
    result = result.slice(1)
  }

  const rate = n1DecimalLength + n2DecimalLength
  result = padStart(`${result}`, rate, '0')

  const integer = `${result}`.slice(0, -rate)
  const decimal = `${result}`.slice(-rate)

  result = integer + '.' + decimal

  console.log(`${num1} * ${num2} = ${Number(prefix + result)}`)

  return Number(prefix + result)
}

function add(num1, num2) {
  debugger
  let n1 = `${Number(num1)}`
  let n2 = `${Number(num2)}`
  const [n1Integer, n1Decimal = ''] = n1.split('.')
  const [n2Integer, n2Decimal = ''] = n2.split('.')
  const n1DecimalLength = n1Decimal.length
  const n2DecimalLength = n2Decimal.length
  if (n1DecimalLength === 0 && n2DecimalLength === 0) {
    console.log(`${num1} + ${num2} = ${Number(n1) + Number(n2)}`)
    return Number(n1) + Number(n2)
  }

  n1 = n1Integer + n1Decimal
  n2 = n2Integer + n2Decimal

  if (n1DecimalLength > n2DecimalLength) {
    n2 = padEnd(n2, n1DecimalLength - n2DecimalLength, '0')
  }
  if (n1DecimalLength < n2DecimalLength) {
    n1 = padEnd(n1, n2DecimalLength - n1DecimalLength, '0')
  }

  let result = Number(n1) + Number(n2)
  result = `${result}`
  const rate = Math.max(n1DecimalLength, n2DecimalLength)
  const prefix = result < 0 ? '-' : ''
  if (prefix) {
    result = result.slice(1)
  }
  const integer = `${result}`.slice(0, -rate)
  const decimal = `${result}`.slice(-rate)
  result = prefix + integer + '.' + decimal

  console.log(`${num1} + ${num2} = ${Number(result)}`)

  return Number(result)
}

export { divide, multiply, add }
