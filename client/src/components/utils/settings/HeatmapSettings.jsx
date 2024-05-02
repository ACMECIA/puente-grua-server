import React, { Fragment, useEffect, useState } from "react";

import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload, Image, InputNumber } from "antd";
import { Form, Space } from "antd";
import SubmitButton from "../../charts/components/SubmitButton";
import GeneralButton from "../GeneralButton";

export default function HeatmapConfig({
  chartName = "Heatmap config",
  serverType,
  dataPath,
}) {
  const [limits, setLimits] = useState({});
  const [edit, setEdit] = useState(false);
  const fetchGetLimits = () => {
    fetch(`api/settings/heatlimits`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Limits", data);
        setLimits(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchGetLimits();
  }, []);

  const fetchEdit = ({ filters }) => {
    fetch(`api/settings/heatmap`, {
      method: "POST",
      body: JSON.stringify({ filters }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.payload);

        // setPosts(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const [imageSrc, setImageSrc] = useState("/files/uploads/layout.png");

  const props = {
    beforeUpload: (file) => {
      const isPNG = file.type === "image/png";
      if (!isPNG) {
        message.error(`${file.name} no es un archivo png`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      // console.log(info.fileList);
      if (info.fileList[0].status === "done") {
        setImageSrc(`/files/uploads/layout.png?t=${Date.now()}`);
        console.log(`Uploaded successfully`);
      }
    },

    name: "uploaded_file",
    action: `api/${serverType}/${dataPath}`,
    maxCount: 1,
  };

  const onEdit = () => {
    setEdit(true);
  };

  const onCancel = () => {
    setEdit(false);
  };

  const onSubmit = (values) => {
    fetchEdit(values);
    setEdit(false);
  };

  return (
    <Fragment>
      <strong className="text-gray-700 font-medium">{chartName}</strong>
      <div className="overflow:hidden w-full h-full flex flex-col p-4 space-y-4 justify-center items-center mt-5">
        <Image width={250} src={imageSrc} />

        <Upload {...props}>
          <Button icon={<UploadOutlined />}>
            Subir imagen .png (1 MB máx.)
          </Button>
        </Upload>
      </div>
      {/* <CoordinatesLimitsEdit defaultLimits={limits} /> */}
      {/* {edit ? (
        <CoordinatesLimitsEdit
          fetchEdit={fetchEdit}
          defaultLimits={limits}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      ) : (
        <CoordinatesLimitsShow defaultLimits={limits} onEdit={onEdit} />
      )} */}
      {/* <CoordinatesLimitsShow defaultLimits={limits} onEdit={onEdit} />
      <CoordinatesLimitsEdit
        fetchEdit={fetchEdit}
        defaultLimits={limits}
        onCancel={onCancel}
        onSubmit={onSubmit}
      /> */}
    </Fragment>
  );
}
export function CoordinatesLimitsShow({ defaultLimits, onEdit }) {
  // write simple code to show 4 values that are in the defaultLimits json, and has
  // minLat, maxLat, minLong, maxLong
  return (
    <Fragment>
      <div className="overflow:hidden w-full h-full">
        <div className="flex flex-col">
          <div>
            <div className="flex flex-row">
              <div className="w-full">
                <strong className="text-gray-600 font-medium">
                  Coordenadas
                </strong>
                <div className="flex flex-row gap-4 mt-4 justify-center items-center">
                  <div className="flex flex-col justify-center items-center">
                    <strong className="text-black-700  ">Latitud</strong>
                    <p className="text-black-700 text-justify ">
                      <span className="text-komatsu-blue-light">Mínima:</span>{" "}
                      {defaultLimits.minLat} <br />
                      <span className="text-komatsu-blue">Máxima:</span>{" "}
                      {defaultLimits.maxLat}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <strong className="text-black-700 ">Longitud</strong>
                    <p className="text-black-700 text-justify ">
                      <span className="text-komatsu-blue-light">Mínima:</span>{" "}
                      {defaultLimits.minLon} <br />
                      <span className="text-komatsu-blue">Máxima:</span>{" "}
                      {defaultLimits.maxLon}
                    </p>
                  </div>
                </div>
                {/* <div className="flex flex-row justify-center py-2">
                  <GeneralButton onClickFunction={onEdit}>Editar</GeneralButton>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export function CoordinatesLimitsEdit({ fetchEdit, defaultLimits, onCancel }) {
  return (
    <Fragment>
      <div className="overflow:hidden w-full h-full p-4">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex flex-col gap-4">
              <FormFilter
                formName="LatLongFilter"
                fetchData={fetchEdit}
                defaultLimits={defaultLimits}
              />
              <div className="flex justify-center items-center">
                {/* <GeneralButton
                  color="komatsu-blue-light"
                  width={"50%"}
                  onClickFunction={onCancel}
                >
                  Cancelar
                </GeneralButton> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export function FormFilter({
  width = "70%",
  formName,
  fetchData,
  defaultLimits,
}) {
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const config = {
    rules: [
      {
        type: "string",
        required: true,
        message: "Seleccione un estado",
      },
    ],
  };
  const rangeConfig = {
    rules: [
      {
        type: "array",
        required: true,
        message: "Seleccione un rango",
      },
    ],
  };
  const onFinish = (fieldsValue) => {
    // Should format date value before submit.
    console.log("here");
    console.log(fieldsValue);
    const values = {
      ...fieldsValue,
      latitudeRange: fieldsValue["latitude-range"],
      longitudeRange: fieldsValue["longitude-range"],
    };

    fetchData({ filters: values });
    console.log("Received values of form: ", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name={formName}
      {...formItemLayout}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ width: "100%" }}
    >
      <Form.Item name="latitude-range" label="Latitud (x)" {...rangeConfig}>
        <NumberRange
          label1={"latitud mínima"}
          label2={"latitud máxima"}
          units={"Ton."}
          width={width}
        />
      </Form.Item>

      <Form.Item name="longitude-range" label="Longitud (y)" {...rangeConfig}>
        <NumberRange
          label1={"longitud mínima"}
          label2={"longitud máxima"}
          units={"Ton."}
          width={width}
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

export function NumberRange({
  label1,
  label2,
  units,
  width,
  value,
  onChange,
  default1,
  default2,
}) {
  const on1Change = (val) => {
    const current = value ? [...value] : [];
    current[0] = val === null ? 0 : val;
    onChange(current);
  };

  const on2Change = (val) => {
    const current = value ? [...value] : [];
    current[1] = val === null ? 0 : val;
    onChange(current);
  };

  // const onSubmit = () => {
  //   if (value[0] > value[1]) {
  //     alert("El valor inicial no puede ser mayor al valor final");
  //     return;
  //   }

  // };
  console.log("defaultvalue", default1);

  return (
    <Space.Compact block style={{ width: width }}>
      <InputNumber
        placeholder={label1}
        style={{ width: "100%" }}
        defaultValue={default1}
        min="-180"
        max="180"
        step="0.00001"
        // formatter={(value) =>
        //   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        // }
        // parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        onChange={on1Change}
        value={value ? value[0] : null}
      />
      <InputNumber
        // addonAfter={units}
        placeholder={label2}
        style={{ width: "100%" }}
        defaultValue={default2}
        min="-180"
        max="180"
        step="0.00001"
        // min={0}
        // max={100}
        // formatter={(value) => `${value} Ton.`}
        // parser={(value) => value.replace("Ton.", "")}
        onChange={on2Change}
        value={value ? value[1] : null}
      />
    </Space.Compact>
  );
}
