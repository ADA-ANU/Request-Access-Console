import React from 'react';
import { inject, observer } from 'mobx-react';
import { AuthStore } from '../stores/authStore'
import { Layout, Spin,  Form, Input, Button, Row, Col } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha'

export interface LoginProps{
    authStore?: AuthStore
}

@inject('authStore')
@observer
export default class Login extends React.Component<LoginProps> {

    render(){
        let { authStore } = this.props
        //const WrappedNormalLoginForm = Form.create({ name: 'Admin Login' })(NormalLoginForm);
        return(
            // <Spin spinning={siteStore?siteStore.siteLoading : true} tip="Loading...">
            <Spin spinning={false} tip="Loading...">    
            <Layout style={{background: '#f0f2f5', margin: '200px 25%', padding: 20}}>
                <Row justify='center'><Col><h1>Admin Login</h1></Col></Row>
                <Row justify='center'> 
                    {/* <WrappedNormalLoginForm /> */}
                </Row>
            </Layout>
            </Spin>

        )
    }
}

export interface LoginFormProps{
    authStore: AuthStore
}
@inject('authStore')
@observer
class NormalLoginForm extends React.Component<LoginFormProps> {
    state = {
        validUser: false
    }
    updateValidUser = () =>{
        this.setState({validUser: true})
    }
    //@ts-ignore
    handleSubmit = e => {
      e.preventDefault();
    //@ts-ignore
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.props.authStore.login(values.username, values.password)
        }
      });
    };
  
    render() {
    //@ts-ignore
      const { getFieldDecorator } = this.props.form;
      return (
            <Spin spinning={this.props.authStore.isLoading}>
                <Form onFinish={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                        <Input
                            size="large"
                            prefix={""}
                            placeholder="Username"
                        />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                        <Input
                            size="large"
                            prefix={""}
                            type="password"
                            placeholder="Password"
                        />,
                        )}
                    </Form.Item>
                    <ReCAPTCHA 
                        sitekey='6LfX8OkUAAAAAKNp9ajcYTrx2CiK5R_DMC8ehyDY'
                        // secretkey='6LfX8OkUAAAAAOg8RWVRU1kYXJJ4grEHPx4kCTwC'
                        onChange={this.updateValidUser}
                    /> 
                    <Form.Item style={{marginTop: '20px', textAlign: "center"}}>
                        <Button type="primary" size="large" disabled={!this.state.validUser}  htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
      );
    }
  }