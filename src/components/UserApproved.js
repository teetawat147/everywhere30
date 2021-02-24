import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Form from "react-validation/build/form";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckButton from "react-validation/build/button";
// import { isEmail } from "validator";
import { useHistory } from "react-router-dom";
import * as AuthService from "../services/auth.service";
import UAPI from "../services/UniversalAPI";

import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Link,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
  Button,
} from "@material-ui/core";
import {
  Edit as EditIcon,
  AddCircle as AddCircleIcon,
} from "@material-ui/icons";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
}));

export default function RegisterList() {
  const classes = useStyles();
  const [RegisterListData, setRegisterListData] = useState([]);

  const history = useHistory();

  useEffect(() => {
    loadre();
  }, []);

  const loadre = () => {
    // setIsLoading(true);
    const getTeamuser = async () => {
      let response = await UAPI.getAll(
        { filter: { where: { id: "6024a161b5112de5756b42c1" } } },
        "teamusers"
      );
      console.log(response.data);
      setRegisterListData(response.data);
    };    
    getTeamuser();
  };
  const handleEditIconClick = (id) => {
    navigateToRegisterAdd({ form_status: "edit", id: id });
  };

  const navigateToRegisterAdd = (x) => {
    console.log(x);
    // history.push({
    //   pathname: "/sakhonclinic/registerAdd",
    //   // search: '?query=abc',
    //   state: x,
    // });
  };

  return (
    <Card>
      <CardContent className={classes.form}>
        <div style={{ width: "100%", textAlign: "right" }}>
          <Button
            onClick={() => {
             // history.push({ pathname: "/sakhonclinic/registerAdd" });
            }}
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
          >
            เพิ่ม
          </Button>
        </div>

        <div className={classes.divA}>
          <List>
            {RegisterListData.map((item, i) => (
              <div key={i}>
                <ListItem alignItems="flex-start" className={classes.ListItem}>
                  <ListItemAvatar>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.fname + " " + item.lname}
                    secondary={
                      "ตำแหน่ง :" +
                      " " +
                      (item.position ? item.position : "ว่าง") +
                      " " +
                      "|" +
                      " " +
                      "สถานะผู้ใช้งาน :" +
                      " " +
                      (item.name_th ? item.name_th : "ว่าง")
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => handleEditIconClick(item.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </div>
      </CardContent>
    </Card>
  );
}
