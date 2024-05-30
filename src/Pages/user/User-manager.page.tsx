import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash } from '../../assets/icon/trash';
import ListComponent from '../../Components/list.component';

export default function ShowUserPage() {
  const [data, setData] = useState([[
    { name: "Name1" },
    { userName: "userName1" },
    { role: "admin" }
  ],[
    { name: "Name1" },
    { userName: "userName1" },
    { role: "admin" }
  ],[
    { name: "Name1" },
    { userName: "userName1" },
    { role: "admin" }
  ],[
    { name: "Name1" },
    { userName: "userName1" },
    { role: "admin" }
  ],[
    { name: "Name1" },
    { userName: "userName1" },
    { role: "admin" }
  ],[
    { name: "Name1" },
    { userName: "userName1" },
    { role: "admin" }
  ],]);
  const headers = [
    "name",
    "userName",
    "role",
    "action"
  ]

  async function fetchAllUsers() {
    // const result = await axios.get('http://localhost:5000/users')
    // setUsers(result.data)
  }

  useEffect(() => {
    fetchAllUsers();
  }, []);


  return (
    <><ListComponent title="Account Manager" buttonName="Create new account" header={headers} data={data}></ListComponent></>

  )
}
