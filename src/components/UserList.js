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
  const [userroleid, setUserRoleId] = useState({});
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const [currentRoleMapping, setCurrentRoleMapping] = useState({});
  
  
  const [userData, setUserData] = useState({});

  const handleClickRole = (x) => {
    setOpen(true);
    console.log(x)

        if (x.RoleMapping.length>0) {
            setCurrentRoleMapping(x.RoleMapping[0])
            console.log(x.RoleMapping[0].roleId)
            setCurrentRoleId(x.RoleMapping[0].roleId)
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
              }
            }
          }
        }
      };
    
    let response = await UAPI.getAll(xParams, "teamusers");
 console.log(response.data);
    setUsers(response.data);
  };

  useEffect(() => {
    getTeamuser();


    getLookUpRoles();
  }, []);
//   console.log( currentUser );
//   console.log( currentUser.user );
  // console.log( currentUser.user.role )

  useEffect(() => {
    console.log(props.location.state);
    if (typeof props.location.state !== 'undefined') {
      if (typeof props.location.state.status !== 'undefined') {
        setUserData(props.location.state.status);
      }
    }
  }, [props.location]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const clickUserEditlink = (x) => {
    // console.log(x)
    if (typeof x !== "undefined") {
      if (x !== null) {
        history.push({ pathname: "/useredit", state: { status: x } });
      }
    }
  };


  const getLookUpRoles = async () => {
    let response = await UAPI.getAll({}, "roles");
    // console.log(response.data);
    // if (typeof variable === "undefined") {
    //   setLookUpRoles(response.data);
    // }
    if (response.status === 200) {
        if (response.data) {
          if (response.data.length>0) {
            setLookUpRoles(response.data);
          }
        }
      }
  };

  const getAutoDefaultValueRole = (x) => {
    console.log(currentRoleId);
    let r=null;
    lookuproles.forEach(i => {
      if (i.id === x) {
        r=i;
      }
    });
    return r;
  }

  function addRole() {

    if (typeof currentRoleMapping.id!=='undefined') {
        UAPI.patch(currentRoleMapping.id,currentRoleMapping,'rolemappings').then(
            (response) => {
              if (response.status === 200) {
                alert("สำเร็จ");
              }
               console.log(response);
              // setMessage(response.data.message);
              // setSuccessful(true);
            },
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
    
              // setMessage(resMessage);
              // setSuccessful(false);
            }
          );
    }else{
        console.log({"principalType": "USER","principalId": userroleid,"roleId": currentRoleMapping.roleId})
    UAPI.create({"principalType": "USER","principalId": userroleid,"roleId": currentRoleMapping.roleId},'rolemappings').then(
        (response) => {
          if (response.status === 200) {
            alert("สำเร็จ");
            handleClose()
          }
           console.log(response);
          // setMessage(response.data.message);
          // setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          // setMessage(resMessage);
          // setSuccessful(false);
        }
      );
    }
    handleClose()
    getTeamuser();
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
            <th style={{ width: "30%" }}>สิทธิการใช้งาน</th>
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
                <td>{user.RoleMapping.length>0 ? user.RoleMapping[0].role.name : ""}</td>
                <td>{user.mobile}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {/* <Link to={`/useredit/${user.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link> */}
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
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            กำหนดสิทธิใช้งานgggggggggggggg
          </DialogTitle>
          <DialogContent>
            <DialogContentText>กำหนดสิทธิใช้งาน</DialogContentText>
            {console.log(lookuproles, lookuproles.find((option)=>option.id===role), role)}
            {/* {console.log('ffffffff'+getRole)} */}
            {/* <Autocomplete
              id="role"
              size="small"
              fullWidth
              required
              //   defaultValue={{ label: Roles, value: Roles }}
              // value={Role}
              options={lookuproles}
            //   defaultValue={lookuproles.find((f) => f.id === role)}
              defaultValue={getRoleDV(userData['changewat'])}
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
            /> */}
            <div className="form-group">
          {/* {console.log(
            lookupchangewats,
            lookupchangewats.find(
              (option) => option.changwatname === changewat
            ),
            changewat
          )} */}
          {/* {console.log(lookupRoles, lookupRoles.find((option)=>option.changwatname===getRole), getRole)} */}
          {/* {lookuproles.length > 0 && ( */}
            <Autocomplete
              id="changewat"
              size="small"
              fullWidth
              required
              options={lookuproles}
            //   value={currentRoleId}
            defaultValue={getAutoDefaultValueRole(currentRoleId)}
              getOptionSelected={(option, value) =>
                value.name === option.name
              }
              getOptionLabel={(option) => option.name || ""}
              onChange={(e, newValue) => {
                  console.log(newValue.id)
                let x=currentRoleMapping;
                x['roleId']=newValue.id;
                setCurrentRoleMapping({...currentRoleMapping,...x});  
              }}
              renderInput={(params) => (
                <TextField {...params} label="จังหวัด" variant="outlined" />
              )}
            />
          {/* )} */}
        </div>
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={handleClose} color="primary">
              ยกเลิก
            </Button>
            <Button variant="outlined" onClick={() => addRole()} color="primary">
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

//export default UserList ;
