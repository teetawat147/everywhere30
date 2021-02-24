import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import UAPI from "../services/UniversalAPI";

const Monitor = () => {
    const getData = async () => {
        let xParams = {
            filter: {
              where: {cid:{inq:['1471400120432']}},
              
              limit: 1
            //   include: {
            //     relation: "intervention",
            //     scope: {
            //       include: {
            //         relation: "hospital",
            //       }
            //     }
            //   }
            }
        };

        let response = await UAPI.getAll(xParams, 'people');
        if (response.status === 200) {
            if (response.data) {
                if (response.data.length > 0) {
                    console.log(response.data);
                // let r=response.data[0];
                // console.log(r);
                // setData(response.data);
                }
            }
        }
    }
//   const [content, setContent] = useState("");

//   useEffect(() => {
//     UserService.getAdminBoard().then(
//       (response) => {
//         setContent(response.data);
//       },
//       (error) => {
//         const _content =
//           (error.response &&
//             error.response.data &&
//             error.response.data.message) ||
//           error.message ||
//           error.toString();

//         setContent(_content);
//       }
//     );
//   }, []);
    useEffect(() => {
        getData();
    }, []);

  return (
    <div style={{marginBottom:100, width: '100%' }}>
        <div><h5>Monitor Data</h5></div>
    </div>
  );
};

export default Monitor;
