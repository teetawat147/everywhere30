const validate = (config, e) => {
  const name = (typeof e.target !== 'undefined') ? e.target.name : e.key;
  const value = (typeof e.target !== 'undefined') ? e.target.value : e.val;
  let updateForm = { ...config.formElements };
  if (typeof updateForm[name] !== 'undefined') {
    if (typeof updateForm[name].validator !== 'undefined') {
      const validatorObject = checkValidator(value, updateForm[name].validator);
      updateForm[name].error = {
        status: validatorObject.status,
        message: validatorObject.message
      }
      let formStatus = true;
      for (let name in updateForm) {
        if (updateForm[name].validator.required === true) {
          formStatus = (!updateForm[name].error.status) ? formStatus : false;
        }
      }
      return { formElements: updateForm, formValid: formStatus };
    } else {
      console.log('Object not set validator yet.');
    }
  }
}
const checkValidator = (value, rule) => {
  let valid = true;
  let message = '';
  // ห้ามว่าง
  if (rule.required) {
    if (typeof value === 'object') {
      value = value.hos_fullname;
      if (Object.keys(value).length === 0) {
        valid = false;
        message = 'กรุณาเลือกข้อมูล';
      }
    } else {
      if (value.trim().length === 0) {
        valid = false;
        message = 'กรุณากรอกข้อมูล';
      }
    }
  }
  // ตัวเลขเท่านั้น
  if (typeof rule.number !== 'undefined' && valid) {
    if (/^[0-9]+$/.test(value) === false) {
      valid = false;
      message = `ตัวเลขเท่านั้น`;
    }
  }
  // ความยาวเท่ากับ
  if (typeof rule.stringLength !== 'undefined' && value.length !== rule.stringLength && valid) {
    valid = false;
    message = `ความยาว ${rule.stringLength} ตัวอักษร`;
  }
  // ความยาวอย่างน้อย
  if (typeof rule.minLength !== 'undefined' && value.length < rule.minLength && valid) {
    valid = false;
    message = `กรุณากรอกข้อมูลอย่างน้อย ${rule.minLength} ตัวอักษร`;
  }
  // ความยาวไม่มากกว่า
  if (typeof rule.maxLength !== 'undefined' && value.length > rule.maxLength && valid) {
    valid = false;
    message = `กรุณากรอกข้อมูลไม่เกิน ${rule.maxLength} ตัวอักษร`;
  }
  // รูปแบบอีเมลล์
  if (typeof rule.pattern !== 'undefined' && rule.pattern === 'email' && valid) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) === false) {
      valid = false;
      message = `อีเมลล์ไม่ถูกต้อง`;
    }
  }
  // รูปแบบบัตรประชาชน
  if (typeof rule.pattern !== 'undefined' && rule.pattern === 'mod13' && valid) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(value.charAt(i)) * (13 - i);
    }
    if ((11 - sum % 11) % 10 !== parseInt(value.charAt(12))) {
      valid = false;
      message = `หมายเลขบัตรประชาชนไม่ถูกต้อง`;
    }
  }
  return { status: !valid, message: message };
}

export default validate;
