const LowStock = ({ products }) => {
  const lowStock = products.filter(p => p.stock < 5);

  return (
    <div className="bg-red-100 p-5 rounded-xl shadow mt-6">
      <h3 className="font-semibold mb-3">Low Stock Alerts</h3>

      {lowStock.length === 0 ? (
        <p>No low stock items</p>
      ) : (
        lowStock.map((p, i) => (
          <p key={i}>{p.name}</p>
        ))
      )}
    </div>
  );
};

export default LowStock;