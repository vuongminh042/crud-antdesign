import React, { useEffect, useState } from 'react';
import { Button, Form, FormProps, Input, InputNumber, message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

type FormData = {
    name?: string;
    price?: number;
    description?: string;
};

const EditProduct: React.FC = () => {
    const [form] = Form.useForm<FormData>();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/products/${id}`);
                form.setFieldsValue(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product', error);
                message.error('Failed to fetch product data');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, form]);

    const onFinish: FormProps<FormData>['onFinish'] = async (values) => {
        try {
            const response = await axios.put(`http://localhost:3000/products/${id}`, values);
            message.success('Update Successful');
            return response.data;
        } catch (error) {
            console.error('Error', error);
            message.error('Update Failed');
        }
    };

    const onFinishFailed: FormProps<FormData>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed: ', errorInfo);
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h1>Edit Product</h1>
            {!loading ? (
                <Form
                    form={form}
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
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EditProduct;
