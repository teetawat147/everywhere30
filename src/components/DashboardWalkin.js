import React, { useState, useEffect } from 'react';
import { getAll } from "../services/UniversalAPI";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    Backdrop,
    Grid,
  } from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { getCurrentUser } from "../services/auth.service";

import {
    Button as MuiButton,
    Card as MuiCard,
    Typography
  } from "@material-ui/core";
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
},
table: {
    // minWidth: 700,
},
formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
},
selectEmpty: {
    marginTop: theme.spacing(2),
},
root: {
    '& .MuiInputLabel-outlined': {
    zIndex: 1,
    transform: 'translate(15px, 4px) scale(1)',
    pointerEvents: 'none'
    },
    '& .MuiInputLabel-shrink': {
    transform: 'translate(15px, -16px) scale(0.75)',
    }
},
ct: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    boxSizing: 'border-box'
}
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: '#2d2d37',
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
const StyledTableRow = withStyles((theme) => ({
root: {
    '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    },
},
}))(TableRow);

const DashboardWalkin = () => {
    const classes = useStyles();
    const [data, setData] = useState(null);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const currentUser = getCurrentUser();
    const [changwats, setChangwats] = useState([]);
    const [changwat, setChangwat] = useState((currentUser != null) ? currentUser.user.changwat || currentUser.user.changwat.changwatname : '');
    const [hostype, setHostype] = useState('hospital');

    useEffect(() => {
        // setOpenBackdrop(true);
        const getChangwat = async () => {
          let xParams = {
            filter: {
              fields: { changwatcode: true, changwatname: true },
              where: { "zonecode": "08" }
            }
          };
          let response = await getAll(xParams, 'cchangwats');
          if (response.status === 200) {
            if (response.data) {
              if (response.data.length > 0) {
                setChangwats(response.data);
              }
            }
          }
        }
        getChangwat();
        getData().then((result) => {
        //   if (Object.keys(result).length > 0) {
        //     MakeRows(result);
        //   } else {
        //     setOpenBackdrop(false);
        //   }
        });
    }, []);

    useEffect(() => {
        getData().then((result) => {
            if (Object.keys(result).length > 0) {
            //   MakeRows(result);
            } else {
              setOpenBackdrop(false);
            }
        });
    }, [changwat, hostype]);

    const getData = async () => {
        // let andQuery = [];
        // andQuery.push({ hcode: sentHcode });
        setOpenBackdrop(true);
        let params = {
            filter: {
                fields: { hos_id: true, hos_name: true },
                where: {},
                counts: "intervention",
                countsWhere: {walkin_pttype: "wi"},
                countsAs: "count_data"
            }
        };
        let hostype_id = [];
        if (typeof hostype !== 'undefined' && hostype != null && hostype !== '') {
            switch (hostype) {
                case 'hospital': hostype_id = [{ hos_type_id: '2' }, { hos_type_id: '3' }, { hos_type_id: '4' }];
                    break;
                case 'subHospital': hostype_id = [{ hos_type_id: '6' }];
                    break;
                default: hostype_id = [{ hos_type_id: '2' }, { hos_type_id: '3' }, { hos_type_id: '4' }, { hos_type_id: '6' }];
                    break;
            }
        }
        
        // let xParams = {
        //     filter: {
        //         limit: 5,
        //         fields: {hos_id: true, hos_name: true},
        //         counts: ["intervention"],
        //         where: {
        //             province_name: changwat,
        //             hos_type_id: '2'
        //         },
        //         countsWhere: [{walkin_pttype: "wi"}],
        //         countsAs: ["count_data"]
        //     }
        // };

        let response = null;
        if (typeof changwat !== 'undefined' && changwat != null && changwat !== '') {
            params.filter.where = {
              province_name: (typeof changwat==='object') ? changwat.changwatname : changwat,
              or: hostype_id
            };
            response = await getAll(params, 'hospitals');
            // console.log(response);
        }
        let result = [];
        if (response != null) {
            if (response.status === 200) {
                if (response.data) {
                    if (response.data.length > 0) {
                        result = await response.data.map(async (hos) => {
                            let [hosname] = hos.hos_name.split(/\s+(.*)/);
                            return {
                                hcode: hos.hos_id,
                                hosname: hosname,
                                count: hos.count_data
                            };
                        });
                    }
                }
            }
        }
        return await Promise.all(result);
    }

    const MakeRows = (hospitals) => {
        setOpenBackdrop(false);
    }

    return (
        <div className={classes.root} style={{ marginBottom: 100, width: '100%', maxWidth: "100%" }}>
            <Grid>
                <Grid item xs={12}>
                    <Backdrop className={classes.backdrop} open={openBackdrop}><CircularProgress color="inherit" /></Backdrop>
                    <div style={{ marginBottom: '30px' }}><h4>Dashboard Walkin</h4></div>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={2} lg={2}>
                            <FormControl variant="outlined" size="small" className={classes.formControl} style={{ margin: '0', width: '100%' }}>
                                <InputLabel htmlFor="changwat">จังหวัด</InputLabel>
                                <Select
                                label="จังหวัด"
                                value={changwat}
                                onChange={(e) => {
                                    // setCurrPage(1);
                                    // setAllPages(0);
                                    setChangwat(e.target.value);
                                }}
                                inputProps={{
                                    name: 'changwat',
                                    id: 'changwat',
                                }}
                                >
                                {/* <MenuItem key="0" value="">กรุณาเลือกจังหวัด</MenuItem> */}
                                {changwats.map((chw, key) => {
                                    return <MenuItem key={key++} value={chw.changwatname}>{chw.changwatname}</MenuItem>;
                                })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default DashboardWalkin;