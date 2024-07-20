
import { Route, Routes } from 'react-router-dom';
import ProductList from './ProductList';
import CustomLayout from './Layout';
import ProductAdd from './ProductAdd';
import ProductEdit from './ProductEdit';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<CustomLayout />}>
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
