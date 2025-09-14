import json
import csv
import random
from datetime import datetime, timedelta

# Financial KPI Data
financial_kpis = [
    {"kpi_name": "Monthly Recurring Revenue", "value": 125000, "target": 120000, "variance": 4.17, "period": "2024-01", "department": "Finance"},
    {"kpi_name": "Customer Acquisition Cost", "value": 85, "target": 90, "variance": -5.56, "period": "2024-01", "department": "Marketing"},
    {"kpi_name": "Gross Margin %", "value": 68.5, "target": 70, "variance": -2.14, "period": "2024-01", "department": "Finance"},
    {"kpi_name": "Cash Flow", "value": 45000, "target": 40000, "variance": 12.5, "period": "2024-01", "department": "Finance"},
    {"kpi_name": "EBITDA", "value": 28000, "target": 25000, "variance": 12, "period": "2024-01", "department": "Finance"},
    {"kpi_name": "Monthly Recurring Revenue", "value": 132000, "target": 125000, "variance": 5.6, "period": "2024-02", "department": "Finance"},
    {"kpi_name": "Customer Acquisition Cost", "value": 82, "target": 85, "variance": -3.53, "period": "2024-02", "department": "Marketing"},
    {"kpi_name": "Gross Margin %", "value": 71.2, "target": 70, "variance": 1.71, "period": "2024-02", "department": "Finance"},
    {"kpi_name": "Cash Flow", "value": 52000, "target": 45000, "variance": 15.56, "period": "2024-02", "department": "Finance"},
    {"kpi_name": "EBITDA", "value": 35000, "target": 30000, "variance": 16.67, "period": "2024-02", "department": "Finance"}
]

# Operations Metrics
operations_data = [
    {"date": "2024-01-01", "department": "Manufacturing", "metric": "Production Output", "value": 1250, "unit": "units", "target": 1200, "efficiency": 104.17},
    {"date": "2024-01-01", "department": "Manufacturing", "metric": "Defect Rate", "value": 2.3, "unit": "%", "target": 3.0, "efficiency": 123.33},
    {"date": "2024-01-01", "department": "Logistics", "metric": "Delivery Time", "value": 2.1, "unit": "days", "target": 2.5, "efficiency": 116.00},
    {"date": "2024-01-01", "department": "Customer Service", "metric": "Response Time", "value": 4.5, "unit": "hours", "target": 6.0, "efficiency": 125.00},
    {"date": "2024-01-01", "department": "IT", "metric": "System Uptime", "value": 99.8, "unit": "%", "target": 99.5, "efficiency": 100.30},
    {"date": "2024-02-01", "department": "Manufacturing", "metric": "Production Output", "value": 1320, "unit": "units", "target": 1250, "efficiency": 105.60},
    {"date": "2024-02-01", "department": "Manufacturing", "metric": "Defect Rate", "value": 1.9, "unit": "%", "target": 3.0, "efficiency": 136.84},
    {"date": "2024-02-01", "department": "Logistics", "metric": "Delivery Time", "value": 1.8, "unit": "days", "target": 2.5, "efficiency": 128.00},
    {"date": "2024-02-01", "department": "Customer Service", "metric": "Response Time", "value": 3.2, "unit": "hours", "target": 6.0, "efficiency": 146.67},
    {"date": "2024-02-01", "department": "IT", "metric": "System Uptime", "value": 99.9, "unit": "%", "target": 99.5, "efficiency": 100.40}
]

# Product Manager Data
user_engagement = [
    {"user_id": "USER001", "date": "2024-01-15", "feature": "Dashboard", "action": "view", "duration": 180, "device": "desktop", "user_segment": "power_user"},
    {"user_id": "USER001", "date": "2024-01-15", "feature": "Analytics", "action": "click", "duration": 45, "device": "desktop", "user_segment": "power_user"},
    {"user_id": "USER002", "date": "2024-01-15", "feature": "Profile", "action": "edit", "duration": 120, "device": "mobile", "user_segment": "regular"},
    {"user_id": "USER003", "date": "2024-01-16", "feature": "Search", "action": "query", "duration": 30, "device": "tablet", "user_segment": "new_user"},
    {"user_id": "USER004", "date": "2024-01-16", "feature": "Dashboard", "action": "view", "duration": 240, "device": "desktop", "user_segment": "power_user"},
    {"user_id": "USER005", "date": "2024-01-17", "feature": "Export", "action": "download", "duration": 60, "device": "desktop", "user_segment": "regular"},
]

# Feature Adoption Data
feature_adoption = [
    {"feature_name": "AI Chat", "release_date": "2024-01-01", "total_users": 1000, "active_users": 650, "adoption_rate": 65.0, "retention_7d": 45.2, "retention_30d": 32.1},
    {"feature_name": "Knowledge Graph", "release_date": "2024-02-01", "total_users": 1200, "active_users": 480, "adoption_rate": 40.0, "retention_7d": 35.8, "retention_30d": 28.3},
    {"feature_name": "Multi-Persona Insights", "release_date": "2024-03-01", "total_users": 1350, "active_users": 810, "adoption_rate": 60.0, "retention_7d": 52.4, "retention_30d": 41.7},
    {"feature_name": "Advanced Filters", "release_date": "2024-01-15", "total_users": 1000, "active_users": 750, "adoption_rate": 75.0, "retention_7d": 68.3, "retention_30d": 58.9},
    {"feature_name": "Export Dashboard", "release_date": "2023-12-01", "total_users": 950, "active_users": 855, "adoption_rate": 90.0, "retention_7d": 82.1, "retention_30d": 74.5},
]

# Write Financial KPIs
with open('financial_kpis.json', 'w') as f:
    json.dump(financial_kpis, f, indent=2)

# Write Operations Data
with open('operations_metrics.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['date', 'department', 'metric', 'value', 'unit', 'target', 'efficiency'])
    writer.writeheader()
    writer.writerows(operations_data)

# Write Operations Efficiency Data
efficiency_data = [
    {"process_name": "Order Processing", "current_time": 2.5, "target_time": 3.0, "efficiency": 116.67, "cost_per_unit": 12.50, "department": "Operations"},
    {"process_name": "Inventory Management", "current_time": 1.2, "target_time": 1.5, "efficiency": 120.00, "cost_per_unit": 8.75, "department": "Warehouse"},
    {"process_name": "Quality Control", "current_time": 0.8, "target_time": 1.0, "efficiency": 125.00, "cost_per_unit": 15.25, "department": "QA"},
    {"process_name": "Customer Onboarding", "current_time": 4.5, "target_time": 5.0, "efficiency": 111.11, "cost_per_unit": 25.00, "department": "Customer Success"},
    {"process_name": "Invoice Processing", "current_time": 1.8, "target_time": 2.0, "efficiency": 110.00, "cost_per_unit": 6.50, "department": "Finance"},
]

with open('operations_efficiency.json', 'w') as f:
    json.dump(efficiency_data, f, indent=2)

# Write User Engagement Data
with open('user_engagement.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['user_id', 'date', 'feature', 'action', 'duration', 'device', 'user_segment'])
    writer.writeheader()
    writer.writerows(user_engagement)

# Write Feature Adoption Data
with open('feature_adoption.json', 'w') as f:
    json.dump(feature_adoption, f, indent=2)

print("All datasets created successfully!")
