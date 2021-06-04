import React, { useState, useEffect } from 'react';
import { getAll, getCount } from "../services/UniversalAPI";

import {
    Button as MuiButton,
    Card as MuiCard,
    Typography
  } from "@material-ui/core";

const DashboardWalkin = () => {
    const [data, setData] = useState(null);

    const getData = async () => {
        // let andQuery = [];
        // andQuery.push({ hcode: sentHcode });
        let xParams = {
            filter: {
              limit: 5,
              include: ["hospital"],
              where: {
                "walkin_pttype": ["wi", "WI", "wo", "WO"]
              }
            }
        };

        let response = await getAll(xParams, 'interventions');
        if (response.status === 200) {
            if (response.data) {
                if (response.data.length > 0) {
                    setData(response.data);
                    console.log(response.data);
                    // setOpenBackdrop(false);
                } else {
                    // setOpenBackdrop(false);
                }
            }
        } else {
            console.log("error");
        }
        // console.log(xParams);
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="container">
            <Typography variant="h4" gutterBottom display="inline">Dashboard Walkin</Typography>
        </div>
    );
};

export default DashboardWalkin;