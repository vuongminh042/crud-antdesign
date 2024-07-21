import React from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Khai báo kiểu dữ liệu
interface TProduct {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
}

// Call API để lấy dữ liệu
const fetchProducts = async (): Promise<TProduct[]> => {
    const response = await axios.get('http://localhost:3000/products');
    return response.data;
};

const ProductList: React.FC = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });


    const mutation = useMutation({
        mutationFn: async (id: number) => {
            const confirm = window.confirm('Do you want to delete this product?');
            if (confirm) {
                await axios.delete(`http://localhost:3000/products/${id}`);
                alert('Delete Successful');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
        onError: (error) => {
            alert('Delete Failed: ' + error.message);
        }
    });

    const columns: TableColumnsType<TProduct> = [
        { title: 'STT', dataIndex: 'index', key: 'index' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Link to={`/products/${record.id}/edit`} style={{ marginRight: 8 }}>
                        <EditOutlined style={{ color: 'blue' }} />
                    </Link>
                    <a
                        style={{ color: 'red' }}
                        onClick={() => mutation.mutate(record.id)}
                    >
                        <DeleteOutlined />
                    </a>
                </div>
            ),
        },
    ];

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;


    const preparedData = data.map((product: TProduct, index: number) => ({
        ...product,
        key: product.id,
        index: index + 1
    }));

    return (
        <div>
            <Link to="/products/add" className="btn btn-primary">
                <PlusCircleOutlined /> Add
            </Link>
            <Table
                columns={columns}
                dataSource={preparedData}
                expandable={{
                    expandedRowRender: (product) => <p style={{ margin: 0 }}>{product.description}</p>,
                    rowExpandable: (product) => product.name !== 'Not Expandable',
                }}
            />
        </div>
    );
};

export default ProductList;
