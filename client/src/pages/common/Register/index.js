import React from 'react'
import { Form, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../../apicalls/users';
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../../redux/loaderSlice";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            dispatch(showLoading())
            const response = await registerUser(values);
            dispatch(hideLoading())
            if(response.success){
                message.success(response.message);
                navigate('/login');
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
                        <h1 className='text-2xl'>CHETUQUIZ - Register</h1>
                        <i class='ri-user-add-line'></i>
                    </div>
                    <div className='divider'></div>
                    <Form layout='vertical' className='mt-2' onFinish={onFinish}>
                        <Form.Item name="user_name" label="Name">
                            <input type='text'/>
                        </Form.Item>
                        <Form.Item name="user_email" label="Email">
                            <input type='text'/>
                        </Form.Item>
                        <Form.Item name="user_password" label="Password">
                            <input type='password'/>
                        </Form.Item>
                        <div className='flex flex-col gap-2'>
                            <button type='submit' className='primary-cotained-btn mt-2 w-b100'>Register</button>
                            <Link to="/login" className='underline'>Already a member ? Login</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Register
