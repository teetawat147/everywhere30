/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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

export default function UserList(props) {
  const [users, setUsers] = useState(null);
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [lookuproles, setLookUpRoles] = useState([]);
  const [lookuprolescurrent, setLookUpRolesCurrent] = useState([]);
  const [userroleid, setUserRoleId] = useState({});
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [currentRoleMapping, setCurrentRoleMapping] = useState({});
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const handleClickRole = (x) => {
    setOpen(true);
    if (x.RoleMapping.length > 0) {
      setCurrentRoleMapping(x.RoleMapping[0]);
      setCurrentRoleId(x.RoleMapping[0].roleId);
    }
    setUserRoleId(x.id);
  };

  //console.log( currentUser );
  //console.log( currentUser.user );
    // console.log(currentUser.user.role);

  const handleClose = () => {
    setOpen(false);
  };
  const getTeamuser = async () => {
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
    //console.log(response.data)
  };

  useEffect(() => {
    getTeamuser();
    getLookUpRoles();
    getLookUpRolesCurrent();
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
      let response = await getAll({}, "roles");
      if (response.status === 200) {
        if (response.data) {
          if (response.data.length > 0) {
            setLookUpRoles(response.data);
            // console.log(response.data);
          }
        }
      }
    } else if (currentUser.user.role === "AdminChangWat") {
      let response = await getAll(
        {
          filter: {
            where: {
              or: [
                { name: "AdminChangewat" },
                { name: "AdminHospital" },
                { name: "Doctor" },
                { name: "Member" },
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
        { filter: { where: { or: [{ name: "Doctor" }, { name: "Member" }] } } },
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
            alert("สำเร็จ");
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
            alert("สำเร็จ");
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
    if (x.RoleMapping.length > 0) {
      remove(x.RoleMapping[0].id, "rolemappings").then(
        (response) => {
          if (response.status === 200) {
            alert("ลบสำเร็จ");
          }
          console.log(response);
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
        console.log(response);
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
    getTeamuser();
  }

  return (
    <div>
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
                <td>{user.changewat}</td>
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
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">กำหนดสิทธิใช้งาน</DialogTitle>
          <DialogContent>
            <DialogContentText>กำหนดสิทธิใช้งาน</DialogContentText>
            <div className="form-group">
              <Autocomplete
                id="changewat"
                size="small"
                fullWidth
                required
                options={lookuproles}
                defaultValue={getAutoDefaultValueRole(currentRoleId)}
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
                  <TextField {...params} label="จังหวัด" variant="outlined" />
                )}
              />
            </div>
          </DialogContent>

          <DialogActions>
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
