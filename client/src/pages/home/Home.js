import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import axios from "axios";
import DeviceList from "../../components/device/DeviceList";
import Modal from "../../components/modals/Modal";
import "./home.scss";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const deviceSchema = Yup.object().shape({
  device: Yup.string().required("Required"),
  os: Yup.string().required("Required"),
  manufacturer: Yup.string().required("Required"),
  lastCheckedOutBy: Yup.string().required("Required"),
});


export default function Home() {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [device, setDevice] = useState(null);
  const [isAddMode, setMode] = useState(true);
  useEffect(() => {
    loadDevices();
  }, [devices]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const toastMessage = (message, type) =>{
    switch(type){
      case "success":{
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
      }
      case "warning":{
        toast.warning(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
      }
      default: {
        toast.info(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }

  }

  //Fetch all the devices from the database
  const loadDevices = () => {
    axios
      .get("/api/device")
      .then((response) => {
        setDevices([...response.data.devices]);
        setIsLoading(false);
      })

      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
        setIsLoading(false);
      });
  };

  //Delete a device from the database
  const deleteDevice = (id) => {
    axios
      .delete("/api/device/" + id)
      .then((response) => {
        toastMessage("Device successfully deleted", "success")
        loadDevices();
      })

      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
        setIsLoading(false);
      });
  };

  //set the device to be updated and open the modal
  const handleUpdate = (item) => {
    setDevice(item);
    openModal();
    setMode(false);
  };

  //handle check in and check out
  const handleCheckout = (id, value) => {
    var today = new Date().getHours();
    if (today >= 9 && today <= 17) {
        axios
        .put("/api/device/" + id, {
          isCheckedOut: value,
          lastCheckedOutDate: new Date(),
        })
        .then((response) => {
          // Success 🎉
          toastMessage("Device updated successfully", "success")
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
          }
          console.log(error.config);
        });
    } else {
          toastMessage("Checkouts can only be performed between 9:00am - 17:00pm", "warning")
    }
  };

  //Create new device
  const handleAddNewDevice = () => {
    if (devices.length > 9) {
      toastMessage("Maximum number of devices allowed is 10", "warning")
    } else {
      openModal();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <div className="row my-2">
          <div className="col-md-12">
            <div className="top-container">
              <button
                className="btn btn-primary"
                onClick={() => handleAddNewDevice()}
              >
                {isAddMode ? "Add device" : "Edit device"}
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Device</th>
                <th scope="col">OS</th>
                <th scope="col">Manufacturer</th>
                <th scope="col">LastCheckedOutDate</th>
                <th scope="col">LastCheckedOutBy</th>
                <th scope="col">IsCheckedOut</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <DeviceList
                devices={devices}
                deleteDevice={deleteDevice}
                handleUpdate={handleUpdate}
                handleCheckout={handleCheckout}
              />
            </tbody>
          </table>
          {isLoading && (
            <div className="loading">
              <Loader type="Puff" color="#00BFFF" height={100} width={100} />
            </div>
          )}
        </div>

        <Modal show={showModal} closeModal={closeModal} isAddMode={isAddMode}>
          <Formik
            enableReinitialize={true}
            initialValues={
              device != null
                ? {
                    device: device.device,
                    os: device.os,
                    manufacturer: device.manufacturer,
                    lastCheckedOutBy: device.lastCheckedOutBy,
                    isCheckedOut: device.isCheckedOut,
                  }
                : {
                    device: "",
                    os: "",
                    manufacturer: "",
                    lastCheckedOutBy: "",
                    isCheckedOut: false,
                  }
            }
            validationSchema={deviceSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              var data = {
                device: values.device,
                os: values.os,
                manufacturer: values.manufacturer,
                lastCheckedOutBy: values.lastCheckedOutBy,
                isCheckedOut: values.isCheckedOut ? true : false,
              };
              if (isAddMode) {
                axios
                  .post("/api/device/", data)
                  .then((response) => {
                    // Success 🎉
                    toastMessage("Device created successfully", "success")
                    resetForm();
                    closeModal();
                    loadDevices();
                  })
                  .catch((error) => {
                    if (error.response) {
                      console.log(error.response);
                    }
                    console.log(error.config);
                  });
              } else {
                axios
                  .put("/api/device/" + device._id, data)
                  .then((response) => {
                    // Success 🎉
                    toastMessage("Device updated successfully", "success")
                    resetForm();
                    closeModal();
                    loadDevices();
                    setDevice(null);
                    setMode(true);
                  })
                  .catch((error) => {
                    if (error.response) {
                      console.log(error.response);
                    }
                    console.log(error.config);
                  });
              }
            }}
          >
            {({ isSubmitting, errors }) => (
              <Form>
                {errors.error && <p className="form-error">{errors.error}</p>}
                <div className="row">
                  <div className="col mb-2">
                    <label>Device</label>
                    <Field
                      type="text"
                      className="form-control"
                      placeholder=""
                      name="device"
                    />
                    <ErrorMessage
                      name="device"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="col mb-2">
                    <label>OS</label>
                    <Field
                      type="text"
                      className="form-control"
                      placeholder=""
                      name="os"
                    />
                    <ErrorMessage
                      name="os"
                      component="div"
                      className="form-error"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-2">
                    <label>Manufacturer</label>
                    <Field
                      type="text"
                      className="form-control"
                      placeholder=""
                      name="manufacturer"
                    />
                    <ErrorMessage
                      name="manufacturer"
                      component="div"
                      className="form-error"
                    />
                  </div>
                  <div className="col mb-2">
                    <label>Last Checked Out By</label>
                    <Field
                      type="text"
                      className="form-control"
                      placeholder=""
                      name="lastCheckedOutBy"
                    />
                    <ErrorMessage
                      name="lastCheckedOutBy"
                      component="div"
                      className="form-error"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-2">
                    <div className="form-check">
                      <Field
                        type="checkbox"
                        className="form-check-input"
                        name="isCheckedOut"
                      />
                      <label className="form-check-label">Is Checked Out</label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-mb-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>
    </div>
  );
}
