import React, { useState, useEffect, useMemo, useRef } from "react";
import UserDataService from "../services/UserService";
import { useTable } from "react-table";
//import {Button} from 'reactstrap'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Pagination from "@material-ui/lab/Pagination";

import Swal from 'sweetalert2'

import AddUser from './AddUser'
import User from './User'



const UsersList = (props) => {
  const [users, setUsers] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  //modal
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const usersRef = useRef();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const pageSizes = [5, 10, 15];

  usersRef.current = users;

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const getRequestParams = (searchTitle, page, pageSize) => {
    let params = {};

    if (searchTitle) {
      params["name"] = searchTitle;
    }

    if (page) {
      params["page"] = page;
    }

    if (pageSize) {
      params["per_page"] = pageSize;
    }
    
    return params;
  };

  const retrieveUsers = () => {
    const params = getRequestParams(searchTitle, page, pageSize);

    UserDataService.getAll(params)
      .then((response) => {
        console.log(response.data);
        const { data, meta } = response.data;
        setUsers(data);
        setCount(meta.last_page);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(retrieveUsers, [page, pageSize]);

  const refreshList = () => {
    retrieveUsers();
  };

  const removeAllUsers = () => {
    UserDataService.removeAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    setPage(1);
    retrieveUsers();
  };

  const openUser = (rowIndex) => {
    const id = usersRef.current[rowIndex].id; 
    props.history.push("/users/" + id);
  };

  function deleteUser(rowIndex) {
    const id = usersRef.current[rowIndex].id;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        UserDataService.remove(id)
      .then((response) => {
        props.history.push("/users");
        console.log(response);
        let newUsers = [...usersRef.current];
        newUsers.splice(rowIndex, 1);

        setUsers(newUsers);
      })
      .catch((e) => {
        console.log(e);
      });
      }
    })
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Status",
        accessor: "published",
        Cell: (props) => {
          return props.value ? "Published" : "Pending";
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
       
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
               <IconButton 
              color="primary"
              aria-label="delete" 
              onClick={() => openUser(rowIdx)}
              >
          <EditIcon />
        </IconButton>              
                    
                  {' '}                   
              <IconButton 
              color="secondary"
              aria-label="delete" 
              onClick={() => deleteUser(rowIdx)}
              >
          <DeleteForeverIcon />
        </IconButton>      
            </div>            
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: users,
  });  


  return (
    <div className="list row">
      <div className="col-md-6">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by username"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="col-md-12 list">      

        <table
          className="table"
          {...getTableProps()}
        >
          <thead >
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} >
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-3">
          {"Items per Page: "}
          <select onChange={handlePageSizeChange} value={pageSize}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <Pagination
            className="my-3"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
        </div>
      </div> 
      <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add User</DialogTitle>
        <DialogContent>

         <AddUser 
         setOpen={setOpen}         
         />

        </DialogContent>
        
      </Dialog>
    </div>
  

      {/* <div className="col-md-8">
        <button className="btn btn-sm btn-danger" onClick={removeAllUsers}>
          Remove All
        </button>
      </div> */}
    </div>
  );
};

export default UsersList;
