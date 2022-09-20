import React from 'react'
import { useState } from "react";
import { Form } from 'semantic-ui-react'
import { toast } from "react-toastify";

export function ViewDetails() {
  const [formData, setFormData] = useState({
    "appName": "",
  });

  const handleFormChange = (e, formValue) => {
    formData[formValue["id"]] = formValue["value"]
    setFormData(formData)
  }

  const validateAndSubmitRequest = () => {
    var hasError = false;
    var message = "";
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        hasError = true
        message = `Please fill ${key} before continuing`
      }
    }
    if (hasError) {
      toast.error(`Found Empty field ${message}`, {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      console.log("call api to register")
      // applicationRegisteration(formData)
    }
  }

  return (
    <React.Fragment>
      <Form>
        <Form.Input required fluid onChange={handleFormChange} id="appName" label='Application Name' placeholder="unregistered app-name i.e. service-name" />
        <Form.Button onClick={validateAndSubmitRequest}> Submit </Form.Button>
      </Form>
    </React.Fragment>
  )
}