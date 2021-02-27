/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
// import  UserService from '../services/UniversalAPI';
import UAPI from "../services/UniversalAPI";
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
  // function UserList({props, match }) {
  // const { path } = match;
  const [users, setUsers] = useState(null);
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [lookuproles, setLookUpRoles] = useState([]);
  const [role, setRole] = useState("");
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const handleClickOpen = (x) => {

    setOpen(true);
    // setRole(currentUser.user.role);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getTeamuser = async () => {
    let response = await UAPI.getAll({}, "teamusers");
 console.log(response.data);
    setUsers(response.data);
  };

  useEffect(() => {
    getTeamuser();
    getLookUpRoles();
    
    // UAPI.getAll({},'teamusers').then(x => setUsers(x.data));
    //     // console.log(users)
  }, []);
//   console.log( currentUser );
//   console.log( currentUser.user );
  // console.log( currentUser.user.role )

  const clickUserEditlink = (x) => {
    // console.log(x)
    if (typeof x !== "undefined") {
      if (x !== null) {
        history.push({ pathname: "/useredit", state: { status: x } });
      }
    }
  };

  const getRoles = async (x) => {
    let response = await UAPI.getAll(
      {
        filter: { where: { principalId: x } },
      },
      "rolemappings"
    );
   let response2=response.data[0]
     //console.log(response2);
        setRole(response2.roleId);
  };

  const getLookUpRoles = async () => {
    let response = await UAPI.getAll({}, "roles");
    // console.log(response.data);
    if (typeof variable === "undefined") {
      setLookUpRoles(response.data);
    }
  };

  function addRole() {

    console.log()
    // UAPI.remove(id).then(() => {
    //   setUsers((users) => users.filter((x) => x.id !== id));
    // });
  }

  function deleteUser(id) {
    setUsers(
      users.map((x) => {
        if (x.id === id) {
          x.isDeleting = true;
        }
        return x;
      })
    );
    UAPI.remove(id).then(() => {
      setUsers((users) => users.filter((x) => x.id !== id));
    });
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
      {/* <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add User</Link> */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Name</th>
            <th style={{ width: "30%" }}>Email</th>
            <th style={{ width: "30%" }}>CID</th>
            <th style={{ width: "30%" }}>Mobile</th>
            <th style={{ width: "10%" }}></th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.cid}</td>
                <td>{user.mobile}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {/* <Link to={`/useredit/${user.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link> */}
                  <button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleClickOpen(user.id)}
                    className="btn btn-sm btn-warning mr-1"
                  >
                    อนุมัติ
                  </button>
                  <button
                    onClick={() => clickUserEditlink(user.id)}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
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
          <DialogTitle id="form-dialog-title">
            กำหนดสิทธิใช้งานgggggggggggggg
          </DialogTitle>
          <DialogContent>
            <DialogContentText>กำหนดสิทธิใช้งาน</DialogContentText>
            {console.log(lookuproles, lookuproles.find((option)=>option.id===role), role)}
            {/* {console.log('ffffffff'+getRole)} */}
            <Autocomplete
              id="role"
              size="small"
              fullWidth
              required
              //   defaultValue={{ label: Roles, value: Roles }}
              // value={Role}
              options={lookuproles}
              defaultValue={lookuproles.find((f) => f.id === role)}
              getOptionSelected={(option, value) => value.name === option.name}
              getOptionLabel={(option) => option.name || ""}
              onChange={(e, newValue) => {
                setRole(newValue ? newValue.id : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="สิทธิอนุมัติ"
                  variant="outlined"
                />
              )}
            />
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={handleClose} color="primary">
              ยกเลิก
            </Button>
            <Button variant="outlined" onClick={() => addRole()} color="primary">
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

//export default UserList ;
