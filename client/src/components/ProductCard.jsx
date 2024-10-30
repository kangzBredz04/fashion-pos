/* eslint-disable react/prop-types */

export default function ProductCard({product}) {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600">Price: ${product.price}</p>
      <p className="text-gray-600">Stock: {product.stock}</p>
    </div>
  );
}
