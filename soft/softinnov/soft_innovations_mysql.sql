/* ============================================================
   SOFT INNOVATIONS DATABASE TABLES
   Run this against the same DB used by QejaConnect.
   No existing QejaConnect table is altered by this script.
   ============================================================ */

CREATE TABLE IF NOT EXISTS soft_orders (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_code VARCHAR(40) NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    service VARCHAR(80) NULL,
    website_type VARCHAR(120) NULL,
    description TEXT NULL,
    inclusions TEXT NULL,
    plan_name VARCHAR(100) NULL,
    estimated_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    storage_options JSON NULL,
    status ENUM(
        'received',
        'reviewing',
        'quoted',
        'approved',
        'development',
        'testing',
        'ready',
        'completed',
        'cancelled'
    ) NOT NULL DEFAULT 'received',
    customer_message VARCHAR(2000) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_soft_order_code (order_code),
    KEY idx_soft_orders_email (customer_email),
    KEY idx_soft_orders_status (status),
    KEY idx_soft_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS soft_contact_messages (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    reply TEXT NULL,
    replied_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_soft_contact_email (email),
    KEY idx_soft_contact_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/* Optional: useful indexes for admin searches */
CREATE INDEX idx_soft_orders_customer_name ON soft_orders(customer_name);
CREATE INDEX idx_soft_orders_website_type ON soft_orders(website_type);
