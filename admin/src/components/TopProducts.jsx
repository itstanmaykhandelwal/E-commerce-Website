const TopProducts = ({ products }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow mt-6">
      <h3 className="font-semibold mb-3">Top Products</h3>

      {products.slice(0, 5).map((p, i) => (
        <div key={i} className="flex justify-between py-2 border-b">
          <p>{p.name}</p>
          <p>₹{p.price}</p>
        </div>
      ))}
    </div>
  );
};

export default TopProducts;