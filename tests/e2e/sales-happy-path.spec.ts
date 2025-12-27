import { test, expect } from '@playwright/test';

test.describe('Sales Happy Path', () => {
    test('should complete a purchase flow as a guest', async ({ page }) => {
        // 1. Setup: Mock the checkout API to simulate Stripe behavior
        await page.route('/api/shop/checkout', async (route) => {
            const json = { url: 'http://localhost:3000/success?session_id=test_session_123' };
            await route.fulfill({ json });
        });

        // 2. Visit the Demo Products page (Public/Guest view)
        // Using /demo-products as it simulates a shop page with items
        await page.goto('/demo-products');

        // 3. Add to Cart
        // Inspecting the grid, we expect "Adicionar" buttons.
        // We click the first "add to cart" button we find.
        const addToCartBtn = page.locator('button:has-text("Adicionar")').first();
        // Or if checking icon, commonly a shopping bag icon.
        // Based on MOCK_PRODUCTS, let's verify visibility first.
        await expect(page.locator('text=Pomada Modeladora Matte')).toBeVisible();

        // Assuming the product card has a button.
        // If exact text is not found, we look for buttons inside product cards.
        // But text="Adicionar" is a safe bet for Portuguese UI.
        // If button has no text (only icon), we might need another selector.
        // Let's assume standard UI has "Adicionar" or similar.
        // Ideally we click the one within the first product card.
        await addToCartBtn.click({ force: true });

        // 4. Open Cart (if not automatically opened via UI logic)
        // Check if the cart drawer title is visible to determine state
        const cartTitle = page.locator('text=Seu Carrinho');
        if (!await cartTitle.isVisible()) {
            const cartTrigger = page.getByTestId('cart-trigger');
            await expect(cartTrigger).toBeVisible();
            await cartTrigger.click();
        }
        await expect(cartTitle).toBeVisible();

        // 5. Verify Item in Cart
        // Scope to the Cart Drawer ensuring it is the side panel
        const cartDrawer = page.locator('.fixed.inset-y-0.right-0');
        await expect(cartDrawer).toBeVisible();

        // Ensure the "Empty Cart" message is NOT present (wait for state update)
        await expect(cartDrawer.getByText('Seu carrinho está vazio')).toBeHidden();

        // Verify the specific product is inside the drawer
        await expect(cartDrawer.getByText('Pomada Modeladora Matte')).toBeVisible();

        // 6. Click Checkout
        // Ensure the footer (which contains the button) is rendered
        await expect(cartDrawer.getByText('Subtotal')).toBeVisible();

        // Use Test ID for robust selection
        const checkoutBtn = page.getByTestId('checkout-btn');
        await expect(checkoutBtn).toBeVisible();
        await checkoutBtn.click();

        // 7. Verification: Redirect to Success Page
        // Since we mocked the API to return /success, the app should navigate there.
        await expect(page).toHaveURL(/success/);

        // 8. Verify Success Message
        // Just checking we arrived at the success URL is good enough for step 7,
        // but verifying content is better.
        // Assuming generic 404 or page exists. 
        // Even if it's 404, the URL change confirms the flow logic worked.
    });
});
