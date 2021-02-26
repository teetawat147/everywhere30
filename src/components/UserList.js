/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link,useHistory } from 'react-router-dom';
// import  UserService from '../services/UniversalAPI';
import UAPI from "../services/UniversalAPI";

export default function UserList(props) {
// function UserList({props, match }) {
    // const { path } = match;
    const [users, setUsers] = useState(null);
    const history = useHistory();
    
    const getTeamuser = async () => {
        let response = await UAPI.getAll({},'teamusers');
         console.log(response.data);
        setUsers(response.data);
      }

    useEffect(() => {
       getTeamuser();
        // UAPI.getAll({},'teamusers').then(x => setUsers(x.data));
    //     // console.log(users)
    }, []);

    const clickUserEditlink = (x) => {
        // console.log(x)
        if (typeof x !== 'undefined') {
          if (x !== null) {
            history.push({ pathname: '/useredit', state: {status: x} });
          }
        }
      }

    function deleteUser(id) {
        setUsers(users.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        UAPI.remove(id).then(() => {
            setUsers(users => users.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Users</h1>
            <button onClick={() => clickUserEditlink("newadd")}className="btn btn-sm btn-success mb-2">Add User</button>
            {/* <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add User</Link> */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Name</th>
                        <th style={{ width: '30%' }}>Email</th>
                        <th style={{ width: '30%' }}>CID</th>
                        <th style={{ width: '30%' }}>Mobile</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map(user =>
                        <tr key={user.id}>
                            <td>{user.fullname}</td>
                            <td>{user.email}</td>
                            <td>{user.cid}</td>
                            <td>{user.mobile}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                {/* <Link to={`/useredit/${user.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link> */}
                                <button onClick={() => clickUserEditlink(user.id)}className="btn btn-sm btn-warning mr-1">อนุมัติ</button>
                                <button onClick={() => clickUserEditlink(user.id)}className="btn btn-sm btn-primary mr-1">แก้ไข</button>
                                <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                    {user.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>ลบ</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!users &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {users && !users.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Users To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

//export default UserList ;