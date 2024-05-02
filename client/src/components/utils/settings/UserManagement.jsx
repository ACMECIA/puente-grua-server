import { chart } from "highcharts";
import React, { Fragment, useCallback, useMemo } from "react";
import { useState, useEffect } from "react";
import GeneralButton from "../GeneralButton";
import SubmitButton from "../../charts/components/SubmitButton";
import { Checkbox, ConfigProvider, Form, Input, Button } from "antd";
import "../../../index.css";

export default function UserManagement({ chartName, serverType, dataPath }) {
  const [isFetching, setIsFetching] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);

  const [users, setUsers] = useState([]);

  const fetchData = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(`api/${serverType}/${dataPath}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUsers(data);
          setIsFetching(false);

          // setPosts(data);
        })
        .catch((err) => {
          console.log(err.message);
          setIsFetching(false);
        });
    }
  };

  const fetchDelete = (selectedUsers) => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(`api/${serverType}/${dataPath}/delete`, {
        method: "POST",
        body: JSON.stringify({ selectedUsers }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          fetchData();
          setIsFetching(false);

          // setPosts(data);
        })
        .catch((err) => {
          console.log(err.message);
          setIsFetching(false);
        });
    }
  };

  const fetchAdd = async (values) => {
    console.log(values);
    if (!isFetching) {
      setIsFetching(true);
      const res = await fetch(`api/${serverType}/${dataPath}/add`, {
        method: "POST",
        body: JSON.stringify({ values }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.message) {
        alert(data.message);
      }
      if (res.ok) {
        fetchData();
        setIsFetching(false);
        setAddUser(false);
        setDeleteUser(false);

        // setPosts(data);
      } else {
        // console.log(err.message);
        setIsFetching(false);
      }
    }
  };

  useEffect(() => {
    // Ejecutar fetchData inicialmente
    fetchData();
  }, []);

  const onAdd = () => {
    setAddUser(true);
    setDeleteUser(false);
  };

  const onDel = () => {
    setAddUser(false);
    setDeleteUser(true);
  };

  const onCancel = () => {
    setAddUser(false);
    setDeleteUser(false);
  };
  const onSumbitDelete = (selectedUsers) => {
    setAddUser(false);
    setDeleteUser(false);
    // console.log(selectedUsers);
    fetchDelete(selectedUsers);
    //Something else that updates the database
  };

  const onSumbitAdd = (values) => {
    // setAddUser(false);
    // setDeleteUser(false);
    // console.log(values);

    fetchAdd(values);
    //Something else that updates the database
  };

  return (
    <Fragment>
      <strong className="text-gray-700 font-medium">{chartName}</strong>
      <div className="overflow:hidden w-full h-full p-4">
        {addUser ? (
          <AddUser onCancel={onCancel} onSubmit={onSumbitAdd} />
        ) : deleteUser ? (
          <DeleteUser
            users={users}
            onCancel={onCancel}
            onSubmit={onSumbitDelete}
          />
        ) : (
          <UsersTable users={users} onAdd={onAdd} onDel={onDel} />
        )}
      </div>
    </Fragment>
  );
}

function UsersTable({ users, onAdd, onDel }) {
  return (
    <div className="mt-3">
      <table className="w-full text-grey-700 border-x border-gray-200 rounded-sm">
        <thead>
          <tr>
            <td>Emails</td>
            <td>Reportes</td>
            <td>Alertas</td>
          </tr>
        </thead>
        <tbody>
          {users.map((row) => (
            <tr key={row.id}>
              <td>{row.email}</td>
              <td>{row.reports ? "Habilitado" : "No Habilitado"}</td>
              <td>{row.alerts ? "Habilitado" : "No Habilitado"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-row justify-center py-2 space-x-2">
        <GeneralButton onClickFunction={onDel}>Eliminar </GeneralButton>
        <GeneralButton onClickFunction={onAdd}>Añadir </GeneralButton>
      </div>
    </div>
  );
}

function AddUser({ onCancel, onSubmit }) {
  // const onFinish = (values) => {
  //   console.log("Success:", values);
  // };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex justify-center items-center">
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 500,
        }}
        initialValues={{
          reports: false,
          alerts: false,
        }}
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Correo"
          name="mail"
          rules={[
            {
              required: true,
              message: "Ingrese el correo",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Ingrese un nombre de usuario",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Ingrese la contraseña",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label="Reportes" name="reports" valuePropName="checked">
          <div className="flex flex-row py-2 space-x-2">
            <Checkbox />
            <label className="text-gray-500">
              {" "}
              (Envio de reportes por correo)
            </label>
          </div>
        </Form.Item>

        <Form.Item label="Alertas" name="alerts" valuePropName="checked">
          <div className="flex flex-row py-2 space-x-2">
            <Checkbox />
            <label className="text-gray-500">
              {" "}
              (Envio de alertas por correo)
            </label>
          </div>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <div className="flex flex-row justify-center py-2 space-x-2">
            <GeneralButton
              color="komatsu-blue-light"
              width={"40%"}
              onClickFunction={onCancel}
            >
              Cancelar
            </GeneralButton>
            <SubmitButton width="40%">Añadir</SubmitButton>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

function DeleteUser({ users, onCancel, onSubmit }) {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const onCheckboxChange = useCallback(
    (e) => {
      // console.log(e.target["data-id"]);
      e.target.checked
        ? setSelectedUsers((oldData) => [...oldData, e.target["data-id"]])
        : setSelectedUsers((oldData) =>
            oldData.filter((id) => id !== e.target["data-id"])
          );
    },
    [setSelectedUsers]
  );

  const onSubmitClicked = useCallback(() => {
    onSubmit(selectedUsers);
  }, [onSubmit, selectedUsers]);

  return (
    <div className="mt-3">
      <table className="w-full text-grey-700 border-x border-gray-200 rounded-sm">
        <thead>
          <tr>
            <td>Emails</td>
            <td>Seleccionar</td>
          </tr>
        </thead>
        <tbody>
          {users.map((row) => (
            <tr key={row.id}>
              <td>{row.email}</td>
              <td>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#e74c4c",
                    },
                  }}
                >
                  <Checkbox onChange={onCheckboxChange} data-id={row.id} />
                </ConfigProvider>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-row justify-center py-2 space-x-2">
        <GeneralButton
          color="komatsu-blue-light"
          // width={"50%"}
          onClickFunction={onCancel}
        >
          Cancelar
        </GeneralButton>
        <GeneralButton onClickFunction={onSubmitClicked}>
          Eliminar
        </GeneralButton>
      </div>
    </div>
  );
}
