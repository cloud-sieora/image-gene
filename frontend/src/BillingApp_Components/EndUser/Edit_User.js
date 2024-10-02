import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
import windowSize from 'react-window-size';
import axios from 'axios';
import * as api from '../Configurations/Api_Details'

import Aux from "../../hoc/_Aux";

function FormsElements(props) {

  
    const [customer_name, setcompany_name] = useState(props.data.customer_name);
  const [mobile_number, setcontact_number] = useState(props.data.mobile_number);
  const [mail_id, setmail_id] = useState(props.data.mail_id);
  const [password, setpassword] = useState(props.data.password);
  const [user_type, setuser_type] = useState(props.data.user_type);
  const [gender, setgender] = useState(props.data.gender);
  const [username, setusername] = useState(props.data.username);

    return (
        <Aux>
            <Row>
                <Col>
                    <Card>
                        {/* <Card.Header>
                                <Card.Title as="h5">CREATE NEW AGENCY </Card.Title>
                                <hr/>

                            </Card.Header> */}
                        <Card.Body>
                            <h5>UPDATE USER DETAILS </h5>
                            <hr />
                            <Row>
                <Col md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>CUSTOMER NAME *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Customer Name"
                      value={customer_name}
                      onChange={(event) => {
                        setcompany_name(event.target.value);
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>PHONE NUMBER *</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter Phone Number"
                      value={mobile_number}
                      onChange={(event) => {
                        setcontact_number(event.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicSelect">
                    <Form.Label>GENDER</Form.Label>
                    <Form.Control
                      as="select"
                      value={gender}
                      onChange={(e) => {
                        console.log("e.target.value", e.target.value);
                        setgender(e.target.value);
                      }}
                    >
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHERS">OTHERS</option>
                    </Form.Control>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>EMAIL *</Form.Label>
                    <Form.Control
                      type="mail_id"
                      placeholder="Enter Email"
                      value={mail_id}
                      onChange={(event) => {
                        setmail_id(event.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicSelect">
                    <Form.Label>USER TYPE</Form.Label>
                    <Form.Control
                      as="select"
                      value={user_type}
                      onChange={(e) => {
                        console.log("e.target.value", e.target.value);
                        setuser_type(e.target.value);
                      }}
                    >
                      <option value="RESIDENTIAL">RESIDENTIAL</option>
                      <option value="COMMERCIAL">COMMERCIAL</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>PASSWORD *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(event) => {
                        setpassword(event.target.value);
                      }}
                    />
                  </Form.Group>
                </Col>
                <div style={{ marginLeft: 15 }}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (
                        customer_name !== "" &&
                        mobile_number !== "" &&
                        password !== "" &&
                        mail_id !== "" &&
                        password !== ""
                      ) {
                        const client_admin_details = {
                          customer_name: customer_name,
                          mobile_number: mobile_number,
                          mail_id: mail_id,
                          password: password,
                          dealer_id: JSON.parse(
                            localStorage.getItem("user_Data")
                          ).username,
                          user_type: user_type,
                          gender: gender
                        };
                        console.log(client_admin_details);
                        // console.log(JSON.parse(localStorage.getItem("user_Data")))

                        const options = {
                          url: api.USER_DATA+props.data._id,
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            // 'Authorization': 'Bearer ' + window.localStorage.getItem('codeofauth')
                          },
                          data: JSON.stringify(client_admin_details),
                        };

                        console.log(client_admin_details);

                        axios(options)
                          .then((response) => {
                            console.log(response.data);

                            if (response.data == "admin ID already exist") {
                              alert("Username(" + username + ") already exist");
                            } else {
                              props.callback();
                            }
                          })
                          .catch(function (e) {
                            props.callback();
                            if (e.message === "Network Error") {
                              alert(
                                "No Internet Found. Please check your internet connection"
                              );
                            } else {
                              alert(
                                "Sorry, something went wrong. Please try again after sometime. If the issue still persists contact support."
                              );
                            }
                          });
                      } else {
                        alert("Please fill out all required fields.");
                      }
                    }}
                  >
                    SUBMIT
                  </Button>

                  <Button
                    variant="primary"
                    onClick={() => {
                      props.callback();
                    }}
                  >
                    CANCEL
                  </Button>
                </div>
              </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    );

}

export default windowSize(FormsElements);