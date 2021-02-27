import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import UAPI from "../services/UniversalAPI";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function UserList(props) {
  const [users, setUsers] = useState(null);
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [lookuproles, setLookUpRoles] = useState([]);
  const [userroleid, setUserRoleId] = useState({});
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [currentRoleMapping, setCurrentRoleMapping] = useState({});

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

    let response = await UAPI.getAll(xParams, "teamusers");
    setUsers(response.data);
  };

  useEffect(() => {
    getTeamuser();

    getLookUpRoles();
  }, []);

  const clickUserEditlink = (x) => {
    if (typeof x !== "undefined") {
      if (x !== null) {
        history.push({ pathname: "/useredit", state: { status: x } });
      }
    }
  };

  const getLookUpRoles = async () => {
    let response = await UAPI.getAll({}, "roles");
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {
          setLookUpRoles(response.data);
        }
      }
    }
  };

  const getAutoDefaultValueRole = (x) => {
    let r = null;
    lookuproles.forEach((i) => {
      if (i.id === x) {
        r = i;
      }
    });
    return r;
  };

  function addRole() {
    if (typeof currentRoleMapping.id !== "undefined") {
      UAPI.patch(
        currentRoleMapping.id,
        currentRoleMapping,
        "rolemappings"
      ).then(
        (response) => {
          if (response.status === 200) {
            alert("สำเร็จ");
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
    } else {
      UAPI.create(
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
    handleClose();
    getTeamuser();
  }

  function deleteUser(x) {
    //   console.log(x.id)
    //   console.log(x.RoleMapping[0].d)
    if (x.RoleMapping.length > 0) {
      UAPI.remove(x.RoleMapping[0].id, "rolemappings").then(
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

    UAPI.remove(x.id, "teamusers").then(
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
            <th style={{ width: "30%" }}>ชื่อ-สกุล</th>
            <th style={{ width: "30%" }}>Email</th>
            <th style={{ width: "30%" }}>สิทธิการใช้งาน</th>
            <th style={{ width: "30%" }}>จังหวัด</th>
            <th style={{ width: "30%" }}>หน่วยงาน</th>
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
                <td>{user.mobile}</td>
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
                  console.log(newValue.id);
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
