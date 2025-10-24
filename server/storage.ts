import { type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder, type CartItemWithProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Product operations
  getProductByBarcode(barcode: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart operations
  getCartItems(userId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(userId: string): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    
    // Initialize with sample products
    this.initializeSampleProducts();
  }

  private initializeSampleProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        barcode: "8901030890875",
        name: "Premium Wireless Earbuds",
        description: "High-quality Bluetooth 5.0 earbuds with noise cancellation",
        mrp: "4999.00",
        discount: "1000.00",
        finalPrice: "3999.00",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
      },
      {
        barcode: "8901030890876",
        name: "Organic Coffee Beans",
        description: "Premium organic coffee beans - 500g pack",
        mrp: "1200.00",
        discount: "180.00",
        finalPrice: "1020.00",
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
      },
      {
        barcode: "8901030890877",
        name: "Smartphone",
        description: "Latest flagship smartphone with 5G connectivity",
        mrp: "79999.00",
        discount: "10000.00",
        finalPrice: "69999.00",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
      },
    ];

    for (const product of sampleProducts) {
      this.createProduct(product);
    }
  }

  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.barcode === barcode);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      description: insertProduct.description ?? null,
      discount: insertProduct.discount ?? null,
      imageUrl: insertProduct.imageUrl ?? null,
      inStock: insertProduct.inStock ?? null,
    };
    this.products.set(id, product);
    return product;
  }

  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const userCartItems = Array.from(this.cartItems.values()).filter(item => item.userId === userId);
    const itemsWithProducts: CartItemWithProduct[] = [];

    for (const cartItem of userCartItems) {
      const product = this.products.get(cartItem.productId);
      if (product) {
        itemsWithProducts.push({ ...cartItem, product });
      }
    }

    return itemsWithProducts;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === insertItem.userId && item.productId === insertItem.productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertItem.quantity || 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = randomUUID();
    const cartItem: CartItem = { ...insertItem, id, quantity: insertItem.quantity || 1 };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    cartItem.quantity = quantity;
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async removeFromCart(id: string): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<void> {
    const userCartItems = Array.from(this.cartItems.entries()).filter(
      ([_, item]) => item.userId === userId
    );
    
    for (const [id] of userCartItems) {
      this.cartItems.delete(id);
    }
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const orderId = `SC-${new Date().getFullYear()}-${String(this.orders.size + 1).padStart(3, '0')}`;
    const createdAt = new Date().toISOString();
    
    const order: Order = {
      ...insertOrder,
      id,
      orderId,
      createdAt,
      savings: insertOrder.savings ?? null,
      status: insertOrder.status || "completed",
    };
    
    this.orders.set(id, order);
    return order;
  }

  async getOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(order => order.orderId === orderId);
  }
}

export const storage = new MemStorage();
