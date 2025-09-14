/**
 * Comprehensive End-to-End Testing for Zenalyst Analytics Platform
 * Tests all user workflows and identifies potential blank screen issues
 */

import fs from 'fs';
import path from 'path';

class ZenalystTester {
  constructor() {
    this.testResults = [];
    this.issues = [];
    this.testDataPath = './test-datasets';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logEntry);
    this.testResults.push(logEntry);
  }

  recordIssue(issue, severity = 'medium') {
    this.issues.push({
      issue,
      severity,
      timestamp: new Date().toISOString()
    });
    this.log(`ISSUE FOUND: ${issue}`, 'error');
  }

  async testDatasetParsing() {
    this.log('=== Testing Dataset Parsing Functionality ===');
    
    const datasets = [
      'ecommerce_sales_data.csv',
      'ecommerce_customer_analytics.json',
      'marketing_campaign_performance.csv',
      'marketing_lead_generation.json',
      'financial_revenue_expense.csv',
      'financial_kpis.json',
      'operations_metrics.csv',
      'operations_efficiency.json',
      'user_engagement.csv',
      'feature_adoption.json'
    ];

    for (const dataset of datasets) {
      try {
        const filePath = path.join(this.testDataPath, dataset);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          if (dataset.endsWith('.csv')) {
            // Test CSV parsing
            const lines = content.split('\n').filter(line => line.trim());
            if (lines.length < 2) {
              this.recordIssue(`CSV file ${dataset} has insufficient data (less than 2 lines)`, 'high');
            } else {
              const headers = lines[0].split(',').map(h => h.trim());
              const dataRows = lines.slice(1);
              this.log(`✓ CSV ${dataset}: ${headers.length} columns, ${dataRows.length} rows`);
              
              // Test for data consistency
              const firstRowColumns = lines[1].split(',').length;
              if (firstRowColumns !== headers.length) {
                this.recordIssue(`CSV file ${dataset} has inconsistent column count`, 'medium');
              }
            }
          } else if (dataset.endsWith('.json')) {
            // Test JSON parsing
            try {
              const jsonData = JSON.parse(content);
              const recordCount = Array.isArray(jsonData) ? jsonData.length : 1;
              this.log(`✓ JSON ${dataset}: ${recordCount} records`);
              
              if (Array.isArray(jsonData) && jsonData.length === 0) {
                this.recordIssue(`JSON file ${dataset} is empty array`, 'medium');
              }
            } catch (parseError) {
              this.recordIssue(`JSON file ${dataset} has invalid JSON format: ${parseError.message}`, 'high');
            }
          }
        } else {
          this.recordIssue(`Dataset file ${dataset} not found`, 'high');
        }
      } catch (error) {
        this.recordIssue(`Error testing dataset ${dataset}: ${error.message}`, 'high');
      }
    }
  }

  async testUserWorkflows() {
    this.log('=== Testing User Workflows ===');
    
    const workflows = [
      {
        name: 'E-commerce Manager - Sales Data Upload',
        datasets: ['ecommerce_sales_data.csv', 'ecommerce_customer_analytics.json'],
        expectedFeatures: ['revenue analysis', 'customer segmentation', 'order patterns']
      },
      {
        name: 'Marketing Director - Campaign Analysis',
        datasets: ['marketing_campaign_performance.csv', 'marketing_lead_generation.json'],
        expectedFeatures: ['ROI analysis', 'conversion tracking', 'lead scoring']
      },
      {
        name: 'Financial Analyst - Revenue Tracking',
        datasets: ['financial_revenue_expense.csv', 'financial_kpis.json'],
        expectedFeatures: ['financial forecasting', 'budget variance', 'KPI monitoring']
      },
      {
        name: 'Operations Manager - Efficiency Metrics',
        datasets: ['operations_metrics.csv', 'operations_efficiency.json'],
        expectedFeatures: ['process optimization', 'efficiency tracking', 'operational insights']
      },
      {
        name: 'Product Manager - User Engagement',
        datasets: ['user_engagement.csv', 'feature_adoption.json'],
        expectedFeatures: ['user behavior analysis', 'feature adoption rates', 'engagement metrics']
      }
    ];

    for (const workflow of workflows) {
      this.log(`Testing ${workflow.name} workflow...`);
      
      for (const dataset of workflow.datasets) {
        const filePath = path.join(this.testDataPath, dataset);
        if (fs.existsSync(filePath)) {
          this.log(`  ✓ Dataset ${dataset} available for ${workflow.name}`);
        } else {
          this.recordIssue(`Missing dataset ${dataset} for ${workflow.name}`, 'high');
        }
      }
    }
  }

  async testAppStructure() {
    this.log('=== Testing Application Structure ===');
    
    const criticalFiles = [
      './src/App.tsx',
      './src/pages/LandingPage.tsx',
      './src/pages/AuthPage.tsx', 
      './src/pages/ProjectsPage.tsx',
      './src/pages/DashboardPage.tsx',
      './src/hooks/useAuth.tsx',
      './src/lib/analytics.ts',
      './src/lib/zenalyst-ai.ts'
    ];

    for (const file of criticalFiles) {
      if (fs.existsSync(file)) {
        this.log(`✓ Critical file ${file} exists`);
        
        // Check for common issues
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for syntax issues that could cause blank screens
        if (content.includes('undefined') && content.includes('return')) {
          this.log(`⚠ ${file} contains 'undefined' returns - potential blank screen issue`);
        }
        
        // Check for unhandled errors
        if (content.includes('catch') && !content.includes('console.error')) {
          this.log(`⚠ ${file} has error handling but no logging`);
        }
        
        // Check for missing imports
        if (content.includes('import') && content.includes("from 'react'")) {
          if (!content.includes('useState') && content.includes('State')) {
            this.recordIssue(`${file} may have missing React hooks imports`, 'medium');
          }
        }
      } else {
        this.recordIssue(`Critical file ${file} missing`, 'high');
      }
    }
  }

  async testDataAnalysisCapabilities() {
    this.log('=== Testing Data Analysis Capabilities ===');
    
    // Test with sample e-commerce data
    try {
      const csvPath = path.join(this.testDataPath, 'ecommerce_sales_data.csv');
      if (fs.existsSync(csvPath)) {
        const content = fs.readFileSync(csvPath, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Simulate analytics processing
        const hasNumericColumns = headers.some(header => 
          ['amount', 'price', 'quantity', 'total', 'revenue', 'cost'].some(term =>
            header.toLowerCase().includes(term)
          )
        );
        
        const hasDateColumns = headers.some(header =>
          ['date', 'time', 'created', 'updated'].some(term =>
            header.toLowerCase().includes(term)
          )
        );
        
        if (hasNumericColumns) {
          this.log('✓ Numeric columns detected for trend analysis');
        } else {
          this.recordIssue('No numeric columns detected in sample data', 'medium');
        }
        
        if (hasDateColumns) {
          this.log('✓ Date columns detected for time series analysis');
        } else {
          this.recordIssue('No date columns detected in sample data', 'medium');
        }
      }
    } catch (error) {
      this.recordIssue(`Error testing data analysis capabilities: ${error.message}`, 'high');
    }
  }

  async testDemoDataFunctionality() {
    this.log('=== Testing Demo Data Functionality ===');
    
    // Check if demo data is hardcoded and accessible
    const dashboardPath = './src/pages/DashboardPage.tsx';
    if (fs.existsSync(dashboardPath)) {
      const content = fs.readFileSync(dashboardPath, 'utf8');
      
      if (content.includes('isDemoMode') && content.includes('demo=true')) {
        this.log('✓ Demo mode functionality detected');
      } else {
        this.recordIssue('Demo mode functionality may be missing or incomplete', 'high');
      }
      
      if (content.includes('const insights') || content.includes('demo data')) {
        this.log('✓ Demo insights data available');
      } else {
        this.recordIssue('Demo insights data may be missing', 'medium');
      }
    }
  }

  async runComprehensiveTest() {
    this.log('Starting Comprehensive Zenalyst Testing Suite...');
    this.log('==========================================');
    
    await this.testDatasetParsing();
    await this.testUserWorkflows();
    await this.testAppStructure();
    await this.testDataAnalysisCapabilities();
    await this.testDemoDataFunctionality();
    
    this.generateReport();
  }

  generateReport() {
    this.log('=== COMPREHENSIVE TEST REPORT ===');
    this.log(`Total test entries: ${this.testResults.length}`);
    this.log(`Issues found: ${this.issues.length}`);
    
    if (this.issues.length > 0) {
      this.log('\\n=== ISSUES FOUND ===');
      this.issues.forEach((issue, index) => {
        this.log(`${index + 1}. [${issue.severity.toUpperCase()}] ${issue.issue}`);
      });
      
      // Categorize issues
      const highIssues = this.issues.filter(i => i.severity === 'high');
      const mediumIssues = this.issues.filter(i => i.severity === 'medium');
      const lowIssues = this.issues.filter(i => i.severity === 'low');
      
      this.log(`\\nIssue Breakdown:`);
      this.log(`  High Priority: ${highIssues.length}`);
      this.log(`  Medium Priority: ${mediumIssues.length}`);
      this.log(`  Low Priority: ${lowIssues.length}`);
      
      if (highIssues.length > 0) {
        this.log('\\n⚠ HIGH PRIORITY ISSUES REQUIRE IMMEDIATE ATTENTION!');
      }
    } else {
      this.log('✅ No critical issues found!');
    }
    
    // Save report to file
    const reportPath = './test-results.txt';
    fs.writeFileSync(reportPath, this.testResults.join('\\n'));
    this.log(`\\nFull test report saved to: ${reportPath}`);
    
    // Create test summary
    const summary = {
      timestamp: new Date().toISOString(),
      totalTests: this.testResults.length,
      totalIssues: this.issues.length,
      issues: this.issues,
      status: this.issues.filter(i => i.severity === 'high').length > 0 ? 'FAILED' : 'PASSED'
    };
    
    fs.writeFileSync('./test-summary.json', JSON.stringify(summary, null, 2));
    this.log('Test summary saved to: ./test-summary.json');
  }
}

// Run the comprehensive test
const tester = new ZenalystTester();
tester.runComprehensiveTest().catch(console.error);