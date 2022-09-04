import { Component } from "react";
import axios from "axios";

class SignUpPage extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    apiProgress: false
  };

  onChange = event => {
    const { id, value } = event.target;
    this.setState({
      [id]: value
    });
  };

  submit = event => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const body = {
      username,
      email,
      password
    };
    this.setState({apiProgress: true});
    axios.post("/api/1.0/users", body);
  };
  render() {
    let disabled = true;
    const { password, passwordRepeat, apiProgress } = this.state;
    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }
    return (
      <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        <form className="card mt-5">
        <div className="card-header">
        <h1 className="text-center">Sign Up</h1>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              username
            </label>
            <input
              id="username"
              onChange={this.onChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              e-mail
            </label>
            <input
              id="email"
              onChange={this.onChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              password
            </label>
            <input
              id="password"
              type="password"
              onChange={this.onChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordRepeat" className="form-label">
              password repeat
            </label>
            <input
              id="passwordRepeat"
              type="password"
              onChange={this.onChange}
              className="form-control"
            />
          </div>
          <div className="text-center">
            <button
              disabled={disabled || apiProgress}
              onClick={this.submit}
              className="btn btn-primary"
            >
            { apiProgress && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> }
              Sign Up
            </button>
        </div>
        </div>
        </form>
      </div>
    );
  }
}

export default SignUpPage;
