import React, { useState, useEffect } from 'react';
import {
    Button as MuiButton,
    Card as MuiCard,
    Typography
  } from "@material-ui/core";

const DashboardWalkin = () => {
    useEffect(() => {
        const getCountPerson = () => {
            console.log("OK");
        }
        getCountPerson();
    }, []);

    return (
        <div className="container">
            <Typography variant="h4" gutterBottom display="inline">Dashboard Walkin</Typography>
        </div>
    );
};

export default DashboardWalkin;