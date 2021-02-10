import { getYear, getMonth, getDate } from "date-fns";

const dateThaiShort = (d) => {
  let r = d;
  // console.log(d);
  if (d && typeof d != "undefined") {
    r =
      parseInt(getDate(new Date(d))).toString() +
      " " +
      thaiMonth(parseInt(getMonth(new Date(d))) + 1, "short") +
      " " +
      (parseInt(getYear(new Date(d))) + 543).toString();
  } else {
    r = "-";
  }
  return r;
};

const thaiMonth = (m, z) => {
  let x = parseInt(m);
  let r = m;
  if (z === "short") {
    switch (x) {
      case 1:
        r = "ม.ค.";
        break;
      case 2:
        r = "ก.พ.";
        break;
      case 3:
        r = "มี.ค.";
        break;
      case 4:
        r = "เม.ย.";
        break;
      case 5:
        r = "พ.ค.";
        break;
      case 6:
        r = "มิ.ย.";
        break;
      case 7:
        r = "ส.ค.";
        break;
      case 8:
        r = "ก.ค.";
        break;
      case 9:
        r = "ก.ย.";
        break;
      case 10:
        r = "ต.ค.";
        break;
      case 11:
        r = "พ.ย.";
        break;
      case 12:
        r = "ธ.ค.";
        break;
      default:
        r = "";
        break;
    }
  }
  if (z === "long") {
    switch (x) {
      case 1:
        r = "มกราคม";
        break;
      case 2:
        r = "กุมภาพันธ์";
        break;
      case 3:
        r = "มีนาคม";
        break;
      case 4:
        r = "เมษายน";
        break;
      case 5:
        r = "พฤษภาคม";
        break;
      case 6:
        r = "มิถุนายน";
        break;
      case 7:
        r = "สิงหาคม";
        break;
      case 8:
        r = "กรกฎาคม";
        break;
      case 9:
        r = "กันยายน";
        break;
      case 10:
        r = "ตุลาคม";
        break;
      case 11:
        r = "พฤศจิกายน";
        break;
      case 12:
        r = "ธันวาคม";
        break;
      default:
        r = "";
        break;
    }
  }
  return r;
};

const calcAge = (dateBirth) => {
  const now = new Date();

  const yearNow = now.getFullYear();
  const monthNow = now.getMonth();
  const dateNow = now.getDate();

  const dob = new Date(dateBirth);

  const yearDob = dob.getFullYear();
  const monthDob = dob.getMonth();
  const dateDob = dob.getDate();

  let yearAge = yearNow - yearDob;
  let monthAge;

  if (monthNow >= monthDob) {
      monthAge = monthNow - monthDob;
  } else {
      yearAge--;
      monthAge = 12 + monthNow - monthDob;
  }

  let dateAge;
  if (dateNow >= dateDob) {
      dateAge = dateNow - dateDob;
  } else {
      monthAge--;
      dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
          monthAge = 11;
          yearAge--;
      }
  }

  const age = {
      years: yearAge,
      months: monthAge,
      days: dateAge
  };

  const yearString = (age.years > 1) ? "ปี" : "ปี";
  const monthString = (age.months > 1) ? "เดือน" : "เดือน";
  const dayString = (age.days > 1) ? "วัน" : "วัน";

  let ageString = "";

  if ((age.years > 0) && (age.months > 0) && (age.days > 0)) {
      // ageString = age.years + yearString + " " + age.months + monthString + " กับ " + age.days + dayString ;
      ageString = age.years + yearString + " " + age.months + monthString  ;
  } else if ((age.years === 0) && (age.months === 0) && (age.days > 0)) {
      ageString = age.days + dayString ;
  } else if ((age.years > 0) && (age.months === 0) && (age.days === 0)) {
      ageString = age.years + yearString ;
  } else if ((age.years > 0) && (age.months > 0) && (age.days === 0)) {
      ageString = age.years + yearString + " กับ " + age.months + monthString ;
  } else if ((age.years === 0) && (age.months > 0) && (age.days > 0)) {
      // ageString = age.months + monthString + " กับ " + age.days + dayString ;
      ageString = age.months + monthString ;
  } else if ((age.years > 0) && (age.months === 0) && (age.days > 0)) {
      // ageString = age.years + yearString + " กับ " + age.days + dayString ;
      ageString = age.years + yearString ;
  } else if ((age.years === 0) && (age.months > 0) && (age.days === 0)) {
      ageString = age.months + monthString ;
  } else {
      ageString = "-";
  }

  return ageString;
};

const thaiXSDate = (x) => {
  let r=x;
  if (typeof x != 'undefined') {
    let z=r.toString().split('-');
    r=z[2]+'/'+z[1]+'/'+(parseInt(z[0])+543).toString();
  }
  return r;
}

export {
  dateThaiShort,
  calcAge,
  thaiXSDate
};
