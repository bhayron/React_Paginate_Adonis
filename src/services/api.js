import axios from "axios";

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJkODUwNjg4OS1jNzdkLTQwM2QtYTg2Yy1hM2UyNjk3ZjAyMGEiLCJpYXQiOjE2MzY1NjU0MjN9.a0rLL8xNbsUme9Q7Z8IdbLI1nABnnH1NhROfzsJVhjs';


const url = "http://localhost:3333";

export default axios.create({
  baseURL: url,
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-type": "application/json"
  }
});