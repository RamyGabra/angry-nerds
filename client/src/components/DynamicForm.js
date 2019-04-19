import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Alert, Row } from "reactstrap";
import axios from "axios";

export class DynamicForm extends Component {
  state = {
    alert: false,
    alertMessage: "",
    case: {}
  };

  constructor(props) {
    super(props);
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);

    const body = this.state.case;
    body.form_type = this.props.form_type;
    body.managers = [];
    console.log("BODY   ==>>>   ", body);

    try {
      this.setState({
        alert: false
      });
      const request = await axios.post(
        "http://localhost:3000/InvestorFillForm",
        body
      );
      console.log("REQUEST  =====>>>", request);
    } catch (e) {
      console.log("error ====>>>>", e.response.data);
      const error = e.response.data;
      let message = "";
      for (let i = 0; i < Object.keys(error).length; i++) {
        message =
          message + "" + (i + 1) + ")" + error[Object.keys(error)[i]] + "\n";
        console.log("message =====>>>", message);
      }
      if (this.props.form_type == "SSC" || "SPC")
        this.setState({
          alert: true,
          alertMessage: message
        });
    }
  }

  handleChange(event) {
    console.log(event.target.name);
    let _case = this.state.case;
    _case[event.target.name] = event.target.value;
    this.setState({
      case: _case
    });
    console.log("state =====>>>        ", this.state);
  }

  arrayChange(event){
     console.log(event.target.name)
  }

  increment(event) {
    console.log(event.target.key);
    this.setState({
      [event.target.key]: event.target.key + 1
    });
  }

  renderForm() {
    let model = this.props.model;

    let formUI = model.map(m => {
      let multiple = m.multiple || false;
      let counter = -1;
      const ddItem = {
        width: 500
      };

      let inputt = <h1 />;

      if (multiple) {
        
        let input = m.fields.map(attribute => {
          let key = attribute.key;
          let type = attribute.type || "text";
          let props = attribute.props || {};
          counter++;
          
          return (
            <Row>
              <div className="col-xs-5">
                <Label name={key + counter} key={"l" + key + counter}>
                  {key}
                </Label>
                <Input
                  className="form-input"
                  style={ddItem}
                  name={key + counter}
                  type={type}
                  {...props}
                  key={"i" + key + counter}
                  onChange={this.arrayChange.bind(this)}
                />
              </div>
              <br />
            </Row>
          );
         
        });

        inputt = (
          <div>
            <Label>{m.name}</Label>
            {input}
            <div>
              <Button onClick={(e)=>{ e.preventDefault(); this.props.addField(m.name)}}>
                {" "}
                Add {m.name}
              </Button>
            </div>
          </div>
        );
      } else {
        let key = m.key;
        let label = m.label;
        let type = m.type || "text";
        let props = m.props || {};

        inputt = (
          <Row>
            <div className="col-xs-5">
              <Input
                className="form-input"
                style={ddItem}
                name={key}
                type={type}
                {...props}
                key={"i" + key}
                onChange={this.handleChange.bind(this)}
              />
            </div>
            <br />
          </Row>
        );
      }

      return (
        <div class="w-25 p-3">
          <FormGroup>
            <label className="label label-primary" for="ex2">
              {m.label}
            </label>
            {inputt}
          </FormGroup>
        </div>
      );
    });
    return formUI;
  }

  onDismiss() {
    this.setState({
      alert: false
    });
  }

  render() {
    return (
      <div>
        <fieldset class="the-fieldset">
          <legend className="the-legend">{this.props.form_type}</legend>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            {this.renderForm()}
            <Button
              style={{
                backgroundColor: "#286090",
                float: "right",
                padding: "10px"
              }}
            >
              Submit Form
            </Button>
          </Form>
        </fieldset>

        <Alert
          color="danger"
          isOpen={this.state.alert}
          toggle={this.onDismiss.bind(this)}
        >
          {this.state.alertMessage}
        </Alert>
      </div>
    );
  }
}

export default DynamicForm;
