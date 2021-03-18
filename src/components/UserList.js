/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Dialog,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
} from "@material-ui/core";
import {
  getAll,
  patch,
  create,
  remove,
  getCount,
} from "../services/UniversalAPI";
import { Autocomplete, Pagination } from "@material-ui/lab";
import { getCurrentUser } from "../services/auth.service";
import { useConfirm } from "material-ui-confirm";
import * as ICONS from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  dialog: {
    "& .MuiTextField-root": {
      width: "100%",
    },
    "& .MuiInputLabel-outlined": {
      zIndex: 1,
      transform: "translate(15px, 4px) scale(1)",
      pointerEvents: "none",
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(15px, -16px) scale(0.75)",
    },
  },
  pagina: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
}));
export default function UserList(props) {
  const [users, setUsers] = useState(null);
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [lookuproles, setLookUpRoles] = useState([]);
  const [lookuprolescurrent, setLookUpRolesCurrent] = useState([]);
  const [userroleid, setUserRoleId] = useState({});
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [currentRoleMapping, setCurrentRoleMapping] = useState({});
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const confirm = useConfirm();

  const [paginationSkip, setPaginationSkip] = useState(0);
  const [paginationLimit, setPaginationLimit] = useState(10);
  const [paginationSkipBack, setPaginationSkipBack] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsCount, setRowsCount] = useState(0);
  const [searchName, setSearchName] = useState("");

  const handleClickRole = (x) => {
    setOpen(true);
    if (x.RoleMapping.length > 0) {
      setCurrentRoleMapping(x.RoleMapping[0]);
      setCurrentRoleId(x.RoleMapping[0].roleId);
    }
    setUserRoleId(x.id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getTeamuser = async () => {
    if (currentUser.user.role === "AdminR8") {
      let xParams = {
        filter: {
          skip: paginationSkip,
          limit: paginationLimit,
          order: "id ASC",
          include: {
            relation: "RoleMapping",
            scope: {
              include: {
                relation: "role",
              },
            },
          },
          where: { fullname: { like: searchName } },
        },
      };
      let response = await getAll(xParams, "teamusers");
      setUsers(response.data);

      let rowcount = await getCount(
        {
          where: {
            fullname: { like: searchName },
          },
        },
        "teamusers"
      );
      //  console.log(rowcount.data.count);
      setRowsCount(Math.ceil(rowcount.data.count / rowsPerPage));
      // setRowsCount(rowcount.data.count);

      //  console.log(response.data);
    } else if (currentUser.user.role === "AdminChangwat") {
      let xParams = {
        filter: {
          skip: paginationSkip,
          limit: paginationLimit,
          include: {
            relation: "RoleMapping",
            scope: {
              include: {
                relation: "role",
                // scope:{
                //   where:{"name":{"neq":"AdminR8"}},
                // },
              },
              // where: { "name":"AdminR8"},
            },
          },
          where: {
            and: [
              { changwat: currentUser.user.changwat },
              { fullname: { like: searchName } },
            ],
          },
        },
      };
      let response = await getAll(xParams, "teamusers");
      setUsers(response.data);
      // "where":{"ampurCode":21}
      let rowcount = await getCount(
        {
          where: {
            and: [
              { changwat: currentUser.user.changwat },
              { fullname: { like: searchName } },
            ],
          },
        },
        "teamusers"
      );
      //  console.log(rowcount.data.count);
      setRowsCount(Math.ceil(rowcount.data.count / rowsPerPage));
      // setRowsCount(rowcount.data.count);

      // console.log(response.data[0].RoleMapping[0].role.name);
    } else if (currentUser.user.role === "AdminHospital") {
      let xParams = {
        filter: {
          skip: paginationSkip,
          limit: paginationLimit,
          include: {
            relation: "RoleMapping",
            scope: {
              include: {
                relation: "role",
              },
            },
          },
          where: {
            and: [
              { "department.hcode": currentUser.user.department.hcode },
              { fullname: { like: searchName } },
            ],
          },
        },
      };
      let response = await getAll(xParams, "teamusers");
      setUsers(response.data);
      // console.log(response.data);
      let rowcount = await getCount(
        {
          where: {
            and: [
              { "department.hcode": currentUser.user.department.hcode },
              { fullname: { like: searchName } },
            ],
          },
        },
        "teamusers"
      );
      // console.log(rowcount.data.count);
      setRowsCount(Math.ceil(rowcount.data.count / rowsPerPage));
      // setRowsCount(rowcount.data.count);
    }
  };

  useEffect(() => {
    getTeamuser();
    getLookUpRoles();
    getLookUpRolesCurrent();
    // console.log(currentUser.user.role)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickUserEditlink = (x) => {
    if (typeof x !== "undefined") {
      if (x !== null) {
        history.push({ pathname: "/useredit", state: { status: x } });
      }
    }
  };

  const getLookUpRolesCurrent = async () => {
    let response = await getAll({}, "roles");
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {
          setLookUpRolesCurrent(response.data);
          //console.log(response.data);
        }
      }
    }
  };

  const getLookUpRoles = async () => {
    if (currentUser.user.role === "AdminR8") {
      let response = await getAll(
        {
          filter: {
            where: {
              or: [
                { name: "AdminR8" },
                { name: "AdminChangwat" },
                { name: "AdminHospital" },
                { name: "Doctor" },
              ],
            },
          },
        },
        "roles"
      );
      if (response.status === 200) {
        if (response.data) {
          if (response.data.length > 0) {
            setLookUpRoles(response.data);
            // console.log(response.data);
          }
        }
      }
    } else if (currentUser.user.role === "AdminChangwat") {
      let response = await getAll(
        {
          filter: {
            where: {
              or: [
                { name: "AdminChangwat" },
                { name: "AdminHospital" },
                { name: "Doctor" },
              ],
            },
          },
        },
        "roles"
      );
      if (response.status === 200) {
        if (response.data) {
          if (response.data.length > 0) {
            setLookUpRoles(response.data);
            // console.log(response.data);
          }
        }
      }
    } else if (currentUser.user.role === "AdminHospital") {
      let response = await getAll(
        { filter: { where: { name: "Doctor" } } },
        "roles"
      );
      if (response.status === 200) {
        if (response.data) {
          if (response.data.length > 0) {
            setLookUpRoles(response.data);
          }
        }
      }
    }
  };

  const getAutoDefaultValueRole = (x) => {
    let r = null;
    lookuprolescurrent.forEach((i) => {
      if (i.id === x) {
        r = i;
      }
    });
    return r;
  };

  function addRole() {
    // console.log(currentRoleMapping)
    if (typeof currentRoleMapping.id !== "undefined") {
      patch(currentRoleMapping.id, currentRoleMapping, "rolemappings").then(
        (response) => {
          if (response.status === 200) {
            // alert("สำเร็จ");
            handleClose();
            getTeamuser();
          }
          //console.log(response);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    } else {
      create(
        {
          principalType: "USER",
          principalId: userroleid,
          roleId: currentRoleMapping.roleId,
          approveBy: currentUser.user.id,
        },
        "rolemappings"
      ).then(
        (response) => {
          if (response.status === 200) {
            // alert("สำเร็จ");
            handleClose();
            getTeamuser();
          }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    }
  }

  function deleteUser(x) {
    confirm({
      title: "ลบข้อมูล",
      description: "ท่านต้องการลบข้อมูลผู้ใช้งานจริงใช่ไหม",
      //description:(confirmConsent==='Y')?
      //<span>ต้องการบันทึกข้อมูล<span style={{color:'green'}}>"ยินยอม"</span>ใช่หรือไม่</span>:
      //<span>ต้องการบันทึกข้อมูล<span style={{color:'red'}}>"ไม่ยินยอม"</span>ใช่หรือไม่</span>:
      confirmmationText: "ยืนยัน",
      concellaText: "ยกเลิก",
    })
      .then(async () => {
        //console.log(x)
        if (x.RoleMapping.length > 0) {
          remove(x.RoleMapping[0].id, "rolemappings").then(
            (response) => {
              if (response.status === 200) {
                //   alert("ลบสำเร็จ");
              }
              // console.log(response);
            },
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
            }
          );
        }

        remove(x.id, "teamusers").then(
          (response) => {
            if (response.status === 200) {
              alert("ลบสำเร็จ");
            }
            //   console.log(response);
            getTeamuser();
          },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
          }
        );
      })
      .catch(() => {});
  }

  function delRole(x) {
    confirm({
      title: "ลบสิทธิ",
      description: "ท่านต้องการยกเลิกสิทธิการใช้งานใช่ไหม",
      //description:(confirmConsent==='Y')?
      //<span>ต้องการบันทึกข้อมูล<span style={{color:'green'}}>"ยินยอม"</span>ใช่หรือไม่</span>:
      //<span>ต้องการบันทึกข้อมูล<span style={{color:'red'}}>"ไม่ยินยอม"</span>ใช่หรือไม่</span>:
      confirmmationText: "ยืนยัน",
      concellaText: "ยกเลิก",
    })
      .then(async () => {
        //  console.log(x)
        if (x.length > 0) {
          remove(x, "rolemappings").then(
            (response) => {
              if (response.status === 200) {
                handleClose();
                setCurrentRoleId(null);
                setCurrentRoleMapping({});
                // alert("ลบสำเร็จ");
              }

              getTeamuser();
              //  console.log(response);
            },
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
            }
          );
        }
      })
      .catch(() => {});
  }
  const handleChangeSearchName = (e) => {
    // console.log(e.target.value)
    setSearchName(e.target.value);
  };
  const handleChangePage = (event, newPage) => {
    setPaginationSkip((newPage - 1) * rowsPerPage);
    // setPaginationSkipBack((newPage - 1) * rowsPerPage);
    if (newPage === 1) {
      setPaginationSkipBack(0);
    }
  };

  useEffect(() => {
    getTeamuser();
  }, [paginationSkip]);

  useEffect(() => {
    getTeamuser();
  }, [rowsPerPage]);

  const onChangeRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
    setPaginationLimit(e.target.value);
  };

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      // console.log('paginationSkip---'+paginationSkip)
      // console.log('paginationSkipBack---'+paginationSkipBack)
      // console.log(searchName)
      if (searchName !== "" && paginationSkip !== 0) {
        // console.log('wwwwwwww')
        setPaginationSkipBack(paginationSkip);
        setPaginationSkip(0);
        // setPaginationSkip(paginationSkipBack);
      } else if (
        searchName === "" &&
        paginationSkip === 0 &&
        paginationSkipBack > 0
      ) {
        // console.log( "sdkjfndkjdf");
        setPaginationSkip(paginationSkipBack);
      } else if (paginationSkip === 0 && paginationSkipBack === 0) {
        //getTeamuser();
        //setPaginationSkip(0);
        // console.log("kkkkkkkk");
        getTeamuser();
      }

      // put the login here
    }
  };

  return (
    <div>
      <h1>ผู้ใช้งาน</h1>

      <div
        style={{
          marginBottom: 8,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "100%" }}>
          <TextField
            type="text"
            className="form-control"
            placeholder="ค้นหาชื่อ"
            variant="outlined"
            style={{ width: "100%" }}
            value={searchName}
            onChange={handleChangeSearchName}
            onKeyDown={keyPress}
          />
        </div>
        <div style={{ whiteSpace: "nowrap", marginLeft: 10 }}>
          <FormControl variant="outlined" style={{ width: "100%" }}>
            <Select value={rowsPerPage} onChange={onChangeRowsPerPage}>
              <MenuItem key={10} value={10}>
                {10} แถว
              </MenuItem>
              <MenuItem key={20} value={20}>
                {20} แถว
              </MenuItem>
              <MenuItem key={30} value={30}>
                {30} แถว
              </MenuItem>
              <MenuItem key={40} value={40}>
                {40} แถว
              </MenuItem>
              <MenuItem key={50} value={50}>
                {50} แถว
              </MenuItem>
              <MenuItem key={100} value={100}>
                {100} แถว
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ชื่อ-สกุล</th>
            <th>Email</th>
            <th>สิทธิการใช้งาน</th>
            <th>จังหวัด</th>
            <th>หน่วยงาน</th>
            <th className="text-center">
              {" "}
              <button
                onClick={() => clickUserEditlink("newadd")}
                className="btn btn-sm btn-success mb-2"
              >
                เพิ่มผู้ใช้งาน
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>
                  {user.RoleMapping.length > 0
                    ? user.RoleMapping[0].role.name
                    : ""}
                </td>
                <td>{user.changwat}</td>
                <td>
                  {typeof user.department !== "undefined"
                    ? user.department.hos_name
                    : ""}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleClickRole(user)}
                    className="btn btn-sm btn-warning mr-1"
                  >
                    อนุมัติ
                  </button>
                  <button
                    onClick={() => clickUserEditlink(user)}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => deleteUser(user)}
                    className="btn btn-sm btn-danger btn-delete-user"
                    disabled={user.isDeleting}
                  >
                    {user.isDeleting ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <span>ลบ</span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          {!users && (
            <tr>
              <td colSpan="4" className="text-center">
                <div className="spinner-border spinner-border-lg align-center"></div>
              </td>
            </tr>
          )}
          {users && !users.length && (
            <tr>
              <td colSpan="6" className="text-center">
                <div className="p-2">ไม่มีข้อมูล</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title" style={{ paddingTop: "24px" }}>
            กำหนดสิทธิใช้งาน
          </DialogTitle>
          <DialogContent style={{ width: "400px", height: "90px" }}>
            <DialogContentText></DialogContentText>
            <div className={"form-group " + classes.dialog}>
              <Autocomplete
                id="roleType"
                size="small"
                fullWidth
                required
                options={lookuproles}
                value={getAutoDefaultValueRole(currentRoleId)}
                getOptionSelected={(option, value) =>
                  value.name === option.name
                }
                getOptionLabel={(option) => option.name || ""}
                onChange={(e, newValue) => {
                  //  console.log(newValue.id);
                  //  console.log(currentRoleMapping)
                  let x = currentRoleMapping;
                  x["roleId"] = newValue.id;
                  x["approveBy"] = currentUser.user.id;
                  setCurrentRoleMapping({ ...currentRoleMapping, ...x });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="สิทธิ์การใช้งาน"
                    variant="outlined"
                  />
                )}
              />
            </div>
          </DialogContent>
          <DialogActions style={{ padding: "0px 24px 24px 24px" }}>
            <Button variant="outlined" onClick={handleClose}>
              ยกเลิก
            </Button>
            <Button
              variant="outlined"
              onClick={() => delRole(currentRoleMapping.id)}
              color="secondary"
            >
              ลบสิทธิ
            </Button>
            <Button
              variant="outlined"
              onClick={() => addRole()}
              color="primary"
            >
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div
        className={classes.pagina}
        style={{
          marginBottom: 5,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={rowsCount}
          onChange={handleChangePage}
          variant="outlined"
          color="primary"
          size="large"
        />
      </div>
    </div>
  );
}
