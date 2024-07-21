import React, { useEffect, useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input, InputNumber, message } from 'antd';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

type FieldType = {
    name?: string;
    price?: number;
    description?: string;
};

const ProductEdit: React.FC = () => {
    const [form] = Form.useForm();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);

            axios.get(`http://localhost:3000/products/${id}`)
                .then((response) => {
                    form.setFieldsValue(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching product:', error);
                    message.error('Failed to fetch product. Please try again.');
                    setLoading(false);
                });
        }
    }, [id, form]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            if (id) {
                await axios.put(`http://localhost:3000/products/${id}`, values);
                message.success('Product updated successfully!');
            } else {
                await axios.post('http://localhost:3000/products', values);
                message.success('Product added successfully!');
            }
            navigate('/products');
        } catch (error) {
            console.error('Error:', error);
            message.error(`Failed to ${id ? 'update' : 'add'} product. Please try again.`);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h1>{id ? 'Edit Product' : 'Add Product'}</h1>
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
                <Form.Item<FieldType>
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input the product name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input the product price!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input the product description!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                    {/* <Link type="primary" to="/products">
                        Back
                    </Link> */}
                </Form.Item>
            </Form>
        </div>
    );
};

export default ProductEdit;
