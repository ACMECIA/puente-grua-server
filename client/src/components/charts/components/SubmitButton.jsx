import { Button } from "antd";
import React, { Fragment } from "react";
import { ConfigProvider } from "antd";
import { websiteColors } from "../../lib/utils/colors";

export default function RefreshButton({ children, width = "20%" }) {
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
          // onClick={onClickFunction}
          style={{ width: width }}
          htmlType="submit"
        >
          {children}
        </Button>
      </ConfigProvider>
    </Fragment>
  );
}
