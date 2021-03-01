/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
    makeStyles
  } from '@material-ui/core/styles';

import UserService from "../services/user.service";
import { getGroupBy } from "../services/UniversalAPI";

import {
    Grid,
    Link,
    Breadcrumbs as MuiBreadcrumbs,
    Card as MuiCard,
    CardContent as MuiCardContent,
    Divider as MuiDivider,
    Paper as MuiPaper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Backdrop
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

const Monitor = () => {
    const classes = useStyles();
    const [data, setData] = useState(null);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const getData = async () => {
        setOpenBackdrop(true);
        let xParams = {
            filter: {
                groupBy: "hname"
            }
        };

        let response = await getGroupBy(xParams, 'people');
        if (response.status === 200) {
            if (response.data) {
                if (response.data.length > 0) {
                    setOpenBackdrop(false);
                    // console.log(response.data);
                    setData(response.data);
                }
            }
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const closeBackdrop = () => {
        setOpenBackdrop(false);
    }

    const mkRows = () => {
        let r = [];
        if (data) {
            if (typeof data !== 'undefined') {
                if (data.length > 0) {
                    let ii = 1;
                    data.forEach(i => {
                        r.push(
                            <TableRow key={ii}>
                                <TableCell align="center">{ii++}</TableCell>
                                <TableCell component="th" scope="row">{i.hname}</TableCell>
                                <TableCell align="right">{i.count}</TableCell>
                            </TableRow>
                        );
                    });
                }
            }
        }
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><b>ลำดับ</b></TableCell>
                        <TableCell><b>หน่วยบริการ</b></TableCell>
                        <TableCell align="right"><b>จำนวน</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {r}
                </TableBody>
            </Table>
        );
    }

    return (
        <div style={{ marginBottom: 100, width: '100%' }}>
            <Backdrop className={classes.backdrop} open={openBackdrop} onClick={closeBackdrop}>
            {/* <Backdrop className={classes.backdrop} open={true}> */}
                <CircularProgress color="inherit" />
            </Backdrop>
            <div><h5>Monitor Person Data</h5></div>
            {mkRows()}
        </div>
    );
};

export default Monitor;
