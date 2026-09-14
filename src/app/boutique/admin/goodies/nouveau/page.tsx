import ProductForm from "../product-form";

export default function NouveauProduitPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-balance text-gray-900">Nouveau produit</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
