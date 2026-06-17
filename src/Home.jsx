import { useEffect, useState } from "react"
import axios from "axios"


function Home() {

  const [employees, setEmployees] = useState([])

  // =====================================================
  // ADD EMPLOYEE STATES
  // =====================================================

  const [employeeName, setEmployeeName] = useState("")

  const [role, setRole] = useState("")

  // =====================================================
  // UPDATE STATES
  // =====================================================

  const [editId, setEditId] = useState(null)

  const [editName, setEditName] = useState("")

  const [editRole, setEditRole] = useState("")

  // =====================================================
  // GET DATA
  // =====================================================

  const getData = async () => {

    try {

      const response = await axios.get(
        "https://employee-management-backend-rj6x.onrender.com/api/todo/employee"
      )

      setEmployees(response.data)

    } catch (error) {

      console.log(error)

      alert("Error Loading Data")
    }
  }

  // =====================================================
  // ADD EMPLOYEE
  // =====================================================

  const handleAddEmployee = async () => {

    if (employeeName === "" || role === "") {

      alert("Please Fill All Fields")

      return
    }

    const newEmployee = {

      employeeName: employeeName,

      role: role
    }

    try {

      await axios.post(
        "https://employee-management-backend-rj6x.onrender.com/api/todo/employee",
        newEmployee
      )

      alert("Employee Added")

      setEmployeeName("")

      setRole("")

      getData()

    } catch (error) {

      console.log(error)

      alert("Insert Failed")
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    try {

      await axios.delete(
        `https://employee-management-backend-rj6x.onrender.com/api/todo/employee/${id}`
      )

      alert("Employee Deleted")

      getData()

    } catch (error) {

      console.log(error)

      alert("Delete Failed")
    }
  }

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (employee) => {

    setEditId(employee.id)

    setEditName(employee.employeeName)

    setEditRole(employee.role)
  }

  // =====================================================
  // UPDATE
  // =====================================================

  const handleUpdate = async () => {

    const updatedEmployee = {

      id: editId,

      employeeName: editName,

      role: editRole
    }

    try {

      await axios.put(
        "https://employee-management-backend-rj6x.onrender.com/api/todo/employee",
        updatedEmployee
      )

      alert("Employee Updated")

      setEditId(null)

      setEditName("")

      setEditRole("")

      getData()

    } catch (error) {

      console.log(error)

      alert("Update Failed")
    }
  }

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    getData()

  }, [])

  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      style={{
        padding: "20px",
        fontFamily: "Arial"
      }}
    >

      <h1>Employee Management</h1>

      {/* ===================================================== */}
      {/* ADD EMPLOYEE FORM */}
      {/* ===================================================== */}

      <div
        style={{
          marginBottom: "20px"
        }}
      >

        <input
          type="text"
          placeholder="Enter Employee Name"
          value={employeeName}
          onChange={(e) =>
            setEmployeeName(e.target.value)
          }
          style={{
            padding: "8px",
            marginRight: "10px"
          }}
        />

        <input
          type="text"
          placeholder="Enter Role"
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          style={{
            padding: "8px",
            marginRight: "10px"
          }}
        />

        <button
          onClick={handleAddEmployee}
          style={{
            padding: "8px 15px",
            cursor: "pointer"
          }}
        >
          Add Employee
        </button>

      </div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          width: "100%"
        }}
      >

        <thead>

          <tr>

            <th>Id</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {
            employees.map((employee) => (

              <tr key={employee.id}>

                <td>{employee.id}</td>

                <td>

                  {
                    editId === employee.id ? (

                      <input
                        type="text"
                        value={editName}
                        onChange={(e) =>
                          setEditName(e.target.value)
                        }
                      />

                    ) : (

                      employee.employeeName
                    )
                  }

                </td>

                <td>

                  {
                    editId === employee.id ? (

                      <input
                        type="text"
                        value={editRole}
                        onChange={(e) =>
                          setEditRole(e.target.value)
                        }
                      />

                    ) : (

                      employee.role
                    )
                  }

                </td>

                <td>

                  {
                    editId === employee.id ? (

                      <button
                        onClick={handleUpdate}
                      >
                        Save
                      </button>

                    ) : (

                      <button
                        onClick={() =>
                          handleEdit(employee)
                        }
                      >
                        Update
                      </button>
                    )
                  }

                  <button
                    onClick={() =>
                      handleDelete(employee.id)
                    }
                    style={{
                      marginLeft: "10px"
                    }}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))
          }

        </tbody>

      </table>

    </div>
  )
}

export default Home