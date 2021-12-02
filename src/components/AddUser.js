import React, { useState } from "react";
import UserDataService from "../services/UserService";
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';


const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(6),
  },
}));

const AddUser = ({setOpen}) => {
  const classes = useStyles();
  const initialUserState = {
    id: null,
    username: "",
    name: "",
    published: false
  };
  const [tutorial, setUser] = useState(initialUserState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...tutorial, [name]: value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveUser = () => {
    var data = {
      username: tutorial.username,
      name: tutorial.name
    };

    UserDataService.create(data)
      .then(response => {
        setUser({
          id: response.data.id,
          username: response.data.username,
          name: response.data.name,
          published: response.data.published
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newUser = () => {
    setUser(initialUserState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newUser}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              required
              value={tutorial.username}
              onChange={handleInputChange}
              name="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={tutorial.name}
              onChange={handleInputChange}
              name="name"
            />
          </div>

              <Button
                 className={classes.button}
                 onClick={saveUser}
                 variant="contained"
                 color="primary"
                 size="small"
                 startIcon={<SaveIcon />}
                >
                    Save
              </Button>

          <Button 
              onClick={handleClose}
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<CancelIcon />}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
