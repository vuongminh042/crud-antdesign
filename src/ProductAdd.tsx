import React from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, InputNumber, message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

type FormData = {
    name?: string;
    price?: number;
    description?: string;
};

const onFinish: FormProps<FormData>['onFinish'] = async (values) => {
    try {
        const response = await axios.post('http://localhost:3000/products', values);
        message.success('Product added successfully!');
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error);
        message.error('Failed to add product. Please try again.');
    }
};

const onFinishFailed: FormProps<FormData>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const ProductAdd: React.FC = () => (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1>Product Add</h1>
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<FormData>
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input the product name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FormData>
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please input the product price!' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item<FormData>
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please input the product description!' }]}
            >
                <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <Link type="primary" to="/products">
                    Back
                </Link>
            </Form.Item>
        </Form>
    </div>
);

export default ProductAdd;
