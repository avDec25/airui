import React from 'react'
import { Form } from 'semantic-ui-react'
import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useMutation } from 'react-query';

const backend_service = process.env.NEXT_PUBLIC_AIRBUS_SERVICE_SUPPORT

const onboardApplication = (formData: { [key: string]: string }) => {
  const promise = axios.post(`${backend_service}/secured/onboard-application?registerWithAirbus=${formData['registerLegacy']}`, formData)
  toast.promise(
    promise,
    {
      pending: 'Onboarding Application',
      success: {
        render({ data }) {
          return data?.data.message
        }
      },
      error: {
        render({ data }) {
          console.log(data);
          return data?.response.data.message
        }
      }
    }
  );
  return promise
}


export function OnBoardApplication() {
  const session = useSession();
  const userEmail = session.data?.user?.email;
  const mutation = useMutation(onboardApplication);

  const [formData, setFormData] = useState({
    "appName": "",
    "dataCenter": "",
    "requesterTeamEmail": "",
    "requesterEmail": userEmail,
    "registerLegacy": false,
  });

  if (session.status != "authenticated") {
    return (<div>Cannot continue for an arbitrary client, please sign in first</div>)
  }

  const handleFormChange = (event: object, item: { [key: string]: any }) => {
    if (item.id == 'registerLegacy') {
      formData[item.id] = item.checked
    } else {
      formData[item.id] = item.value
    }
    setFormData(formData);
  }

  const datacenters = [
    { key: 'c', text: 'Chennai', value: 'dc2' },
    { key: 'p', text: 'Pune', value: 'dc1' },
  ]

  const validateAndSubmitRequest = () => {
    var hasError = false;
    var message = "";
    for (const [key, value] of Object.entries(formData)) {
      if (key != 'registerLegacy') {
        if (!value) {
          hasError = true
          message = `Please fill ${key} before continuing`
        }
      }
    }
    if (hasError) {
      toast.error(`Found Empty field ${message}`, {
        position: "bottom-left",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      mutation.mutate(formData);
    }
  }

  return (
    <React.Fragment>
      <Form>
        <Form.Checkbox
          label='Legacy Registration'
          id={'registerLegacy'}
          onClick={handleFormChange}
        />

        <Form.Group widths='equal'>
          <Form.Input id="appName" required fluid label='Application Name' placeholder="Name of application to be onboarded" onChange={handleFormChange} />
          <Form.Select id="dataCenter" required fluid label='Data Center' placeholder='Data Center from DropDown' options={datacenters} onChange={handleFormChange} />
        </Form.Group>

        <Form.Group widths='equal'>
          <Form.Input id="requesterEmail" value={userEmail} fluid required type='email' label='POC Email' placeholder='Point Of Contact Email' onChange={handleFormChange} />
          <Form.Input id="requesterTeamEmail" fluid required type='email' label='Team Email' placeholder='Team Email or Manager Email' onChange={handleFormChange} />
        </Form.Group>

        <Form.Button onClick={validateAndSubmitRequest}>Submit</Form.Button>
      </Form>
    </React.Fragment>
  )
}