/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import UAPI from "../services/UniversalAPI";
import UDataTable from "./UniversalDataTable";

const BoardUser = () => {
  // const [content, setContent] = useState("");
  const collection = {
    users: {
      collection_name: 'teamusers',
      title: 'ผู้ใช้งาน',
      order_by: 'id asc',
      create_document: true,
      update_document: true,
      delete_document: true,
      primary_key: 'id',
      query_string: '',
      rows_per_page: 10,
      search_field: ['email', 'username'],
      fields: {
        fullname: { show: true, title: 'ชื่อ-สกุล', data_type: 'string', format: null, input_type: 'textbox', validation: 'string', value_length_type: null, value_length_count: null, value_length_min: null, value_length_max: null },
        email: { show: true, title: 'อีเมลล์', data_type: 'string', format: null, input_type: 'textbox', validation: 'string', value_length_min: null, value_length_max: null },
        username: { show: true, title: 'ชื่อผู้ใช้', data_type: 'string', format: null, input_type: 'textbox', validation: 'string', value_length_type: null, value_length_count: null, value_length_min: null, value_length_max: null },
        password: { show: false, title: 'รหัสผ่าน', data_type: 'string', format: null, input_type: 'textbox', validation: 'string', value_length_type: null, value_length_count: null, value_length_min: null, value_length_max: null }

      }
    }
  };
  useEffect(() => {
    UAPI.getAll({}, "/teamusers").then(
      (response) => {
        console.log(response.data);
        // setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(_content);
        // setContent(_content);
      }
    );
  }, []);

  return (
    <div style={{ marginBottom: 100 }}>
      <div><h2>ผู้ใช้งาน</h2></div>
      <UDataTable structure={collection.users} />
    </div>
  )
};

export default BoardUser;
