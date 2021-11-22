import React, { useState } from "react";
import UserDataService from "../services/UserService";

const AddUser = () => {
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
            <label htmlFor="username">username</label>
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
            <label htmlFor="name">name</label>
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

          <button onClick={saveUser} className="btn btn-success">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
