# WooCommerce Integration Guide

## Overview
Your PIM system is now fully integrated with WooCommerce. The system can synchronize products from your PIM catalog to your local WordPress/WooCommerce store running on XAMPP.

## Configuration Status ✅

### Current Setup
- **Store URL**: http://localhost/wordpress
- **Consumer Key**: ck_1dfc343433c28bc833d83206e0ce302e22ea1bf5
- **Consumer Secret**: cs_513fdedfdf86d1f36266a114d16bf8859a988c1d
- **Environment File**: `backend/.env`

The backend logs will show: `✅ WooCommerce initialized - Store: http://localhost/wordpress`

## How to Use

### 1. Test WooCommerce Connection
1. Open the frontend at `http://localhost:5173`
2. Click **"📊 Sync Dashboard"** tab
3. Click **"🔗 Test WooCommerce Connection"** button
4. If successful, you'll see: `✅ Connected to Your Store Name`

### 2. Sync Products to WooCommerce

#### Single Product Sync
1. Go to **"📋 Products"** tab
2. Find a product with **"Pending"** sync status
3. Click the **sync icon** (↔️) in the Actions column
4. The product will be created/updated in WooCommerce

#### Bulk Sync All Pending
1. Go to **"📊 Sync Dashboard"** tab
2. If there are pending products, click **"🚀 Sync All N Pending Products"**
3. Confirm the synchronization
4. Products will be synced to WooCommerce

### 3. Product Sync Details

When a product is synced to WooCommerce, the following information is transferred:

- **Product Name**: From PIM name field
- **Description**: From PIM description field
- **Price**: Regular price from PIM price field
- **SKU**: From PIM SKU field
- **Stock**: Quantity and availability status
- **Images**: Product images/gallery
- **Attributes**: Custom product attributes
- **Category**: Linked WooCommerce category (if mapped)

### 4. Monitor Sync Operations

#### View Sync Logs
1. Go to **"📊 Sync Dashboard"** tab
2. Click **"📋 Show Sync Logs"**
3. View detailed sync history with:
   - Timestamp of sync operation
   - Product SKU
   - Action type (create/update)
   - Success/failure status
   - Duration in milliseconds
   - WooCommerce product ID or error details

#### Sync Status Meanings
- **⏳ Pending**: Product ready to be synced to WooCommerce
- **✅ Synced**: Product successfully synced to WooCommerce
- **❌ Failed**: Product sync failed (check logs for details)

## Sync Dashboard Statistics

The dashboard displays real-time statistics:
- **📦 Total Products**: Total products in PIM system
- **✅ Synced**: Products successfully synced to WooCommerce
- **⏳ Pending**: Products waiting to be synced
- **❌ Failed**: Products that failed to sync

## Troubleshooting

### Connection Test Fails
**Issue**: "Connection Failed" when testing WooCommerce

**Possible Causes**:
1. WordPress/XAMPP not running
2. Incorrect store URL (should be `http://localhost/wordpress`)
3. Invalid API keys

**Solution**:
- Verify XAMPP is running and WordPress is accessible at `http://localhost/wordpress`
- Verify API keys in `backend/.env` are correct
- Check WooCommerce REST API is enabled in WordPress settings
- Restart the backend server: `cd backend && npm run dev`

### Products Not Syncing
**Issue**: Sync operation fails or products appear as "Failed"

**Possible Causes**:
1. Missing required fields (name, price, SKU)
2. Duplicate SKU in WooCommerce
3. Network connectivity issue
4. WooCommerce API rate limiting

**Solution**:
- Check sync logs for specific error messages
- Verify all products have name, price, and SKU
- Ensure product SKU is unique across WooCommerce
- Wait a few moments and retry if rate limited
- Check WordPress error logs at `xampp/apache/logs/error.log`

### How to Update API Keys

If you need to use different WooCommerce store credentials:

1. Edit `backend/.env`:
   ```
   WC_STORE_URL=http://localhost/wordpress
   WC_CONSUMER_KEY=your_new_consumer_key
   WC_CONSUMER_SECRET=your_new_consumer_secret
   ```

2. Restart the backend server:
   ```
   cd backend
   npm run dev
   ```

## API Endpoints

### Test Connection
```
GET /api/woocommerce/test
```

### Sync Single Product
```
POST /api/sync/product/{productId}
```

### Sync All Pending Products
```
POST /api/sync/all-pending
```

### Get Sync Logs
```
GET /api/sync/logs?limit=50
```

## Best Practices

1. **Test Connection First**: Always test the WooCommerce connection before syncing products
2. **Start Small**: Test with 1-2 products before bulk syncing
3. **Monitor Logs**: Check sync logs to ensure products are syncing correctly
4. **Unique SKUs**: Ensure all products have unique SKUs
5. **Complete Information**: Fill in all product fields (name, price, SKU) before syncing
6. **Batch Operations**: Use bulk sync for large number of products rather than individual syncs

## Next Steps

1. ✅ WooCommerce connection is configured
2. Test the connection in the Sync Dashboard
3. Create or import products in the PIM system
4. Mark products as ready for sync
5. Use the Sync Dashboard to push products to WooCommerce
6. Verify products appear in your WordPress admin panel

## Support & Development

If you encounter issues:
- Check the backend terminal for error messages
- Review sync logs in the dashboard
- Verify all environment variables are set correctly
- Restart both frontend and backend servers

---
**Last Updated**: March 28, 2026
**System Version**: PIM v1.0.0 with WooCommerce Integration
