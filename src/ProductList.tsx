import React from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


interface TProduct {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
}

// Fetch function for products
const fetchProducts = async (): Promise<TProduct[]> => {
    const response = await axios.get('http://localhost:3000/products');
    return response.data;
};

const ProductList: React.FC = () => {
    const queryClient = useQueryClient();

    // Use useQuery to fetch data
    const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    });

    // Use useMutation for deleting products
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

    // Define columns for the table
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

    // Prepare data for the table
    const preparedData = data.map((product: TProduct, index: number) => ({
        ...product,
        key: product.id, // Ensure each item has a unique key
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
                    expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
                    rowExpandable: (record) => record.name !== 'Not Expandable',
                }}
            />
        </div>
    );
};

export default ProductList;
