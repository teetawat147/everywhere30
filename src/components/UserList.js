/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core';
import { getAll, patch, create, remove } from "../services/UniversalAPI";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getCurrentUser } from "../services/auth.service";
import { useConfirm } from "material-ui-confirm";
const useStyles = makeStyles(theme => ({
  dialog: {
    '& .MuiTextField-root': {
      width: '100%',
    },
    '& .MuiInputLabel-outlined': {
      zIndex: 1,
      transform: 'translate(15px, 4px) scale(1)',
      pointerEvents: 'none'
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(15px, -16px) scale(0.75)',
    }
  }
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
          include: {
            relation: "RoleMapping",
            scope: {
              include: {
                relation: "role",
              },
            },
          },
        },
      };
      let response = await getAll(xParams, "teamusers");
      setUsers(response.data);
        //  console.log(response.data);
    } else if (currentUser.user.role === "AdminChangwat") {
      let xParams = {
        filter: {
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
          where: { "changwat": currentUser.user.changwat },
        },
      };
      let response = await getAll(xParams, "teamusers");
      setUsers(response.data);
      // "where":{"ampurCode":21}
     
          // console.log(response.data[0].RoleMapping[0].role.name);
    } else if (currentUser.user.role === "AdminHospital") {
      let xParams = {
        filter: {
          where: { "department.hcode": currentUser.user.department.hcode },
          include: {
            relation: "RoleMapping",
            scope: {
              include: {
                relation: "role",
              },
            },
          },
        },
      };
      let response = await getAll(xParams, "teamusers");
      setUsers(response.data);
      // console.log(response.data);
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
      let response = await getAll({
        filter: {
          where: {
            or: [
              { name: "AdminR8" },
              { name: "AdminChangwat" },
              { name: "AdminHospital" },
              { name: "Doctor" }
            ],
          },
        },
      }, "roles");
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
                { name: "Doctor" }
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
        //   console.log(x)
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
              // alert("ลบสำเร็จ");
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
      .catch(() => { });
  }

  return (
    <div >
      <h1>Users</h1>
      <button
        onClick={() => clickUserEditlink("newadd")}
        className="btn btn-sm btn-success mb-2"
      >
        Add User
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: "20%" }}>ชื่อ-สกุล</th>
            <th style={{ width: "20%" }}>Email</th>
            <th style={{ width: "20%" }}>สิทธิการใช้งาน</th>
            <th style={{ width: "20%" }}>จังหวัด</th>
            <th style={{ width: "50%" }}>หน่วยงาน</th>
            <th style={{ width: "10%" }}></th>
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
              <td colSpan="4" className="text-center">
                <div className="p-2">No Users To Display</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth='md'
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title" style={{ paddingTop: '24px' }}>กำหนดสิทธิใช้งาน</DialogTitle>
          <DialogContent style={{ width: '400px', height: '90px' }}>
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
                  //   console.log(newValue.id);
                  let x = currentRoleMapping;
                  x["roleId"] = newValue.id;
                  setCurrentRoleMapping({ ...currentRoleMapping, ...x });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="สิทธิ์การใช้งาน" variant="outlined" />
                )}
              />
            </div>
          </DialogContent>
          <DialogActions style={{ padding: '0px 24px 24px 24px' }}>
            <Button variant="outlined" onClick={handleClose} color="primary">
              ยกเลิก
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
    </div>
  );
}