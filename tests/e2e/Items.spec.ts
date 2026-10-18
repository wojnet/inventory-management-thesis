import { expect, type Page, test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";
import { resetDatabase } from "../helpers/database";
import ItemsPage from "../pages/ItemsPage";
import NewItemPage from "../pages/NewItemPage";

const signIn = async (page: Page) => {
  await page.goto("/sign-in");
  await page.getByTestId("sign-in-page/email-field").fill("test@example.com");
  await page.getByTestId("sign-in-page/password-field").fill("Password123!");
  await page.getByTestId("sign-in-page/submit-button").click();
  await page.waitForURL("/warehouses");
  await page.locator("section").getByRole("button").click();
  await page.waitForURL("/items");
};

test.describe("Items", () => {
  test.describe.configure({ mode: "serial", timeout: 120_000 });

  test.beforeEach(() => {
    resetDatabase();
  });

  test("redirects unauthenticated users to sign in", async ({ page }) => {
    await page.goto("/items");

    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test("shows sign-in and sign-up actions on the public landing page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Keep your warehouse in order." }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
  });

  test("redirects an authenticated user from the landing page to the dashboard", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/");

    await page.waitForURL("/dashboard");
  });

  test("shows the active warehouse and opens its options menu", async ({
    page,
  }) => {
    await signIn(page);

    await expect(
      page.locator("p:visible", { hasText: "Current warehouse" }),
    ).toBeVisible();
    await page
      .locator('button[aria-label="Options for warehouse"]:visible')
      .click();
    await expect(page.getByRole("menu")).toContainText("No options yet.");
  });

  test("rejects unauthenticated API requests", async ({ request }) => {
    const response = await request.get("/api/items");

    expect(response.status()).toBe(401);
  });

  test("creates a warehouse for a newly registered user", async ({ page }) => {
    const email = `${uuidv4()}@example.com`;
    const warehouseName = `Warehouse ${uuidv4()}`;

    await page.goto("/sign-up");
    await page.getByTestId("sign-up-page/name-field").fill("New user");
    await page.getByTestId("sign-up-page/email-field").fill(email);
    await page.getByTestId("sign-up-page/password-field").fill("Password123!");
    await page.getByTestId("sign-up-page/submit-button").click();
    await page.waitForURL("/warehouses/create");

    await expect(
      page.getByRole("heading", { name: "Create warehouse" }),
    ).toBeVisible();
    await page.getByLabel("Name", { exact: true }).fill(warehouseName);
    await page.getByRole("button", { name: "Create warehouse" }).click();
    await page.waitForURL("/warehouses");
  });

  test("Successfully adds an item", async ({ page }) => {
    const itemsPage = new ItemsPage(page);
    const newItemPage = new NewItemPage(page);
    await signIn(page);

    const testProductName = uuidv4();

    await itemsPage.newItemButton.click();
    await newItemPage.fillForm(testProductName, "Test description", "10");
    await newItemPage.createItemButton.click();

    await page.waitForURL("/items");
    // Here sort items by date added to ensure the newly created item is visible at the top
    await expect(page.getByText(testProductName)).toBeVisible();
  });
});
