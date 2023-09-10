import React from 'react'
import { Button, Form, message } from 'antd'
import { Link } from 'react-router-dom'
import { loginUser } from '../../../apicalls/users';
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../../redux/loaderSlice";

function Login() {

    const dispatch = useDispatch();
    const onFinish = async (values) => {
        try {
            dispatch(showLoading())
            const response = await loginUser(values);
            dispatch(hideLoading())
            if(response.success){
                message.success(response.message);
                localStorage.setItem("token", response.data);
                window.location.href = "/";
            }else{
                message.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoading())
            message.error(error.message);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen bg-primary'>
            <div className='card w-400 p-3 bg-white'>
                <div className='flex flex-col'>
                    <div className="flex">
                        <h1 className='text-2xl'>CHETUQUIZ - Login</h1>
                        <i class='ri-login-circle-line'></i>
                    </div>
                    <div className='divider'></div>
                    <Form layout='vertical' className="mt-2" onFinish={onFinish}>
                        <Form.Item name="email" label="Email">
                            <input type='text' placeholder='' />
                        </Form.Item>
                        <Form.Item name="password" label="Password">
                            <input type='password' placeholder='' />
                        </Form.Item>
                        <div className='flex flex-col gap-2'>
                            <button type='submit' className='primary-cotained-btn mt-2 w-100'>Login</button>
                            <Link to="/register" className='underline'>Not a member ? Register</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Login
