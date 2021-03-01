/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

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
    Typography
} from "@material-ui/core";

const Monitor = () => {
    const [data, setData] = useState(null);

    const getData = async () => {
        let xParams = {
            filter: {
                groupBy: "hname"
            }
        };

        let response = await getGroupBy(xParams, 'people');
        if (response.status === 200) {
            if (response.data) {
                if (response.data.length > 0) {
                    // console.log(response.data);
                    setData(response.data);
                }
            }
        }
    }

    useEffect(() => {
        getData();
    }, []);

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
                        <TableCell align="center">ลำดับ</TableCell>
                        <TableCell>หน่วยบริการ</TableCell>
                        <TableCell align="right">จำนวน</TableCell>
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
            <div><h5>Monitor Data</h5></div>
            {mkRows()}
        </div>
    );
};

export default Monitor;
