import React from "react";
import { useState, useEffect } from "react";
import { Fragment } from "react";
import { Button, message, Upload, Image, InputNumber } from "antd";
import { Form, Space } from "antd";
import SubmitButton from "../../charts/components/SubmitButton";

const AlertsSettings = ({
  chartName = "Titulo del box",
  serverType,
  dataPath,
}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState({});

  const fetchData = async () => {
    if (!isFetching) {
      try {
        setIsFetching(true);

        const response = await fetch(`api/settings/mant-prevs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // if (response.status === 204) {
        //   alert("No hay datos en el rango de fechas seleccionado");
        //   setIsFetching(false);
        //   return;
        // }

        const data = await response.json();
        setData(data);
        console.log(data);

        setIsFetching(false);
      } catch (err) {
        console.log(err);
        setIsFetching(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmitForm = () => {
    fetchData();
  };

  return (
    <Fragment>
      <strong className="text-gray-700 font-medium">{chartName}</strong>
      <div className="w-full">
        <ul className="list-none pl-4 mb-2 text-black text-center">
          <li>
            <span className="text-komatsu-blue">
              Mantenimiento preventivo 1
            </span>
            : {data.prev1} horas
          </li>
          <li>
            <span className="text-komatsu-blue-light">
              Mantenimiento preventivo 2
            </span>
            : {data.prev2} horas
          </li>
          <li>
            <span className="text-gray-600">Mantenimiento preventivo 3</span>:{" "}
            {data.prev3} horas
          </li>
        </ul>
      </div>

      <strong className="text-gray-700 font-medium mt-2">Edición</strong>

      <div className="flex flex-col items-center justify-center w-full pl-40">
        <FormFilter formName={"HorasMantenimiento"} onSubmit={onSubmitForm} />
      </div>
    </Fragment>
  );
};

export default AlertsSettings;

export function FormFilter({ width = "50%", formName, onSubmit }) {
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = async ({ values }) => {
    if (!isFetching) {
      try {
        setIsFetching(true);

        const response = await fetch("/api/settings/alerts", {
          method: "POST",
          body: JSON.stringify({ values }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response;

        console.log(data);

        setIsFetching(false);
      } catch (err) {
        console.log(err);
        setIsFetching(false);
      }
    }
  };

  const numberConfig = {
    rules: [
      {
        type: "number",
        required: true,
        message: "Introduzca las horas",
      },
    ],
  };
  const onFinish = (fieldsValue) => {
    // Should format date value before submit.
    console.log("here");
    console.log(fieldsValue);
    const values = {
      ...fieldsValue,
    };

    fetchData({ values });

    onSubmit();
    console.log("Received values of form: ", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name={formName}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      //   style={{ width: width }}
    >
      <Form.Item
        name="prev1"
        label="Mantenimiento Preventivo 1"
        {...numberConfig}
      >
        <InputNumber
          placeholder="horas"
          style={{ width: width }}
          min="1"
          max="100000"
          step="1"
        />
      </Form.Item>

      <Form.Item
        name="prev2"
        label="Mantenimiento Preventivo 2"
        {...numberConfig}
      >
        <InputNumber
          placeholder="horas"
          style={{ width: width }}
          min="1"
          max="100000"
          step="1"
        />
      </Form.Item>

      <Form.Item
        name="prev3"
        label="Mantenimiento Preventivo 3"
        {...numberConfig}
      >
        <InputNumber
          placeholder="horas"
          style={{ width: width }}
          min="1"
          max="100000"
          step="1"
        />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 16, offset: 8 },
        }}
      >
        <SubmitButton width={width}> Actualizar </SubmitButton>
      </Form.Item>
    </Form>
  );
}
