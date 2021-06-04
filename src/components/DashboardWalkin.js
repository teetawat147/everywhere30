import React, { useState, useEffect } from 'react';
import { getAll, getCount } from "../services/UniversalAPI";

import {
    Button as MuiButton,
    Card as MuiCard,
    Typography
  } from "@material-ui/core";

const DashboardWalkin = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            let xParams = {
                filter: {
                  limit: 5,
                  include: ["hospital"],
                  where: {
                    
                  },
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
            }
            // console.log(xParams);
        }
        getData();
    }, []);

    return (
        <div className="container">
            <Typography variant="h4" gutterBottom display="inline">Dashboard Walkin</Typography>
        </div>
    );
};

export default DashboardWalkin;