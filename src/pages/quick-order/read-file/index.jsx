import React, { Component } from "react";

import { CSVReader } from "react-papaparse";
import { api, defaultAxios } from "../../../environment/api";
import errorNotification from "../../../utils/errorNotification";
import { Button } from "antd";

const buttonRef = React.createRef();

export default class ReadFile extends Component {
  handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  handleOnFileLoad = (data) => {
    data.forEach(function (obj, index) {
      if (index > 0 && obj.data[0] != "") {
        console.log(index, obj.data);

        let sendData = {
          method: Number(obj.data[0]), // BUY = 0, SELL = 1
          price: Number(obj.data[1]),
          quantity: Number(obj.data[2]),
          priceType: Number(obj.data[3]), // MARKET = 0, LIMIT = 1
          timeRestriction: Number(obj.data[4]), // ROD = 0, IOC = 1, FOK = 2
          virtualOrderContainerId: Number(obj.data[6]),
          delay: Number(obj.data[7]),
        };

        if (obj.data[5] == "0") {
          sendData = {
            method: Number(obj.data[0]), // BUY = 0, SELL = 1
            price: Number(obj.data[1]),
            quantity: Number(obj.data[2]),
            priceType: Number(obj.data[3]), // MARKET = 0, LIMIT = 1
            timeRestriction: Number(obj.data[4]), // ROD = 0, IOC = 1, FOK = 2
            virtualOrderContainerId: Number(obj.data[6]),
            delay: Number(obj.data[7]),
            subMethod: Number(obj.data[5]),
          };
        }

        // 限價單
        defaultAxios({
          url: api.postVirtualOrder.url,
          method: api.postVirtualOrder.method,
          data: sendData,
        })
          .then((res) => {
            // setData(res.data);
          })
          .catch((err) => {
            errorNotification(err?.response?.data);
          });
      }
    });
  };

  handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  handleOnRemoveFile = (data) => {
    console.log(data);
  };

  handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  render() {
    return (
      <CSVReader
        ref={buttonRef}
        onFileLoad={this.handleOnFileLoad}
        onError={this.handleOnError}
        noClick
        noDrag
        onRemoveFile={this.handleOnRemoveFile}
      >
        {({ file }) => (
          <aside
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: 10,
            }}
          >
            <Button
              type="primary"
              onClick={this.handleOpenDialog}
              style={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                width: "40%",
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              匯入情境(.csv)
            </Button>
            <div
              style={{
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#ccc",
                height: 32,
                lineHeight: 1.75,
                marginTop: 0,
                marginBottom: 5,
                paddingLeft: 13,
                paddingTop: 3,
                width: "60%",
              }}
            >
              {file && file.name}
            </div>
            <Button
              type="primary"
              danger
              style={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                paddingLeft: 20,
                paddingRight: 20,
              }}
              onClick={this.handleRemoveFile}
            >
              Remove
            </Button>
          </aside>
        )}
      </CSVReader>
    );
  }
}
