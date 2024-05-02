import React, { Fragment, useEffect, useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
import "../../../index.css";

// const originData = [];
// for (let i = 0; i < 5; i++) {
//   originData.push({
//     key: i.toString(),
//     name: `Edward ${i}`,
//     type: "status",
//     value: `London Park no. ${i}`,
//   });
// }
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Inserte un ${title}`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function GeneralSettings({ chartName, serverType, dataPath }) {
  const [isFetching, setIsFetching] = useState(false);
  const [originData, setOriginData] = useState([]);
  // let originData = [];
  const fetchData = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(`api/${serverType}/${dataPath}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          let array = data.map((element) => ({
            key: element.id.toString(),
            name: element.name,
            type: element.type,
            value: element.json,
          }));
          // Relizar lo mismo de arriba pero con el setOriginData
          setOriginData(array);

          // console.log("data nueva", originData);
          setIsFetching(false);

          // setPosts(data);
        })
        .catch((err) => {
          console.log(err.message);
          setIsFetching(false);
        });
    }
  };

  const fetchEdit = (values) => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(`api/${serverType}/${dataPath}/edit`, {
        method: "POST",
        body: JSON.stringify({ values }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log("received", data);
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

  const onEdit = (values) => {
    // setAddUser(false);
    // setDeleteUser(false);
    console.log(values);

    fetchEdit(values);
    //Something else that updates the database
  };

  useEffect(() => {
    // Ejecutar fetchData inicialmente
    fetchData();
  }, []);

  return (
    <Fragment>
      <strong className="text-gray-700 font-medium">{chartName}</strong>
      <div className="overflow:hidden w-full h-full p-4">
        <GeneralSettingsTable originData={originData} onEdit={onEdit} />
      </div>
    </Fragment>
  );
}

function GeneralSettingsTable({ originData, onEdit }) {
  const [form] = Form.useForm();
  const [data, setData] = useState([...originData]);
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    // Ejecutar fetchData inicialmente
    setData(originData);
  }, [originData]);

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      type: "",
      value: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];

        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
      //Added
      onEdit(newData[index]);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Tipo",
      dataIndex: "type",
      width: "20%",
      editable: false,
    },
    {
      title: "Nombre",
      dataIndex: "name",
      width: "20%",
      editable: false,
    },

    {
      title: "Valor",
      dataIndex: "value",
      width: "35%",
      editable: true,
    },
    {
      title: "Edición",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Cancelar?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        // inputType: col.dataIndex === "age" ? "number" : "text",
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
}
