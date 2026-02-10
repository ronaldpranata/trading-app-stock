import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial auth check to complete
    await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 10000 });
    
    // Check if we are already logged in (e.g. reused state) or need to login
    const loginButton = page.getByRole('button', { name: 'Access Application' });
    if (await loginButton.isVisible()) {
        await page.getByPlaceholder('Enter password').fill('giEaWc0XJPTfXKLpQKubM1Q8e4Y');
        await loginButton.click();
    }
    // Always wait for dashboard to load
    await expect(page.getByText('Quick Stats')).toBeVisible();
  });

  test('should load homepage and display critical elements', async ({ page }) => {
    // Check Title
    await expect(page).toHaveTitle(/Stock Predictor AI/);

    // Check for Dashboard elements
    await expect(page.getByText('Quick Stats')).toBeVisible();

    // Test Interaction (Search)
    const searchInput = page.getByPlaceholder('Search stocks or crypto...');
    await expect(searchInput).toBeVisible();
    
    await searchInput.click();
    await searchInput.fill('AAPL');
    // Verify input value
    await expect(searchInput).toHaveValue('AAPL');
  });

  test('should navigate tabs', async ({ page }) => {
    // Click 'Fundamental' tab
    await page.getByRole('button', { name: 'Fundamental' }).click();
    
    // Check if Fundamental content loads
    // Key Metrics is a component in Fundamental tab
    await expect(page.getByText('Key Metrics')).toBeVisible();
  });
});
