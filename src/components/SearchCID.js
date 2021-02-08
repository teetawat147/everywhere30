// import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from 'react';
import {
  makeStyles
} from '@material-ui/core/styles';
// npm install use-mediaquery --save

// import UDataTable from "./UniversalDataTable";
// import UCard from "./UniversalCard";
// import UListTable from "./UniversalListTable";

import UAPI from "../services/UniversalAPI";
import BoxAssessment from "./BoxAssessment";
import BoxDiagnosis from "./BoxDiagnosis";
import BoxTreatment from "./BoxTreatment";
import BoxServiceInfo from "./BoxServiceInfo";

import {
InputAdornment,
OutlinedInput,
Button,
TextField,
} from '@material-ui/core';

import { MdSearch } from 'react-icons/md';
import { ToggleOn } from '@material-ui/icons';


const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  helperText: {
    color: 'red'
  },
  contentGroup:{
    display: 'inline',
  },
  contentTitle: {
    display: 'inline',
    backgroundColor: '#CDEDFF',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 5
  },
  contentText: {
    display: 'inline',
    marginRight: 10
  },
  linkDateServ: {
    cursor: 'pointer',
    '&:hover': {
      background: "#E5E5E5",
    },
  },
});

export default function App(props) {
  /// icon 
  /// validation --- รับได้เฉพาะ ตัวเลข / สตริง
  /// แยกส่วน api ออกไป โยนข้อมูล จาก api เข้ามาใน app ทีนี้จะเป็น nested หรือไม่ก็เป็นไร เพราะมาจะมาเป็น json 
  /// ไปเอา table จาก material ui มาใช้นะ / ดูแล้วจะสะดวกกว่า 
  const collection = {
    person_test: {
      collection_name: 'person_tests',
      title: 'ตาราง person_test',
      order_by: 'hn desc',
      create_document: true,
      update_document: true,
      delete_document: true,
      primary_key: 'id',
      query_string: '',
      rows_per_page: 10, // 10 20 30 40 50 60 70 80 90 100
      search_field:['cid','fname','lname'],
      fields: {
        cid: { show: true, title: 'CID', data_type: 'string', format: null, input_type: 'textbox', icon: 'MdFavorite', validation: 'number', value_length_type: 'fix', value_length_count: 13, value_length_min: null, value_length_max: null },
        hn: { show: true, title: 'HN', data_type: 'string', format: null, input_type: 'textbox', icon: 'MdFavorite', validation: 'number', value_length_min: null, value_length_max: null },
        fname: { show: true, title: 'ชื่อ', data_type: 'string', format: null, input_type: 'textbox', icon: 'MdDateRange', validation: 'string', value_length_type: 'range', value_length_count: null, value_length_min: 3, value_length_max: 5 },
        lname: { show: true, title: 'สกุล', data_type: 'string', format: null, input_type: 'textbox' },
        sex: { show: true, title: 'เพศ', data_type: 'string', format: null, input_type: 'select', input_select_source_type: 'json', input_select_source_name: 'sex', input_select_source_json: [{ sex_id: 1, sex_name: 'ชาย' }, { sex_id: 2, sex_name: 'หญิง' }], input_select_source_key: 'sex_id', input_select_source_value: 'sex_name' },
        birthday: { show: true, title: 'วันเกิด', data_type: 'date', format: 'thai_short', input_type: 'datepicker' },
        chwpart: { show: true, title: 'จังหวัด', data_type: 'string', format: null, input_type: 'select', input_select_source_type: 'db', input_select_source_name: 'cchangwats', input_select_source_key: 'changwatcode', input_select_source_value: 'changwatname' },
        hcode: { show: true, title: 'HCODE', data_type: 'string', format: null, input_type: 'autocomplete', input_select_source_type: 'db', input_select_source_name: 'hospitals', input_select_source_key: 'hos_id', input_select_source_value: 'hos_name' },
        death: { show: true, title: 'เสียชีวิต', data_type: 'string', format: null, input_type: 'radio', input_select_source_type: 'json', input_select_source_name: 'death', input_select_source_json: [{ id: 'Y', name: 'เสียชีวิตแล้ว' }, { id: 'N', name: 'ยังมีชีวิตอยู่' }], input_select_source_key: 'id', input_select_source_value: 'name' },
      }
    },
    clinicmember: {
      collection_name: 'clinicmembers',
      title: 'ตาราง Clinicmember',
      order_by: 'hn desc',
      create_document: true,
      update_document: true,
      delete_document: true,
      primary_key: 'id',
      fields: {
        hn: { show: true, title: 'HN', data_type: 'string', format: null, input_type: 'textbox' },
        hcode: { show: true, title: 'HCODE', data_type: 'string', format: null, input_type: 'textbox' },
        clinic: { show: true, title: 'คลินิก', data_type: 'string', format: null, input_type: 'textbox' },
        begin_year: { show: true, title: 'ปีที่เริ่มป่วย', data_type: 'string', format: null, input_type: 'textbox' },
      }
    },
    patient: {
      collection_name: 'patient',
      title: 'ตาราง Patient',
      order_by: 'hn desc',
      create_document: true,
      update_document: true,
      delete_document: true,
      primary_key: 'hos_guid',
      fields: {
        hn: { show: true, title: 'HN', data_type: 'string', format: null, input_type: 'textbox' },
        pname: { show: true, title: 'คำนำหน้าชื่อ', data_type: 'string', format: null, input_type: 'textbox' },
        fname: { show: true, title: 'ชื่อ', data_type: 'string', format: null, input_type: 'textbox' },
        lname: { show: true, title: 'สกุล', data_type: 'integer', format: null, input_type: 'textbox' },
        birthday: { show: true, title: 'วันเกิด', data_type: 'integer', format: null, input_type: 'textbox' }
      }
    },
    ovst: {
      collection_name: 'ovst',
      title: 'ตาราง Ovst',
      order_by: 'vstdate desc',
      create_document: true,
      update_document: false,
      delete_document: true,
      primary_key: 'hos_guid',
      fields: {
        hn: { show: true, title: 'HN', data_type: 'string', format: null },
        vn: { show: true, title: 'VN', data_type: 'string', format: null },
        vstdate: { show: true, title: 'วันรับบริการ', data_type: 'string', format: null },
        vsttime: { show: true, title: 'เวลารับบริการ', data_type: 'string', format: null },
        pttype: { show: true, title: 'รหัสสิทธิ', data_type: 'integer', format: null },
      }
    },
    opitemrece: {
      collection_name: 'opitemrece',
      title: 'ตาราง Opitemrece',
      order_by: 'hn desc, vstdate desc',
      create_document: true,
      update_document: false,
      delete_document: false,
      primary_key: 'hos_guid',
      fields: {
        icode: { show: true, title: 'icode', data_type: 'string', format: null },
        qty: { show: false, title: 'จำนวน', data_type: 'string', format: null },
      }
    }
  };

  const classes = useStyles();
  const [searchCID, setSearchCID] = useState(null);
  const [cidHelperText, setCidHelperText] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [interventionsData, setInterventionsData] = useState([]);
  const [serviceData, setServiceData] = useState({});
  const [yearShow, setYearShow] = useState({});
  const [yearTopic, setYearTopic] = useState([]);
  
  const listTableColumnSet = [
    {
      title: 'ชื่อสกุล',
      fields: ['fname', 'lname']
    },
    {
      title: 'เพศ',
      fields: ['sex']
    }
  ];

  const onchangeSearchText = (e) => {
    let v=e.target.value;
    let invalid=[];
    if (v.length!==13) {
      invalid.push('กรอกตัวเลขให้ครบ 13 หลัก');
    }
    if (!(/^[0-9]+$/.test(v))) {
      invalid.push('เฉพาะตัวเลขเท่านั้น');
    }

    if (invalid.length===0) {
      setSearchCID(v);
      setCidHelperText('');
    }
    else {
      setSearchCID(null);
      setCidHelperText(invalid.join(', '));
    }
  }

  const handleClickSearch = async () => {
    if (searchCID) {
      getPersonInfo();
    }

  }

  const getPersonInfo = async () => {
    setPatientData([]);
    setInterventionsData([]);
    setServiceData({});
    let xParams = {
      filter: {
        include:"interventions",
        where: {cid:searchCID},
      }
    };
    let response = await UAPI.getAll(xParams, 'people');
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length>0) {
          let r=response.data[0];
          // console.log(r);
          let x=[];
          x['cid']=r['cid'];
          x['pt_name']=r['fname']+' '+r['lname'];
          x['birthday']=r['birthday'];
          x['age']=0;
          x['bloodgrp']=r['bloodgrp'];
          x['address_info']='';
          setPatientData(x);
          let interventions=r.interventions;
          if (typeof interventions != 'undefined') {
            if (interventions.length>0) {
              interventions.reverse();
              setInterventionsData(interventions);   
            }
          }
        }
      }
    }
  }

  const mkYearShow = () => {
    let yearShowTMP={};
    let n=0;
    let lastYear='';
    interventionsData.forEach(i => {
      if (typeof i.date != 'undefined') {
        n++;
        let x=(parseInt(i.date.substr(0,4))+543).toString();
        yearShowTMP[(parseInt(i.date.substr(0,4))+543).toString()]='none';
        if (n===1) {
          lastYear=(parseInt(i.date.substr(0,4))+543).toString();
        }
      }
    });
    yearShowTMP[lastYear]='block';
    setYearShow(yearShowTMP);
  }


  const dateServList = () => {
    let yearsData=[];
    interventionsData.forEach(i => {
      if (typeof i.date != 'undefined') {
        let x=(parseInt(i.date.substr(0,4))+543).toString();
        if (typeof yearsData[x] === 'undefined') {
          yearsData[x]=[];
          yearsData[x].push({date:i.date,hcode:i.hcode});
        }
        else {
          yearsData[x].push({date:i.date,hcode:i.hcode});
        }
      }
    });

    let yearList=[];
    yearsData.reverse();
    yearsData.forEach(y => {
      let dateList=[];
      let yearTitle="";
      let i=0;
      // console.log(y);
      y.forEach(d => {
        i++;
        yearTitle=(parseInt(d.date.substr(0,4))+543).toString();
        dateList.push(<div key={d.date.toString()+'_'+i} className={classes.linkDateServ} onClick={(e,x)=>selectDateServ(e,d.date)}>{thaiXSDate(d.date)}</div>);
      });
      yearList.push(
        <div key={yearTitle}>
          <div style={{fontWeight:'bold', cursor: 'pointer'}} onClick={toggleYear(yearTitle)}>{yearTitle}</div>
          <div style={{display: yearShow[yearTitle]}}>
            {dateList}
          </div>
        </div>
      );
    });

    return yearList;
  }

  const toggleYear = () => {
    // console.log('toggleYear--');
  }

  const selectDateServ = (e,d) => {
    let x={};
    interventionsData.forEach(i => {
      if (i.date===d) {
        x=i;
      }
    });
    setServiceData(x);
  }

  const serviceDataBlock = () => {
    let assessment={};
    let diagnosis=[];
    let treatment=[];
    if (serviceData) {
      if (serviceData.activities) {
        assessment=serviceData.activities.assessment[0];
        diagnosis=serviceData.activities.diagnosis;
        treatment=serviceData.activities.treatment;
      }
    }

    return (
      <div>
        <div style={{marginTop: 10, marginBottom: 10}}><b>Service Infomation</b></div>
        {Object.keys(assessment).length>0&& <BoxServiceInfo data={assessment} />}
        <div style={{marginTop: 10, marginBottom: 10, paddingTop: 10, borderTop: 'solid 1px #E0E0E0'}}><b>Assessment</b></div>
        {Object.keys(assessment).length>0&& <BoxAssessment data={assessment} />}
        <div style={{marginTop: 10, marginBottom: 10, paddingTop: 10, borderTop: 'solid 1px #E0E0E0'}}><b>Diagnosis</b></div>
        <BoxDiagnosis data={diagnosis} />
        <div style={{marginTop: 10, marginBottom: 10, paddingTop: 10, borderTop: 'solid 1px #E0E0E0'}}><b>Treatment</b></div>
        <BoxTreatment data={treatment} />
      </div>
    );
  }

  const thaiXSDate = (x) => {
    let r=x;
    if (typeof x != 'undefined') {
      let z=r.toString().split('-');
      r=z[2]+'/'+z[1]+'/'+(parseInt(z[0])+543).toString();
    }
    return r;
  }

  // useEffect(() => {
  //   //
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mkYearShow();
    // console.log('dddddddddddd---');
  }, [interventionsData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{marginBottom:100}}>

      <div><h2>ค้นหาด้วยเลขบัตรประจำตัวประชาชน</h2></div>
      <div style={{ width: '100%' ,display:'flex' ,justifyContent:'space-between' }}>
        <div style={{width:'100%'}}>
          <TextField
            name="searchText"
            variant="outlined"
            // placeholder="ค้นหา"
            style={{ width: '100%' }}
            onChange={(e) => onchangeSearchText(e)}
            helperText={cidHelperText}
            FormHelperTextProps={{ className: classes.helperText }}
            // startAdornment={
            //   <InputAdornment position="start">
            //     <MdSearch size={20} />
            //   </InputAdornment>
            // }
          />
        </div>
        <div>
          <Button
            onClick={handleClickSearch}
            style={{height:55}}
            variant="contained"
            color="primary"
            startIcon={<MdSearch size={20} />}
          >
            ค้นหา
          </Button>
        </div>
      </div>

      <div style={{marginTop: 10, marginBottom: 10, padding:10, backgroundColor: '#f9f9f9', borderRadius: 5, border:'solid 1px #dadada' }}>
        <div style={{display:'flex', flexDirection:'flex-start'}}>
          <div style={{width:200}}>
            <div className={classes.contentTitle}>CID</div><div className={classes.contentText}>{patientData['cid']}</div>
          </div>
          <div style={{width:300}}>
            <div className={classes.contentTitle}>ชื่อ-สกุล</div><div className={classes.contentText}>{patientData['pt_name']}</div>
          </div>
          <div style={{width:200}}>
            <div className={classes.contentTitle}>วันเกิด</div><div className={classes.contentText}>{patientData['birthday']}</div>
          </div>
          <div style={{width:150}}>
            <div className={classes.contentTitle}>อายุ</div><div className={classes.contentText}>{patientData['age']} ปี</div>
          </div>
          <div style={{width:'auto'}}>
            <div className={classes.contentTitle}>หมู่เลือด</div>
            <div className={classes.contentText} style={{ width: 50, overflow:'hidden'}} >
              {patientData['bloodgrp']}
            </div>
          </div>
        </div>
        <div style={{display:'flex', flexDirection:'flex-start'}}>
          <div>
            <div className={classes.contentTitle}>ที่อยู่</div><div className={classes.contentText}>{patientData['address_info']}</div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%' ,display:'flex' ,justifyContent:'space-between' }}>
        <div style={{ width:150, border: 'solid 1px red', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5, border:'solid 1px #dadada'}}>
          {dateServList()}
        </div>
        <div style={{ width:'100%', border: 'solid 1px red', padding: 10, borderRadius: 5, border:'solid 1px #dadada', marginLeft: 10 ,whiteSpace: 'normal'}}>
          {serviceDataBlock()}
        </div>
      </div>
      
      {/* <UDataTable structure={collection.person_test} />

      <div><h2>Universal List Table</h2></div>
      <UListTable
        structure={collection.person_test}
        column_set={listTableColumnSet}
        sub_report={true}
        document_id="5fbcb0a3dbf45ef148b119c2"
      />

      <div><h2>Universal Card</h2></div>
      <div style={{width:250}}>
        <UCard structure={collection.person_test} display_style="block" document_id="5fbcb0a3dbf45ef148b119c2" />
      </div> */}

    </div>
  )
}
