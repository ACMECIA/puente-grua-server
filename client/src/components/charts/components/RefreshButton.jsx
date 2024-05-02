import { Button } from "antd";
import React, { Fragment } from "react";
import { ConfigProvider } from "antd";
import { websiteColors } from "../../lib/utils/colors";

export default function RefreshButton({ onClickFunction, width = "25%" }) {
  return (
    <Fragment>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: websiteColors["komatsu-blue-h"],
          },
        }}
      >
        <Button
          type="primary"
          onClick={onClickFunction}
          style={{ width: width }}
        >
          Actualizar
        </Button>
      </ConfigProvider>
    </Fragment>
  );
}
