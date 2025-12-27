import { ProductManager } from "@/features/products/components/Admin/ProductManager";
import { productService } from "@/features/products/services/productService";
import { seedProductsAction } from "@/features/products/actions/productActions";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
    // In a real app with auth, we would get the barberId from the session
    // For now, we use a hardcoded or derived ID.
    const barberId = "default";

    let products = await productService.getProductsByBarberId(barberId);

    // Auto-Initialize if empty
    if (products.length === 0) {
        console.log("No products found. Auto-seeding defaults...");
        // Call the service directly (since we are on server)
        await productService.seedProducts(barberId);
        // Refresh the list
        products = await productService.getProductsByBarberId(barberId);
    }

    return (
        <div className="container mx-auto p-6 md:p-8">
            <ProductManager
                initialProducts={products}
                barberId={barberId}
            />
        </div>
    );
}
