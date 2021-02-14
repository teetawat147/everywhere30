// import React, { useState, useEffect } from "react";
import React , { useEffect } from "react";
// npm install use-mediaquery --save

import UDataTable from "./UniversalDataTable";
import UCard from "./UniversalCard";
import UListTable from "./UniversalListTable";

export default function App(props) {
  /// icon 
  /// validation --- รับได้เฉพาะ ตัวเลข / สตริง
  /// แยกส่วน api ออกไป โยนข้อมูล จาก api เข้ามาใน app ทีนี้จะเป็น nested หรือไม่ก็เป็นไร เพราะมาจะมาเป็น json 
  /// ไปเอา table จาก material ui มาใช้นะ / ดูแล้วจะสะดวกกว่า 
  const collection = {
    teamuser: {
      collection_name: 'teamusers',
      title: 'รายชื่อ USER',
      order_by: 'fullname asc',
      create_document: true,
      update_document: true,
      delete_document: false,
      primary_key: 'id',
      query_string: '',
      rows_per_page: 10, // 10 20 30 40 50 60 70 80 90 100
      search_field:['cid','fullname'],
      fields: {
        cid: { show: true, title: 'CID', data_type: 'string', format: null, input_type: 'textbox', icon: 'MdFavorite', validation: 'number', value_length_type: 'fix', value_length_count: 13, value_length_min: null, value_length_max: null },
        email: { show: true, title: 'ROLE', data_type: 'string', format: null, input_type: 'select', input_select_source_type: 'db', input_select_source_name: 'roles', input_select_source_key: 'id', input_select_source_value: 'name' }
      }
    },
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

  return (
    <div style={{marginBottom:100}}>

      <div><h2>Universal Data Table</h2></div>
      <UDataTable structure={collection.teamuser} />

      {/* <div><h2>Universal List Table</h2></div>
      <UListTable
        structure={collection.person_test}
        column_set={listTableColumnSet}
        sub_report={true}
        document_id="5fbcb0a3dbf45ef148b119c2"
      /> */}

      {/* <div><h2>Universal Card</h2></div>
      <div style={{width:250}}>
        <UCard structure={collection.person_test} display_style="block" document_id="5fbcb0a3dbf45ef148b119c2" />
      </div> */}

    </div>
  )
}
