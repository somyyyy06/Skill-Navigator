-- Add 6 new roadmaps: DevOps, Mobile, Cybersecurity, Cloud, Blockchain, Full-Stack

-- DevOps Engineer
DO $$
DECLARE
  roadmap_id INT;
BEGIN
  INSERT INTO roadmaps (slug, title, description, category, difficulty, created_at)
  VALUES ('devops-engineer', 'DevOps Engineer', 'Automate, deploy, and manage scalable infrastructure.', 'devops', 'intermediate', NOW())
  RETURNING id INTO roadmap_id;

  INSERT INTO steps (roadmap_id, title, description, content, "order", estimated_minutes, resources)
  VALUES
    (roadmap_id, 'Linux System Administration', 'Master Linux System Administration in this detailed learning guide.', '# Linux System Administration

This guide covers the core concepts and practical implementations of Linux System Administration.', 1, 60, '[]'),
    (roadmap_id, 'Git & Version Control', 'Master Git & Version Control in this detailed learning guide.', '# Git & Version Control

This guide covers the core concepts and practical implementations of Git & Version Control.', 2, 60, '[]'),
    (roadmap_id, 'Docker Fundamentals', 'Master Docker Fundamentals in this detailed learning guide.', '# Docker Fundamentals

This guide covers the core concepts and practical implementations of Docker Fundamentals.', 3, 60, '[]'),
    (roadmap_id, 'Kubernetes Orchestration', 'Master Kubernetes Orchestration in this detailed learning guide.', '# Kubernetes Orchestration

This guide covers the core concepts and practical implementations of Kubernetes Orchestration.', 4, 60, '[]'),
    (roadmap_id, 'CI/CD Pipeline Design', 'Master CI/CD Pipeline Design in this detailed learning guide.', '# CI/CD Pipeline Design

This guide covers the core concepts and practical implementations of CI/CD Pipeline Design.', 5, 60, '[]'),
    (roadmap_id, 'Infrastructure as Code (Terraform)', 'Master Infrastructure as Code (Terraform) in this detailed learning guide.', '# Infrastructure as Code (Terraform)

This guide covers the core concepts and practical implementations of Infrastructure as Code (Terraform).', 6, 60, '[]'),
    (roadmap_id, 'Monitoring & Logging', 'Master Monitoring & Logging in this detailed learning guide.', '# Monitoring & Logging

This guide covers the core concepts and practical implementations of Monitoring & Logging.', 7, 60, '[]'),
    (roadmap_id, 'Cloud Platform Basics', 'Master Cloud Platform Basics in this detailed learning guide.', '# Cloud Platform Basics

This guide covers the core concepts and practical implementations of Cloud Platform Basics.', 8, 60, '[]'),
    (roadmap_id, 'DevOps Best Practices', 'Master DevOps Best Practices in this detailed learning guide.', '# DevOps Best Practices

This guide covers the core concepts and practical implementations of DevOps Best Practices.', 9, 60, '[]');
END $$;

-- Mobile Developer
DO $$
DECLARE
  roadmap_id INT;
BEGIN
  INSERT INTO roadmaps (slug, title, description, category, difficulty, created_at)
  VALUES ('mobile-developer', 'Mobile Developer', 'Create native and cross-platform mobile applications.', 'mobile', 'beginner', NOW())
  RETURNING id INTO roadmap_id;

  INSERT INTO steps (roadmap_id, title, description, content, "order", estimated_minutes, resources)
  VALUES
    (roadmap_id, 'Mobile Development Overview', 'Master Mobile Development Overview in this detailed learning guide.', '# Mobile Development Overview

This guide covers the core concepts and practical implementations of Mobile Development Overview.', 1, 60, '[]'),
    (roadmap_id, 'React Native Basics', 'Master React Native Basics in this detailed learning guide.', '# React Native Basics

This guide covers the core concepts and practical implementations of React Native Basics.', 2, 60, '[]'),
    (roadmap_id, 'Component Architecture', 'Master Component Architecture in this detailed learning guide.', '# Component Architecture

This guide covers the core concepts and practical implementations of Component Architecture.', 3, 60, '[]'),
    (roadmap_id, 'State Management in Mobile', 'Master State Management in Mobile in this detailed learning guide.', '# State Management in Mobile

This guide covers the core concepts and practical implementations of State Management in Mobile.', 4, 60, '[]'),
    (roadmap_id, 'Navigation & Routing', 'Master Navigation & Routing in this detailed learning guide.', '# Navigation & Routing

This guide covers the core concepts and practical implementations of Navigation & Routing.', 5, 60, '[]'),
    (roadmap_id, 'API Integration & Networking', 'Master API Integration & Networking in this detailed learning guide.', '# API Integration & Networking

This guide covers the core concepts and practical implementations of API Integration & Networking.', 6, 60, '[]'),
    (roadmap_id, 'Local Storage & Persistence', 'Master Local Storage & Persistence in this detailed learning guide.', '# Local Storage & Persistence

This guide covers the core concepts and practical implementations of Local Storage & Persistence.', 7, 60, '[]'),
    (roadmap_id, 'Mobile UI/UX Patterns', 'Master Mobile UI/UX Patterns in this detailed learning guide.', '# Mobile UI/UX Patterns

This guide covers the core concepts and practical implementations of Mobile UI/UX Patterns.', 8, 60, '[]'),
    (roadmap_id, 'Publishing to App Stores', 'Master Publishing to App Stores in this detailed learning guide.', '# Publishing to App Stores

This guide covers the core concepts and practical implementations of Publishing to App Stores.', 9, 60, '[]');
END $$;

-- Cybersecurity Specialist
DO $$
DECLARE
  roadmap_id INT;
BEGIN
  INSERT INTO roadmaps (slug, title, description, category, difficulty, created_at)
  VALUES ('cybersecurity-specialist', 'Cybersecurity Specialist', 'Protect systems and data from cyber threats.', 'cybersecurity', 'advanced', NOW())
  RETURNING id INTO roadmap_id;

  INSERT INTO steps (roadmap_id, title, description, content, "order", estimated_minutes, resources)
  VALUES
    (roadmap_id, 'Network Security Fundamentals', 'Master Network Security Fundamentals in this detailed learning guide.', '# Network Security Fundamentals

This guide covers the core concepts and practical implementations of Network Security Fundamentals.', 1, 60, '[]'),
    (roadmap_id, 'Cryptography & Encryption', 'Master Cryptography & Encryption in this detailed learning guide.', '# Cryptography & Encryption

This guide covers the core concepts and practical implementations of Cryptography & Encryption.', 2, 60, '[]'),
    (roadmap_id, 'Ethical Hacking Basics', 'Master Ethical Hacking Basics in this detailed learning guide.', '# Ethical Hacking Basics

This guide covers the core concepts and practical implementations of Ethical Hacking Basics.', 3, 60, '[]'),
    (roadmap_id, 'Penetration Testing Methods', 'Master Penetration Testing Methods in this detailed learning guide.', '# Penetration Testing Methods

This guide covers the core concepts and practical implementations of Penetration Testing Methods.', 4, 60, '[]'),
    (roadmap_id, 'Web Application Security', 'Master Web Application Security in this detailed learning guide.', '# Web Application Security

This guide covers the core concepts and practical implementations of Web Application Security.', 5, 60, '[]'),
    (roadmap_id, 'Threat Detection & Analysis', 'Master Threat Detection & Analysis in this detailed learning guide.', '# Threat Detection & Analysis

This guide covers the core concepts and practical implementations of Threat Detection & Analysis.', 6, 60, '[]'),
    (roadmap_id, 'Security Compliance & Standards', 'Master Security Compliance & Standards in this detailed learning guide.', '# Security Compliance & Standards

This guide covers the core concepts and practical implementations of Security Compliance & Standards.', 7, 60, '[]'),
    (roadmap_id, 'Incident Response & Forensics', 'Master Incident Response & Forensics in this detailed learning guide.', '# Incident Response & Forensics

This guide covers the core concepts and practical implementations of Incident Response & Forensics.', 8, 60, '[]'),
    (roadmap_id, 'Advanced Security Operations', 'Master Advanced Security Operations in this detailed learning guide.', '# Advanced Security Operations

This guide covers the core concepts and practical implementations of Advanced Security Operations.', 9, 60, '[]');
END $$;

-- Cloud Architect
DO $$
DECLARE
  roadmap_id INT;
BEGIN
  INSERT INTO roadmaps (slug, title, description, category, difficulty, created_at)
  VALUES ('cloud-architect', 'Cloud Architect', 'Design and manage cloud infrastructure at scale.', 'cloud', 'intermediate', NOW())
  RETURNING id INTO roadmap_id;

  INSERT INTO steps (roadmap_id, title, description, content, "order", estimated_minutes, resources)
  VALUES
    (roadmap_id, 'Cloud Computing Fundamentals', 'Master Cloud Computing Fundamentals in this detailed learning guide.', '# Cloud Computing Fundamentals

This guide covers the core concepts and practical implementations of Cloud Computing Fundamentals.', 1, 60, '[]'),
    (roadmap_id, 'AWS Core Services', 'Master AWS Core Services in this detailed learning guide.', '# AWS Core Services

This guide covers the core concepts and practical implementations of AWS Core Services.', 2, 60, '[]'),
    (roadmap_id, 'Azure Platform Overview', 'Master Azure Platform Overview in this detailed learning guide.', '# Azure Platform Overview

This guide covers the core concepts and practical implementations of Azure Platform Overview.', 3, 60, '[]'),
    (roadmap_id, 'Cloud Networking & VPC', 'Master Cloud Networking & VPC in this detailed learning guide.', '# Cloud Networking & VPC

This guide covers the core concepts and practical implementations of Cloud Networking & VPC.', 4, 60, '[]'),
    (roadmap_id, 'Serverless Architecture', 'Master Serverless Architecture in this detailed learning guide.', '# Serverless Architecture

This guide covers the core concepts and practical implementations of Serverless Architecture.', 5, 60, '[]'),
    (roadmap_id, 'Cloud Storage Solutions', 'Master Cloud Storage Solutions in this detailed learning guide.', '# Cloud Storage Solutions

This guide covers the core concepts and practical implementations of Cloud Storage Solutions.', 6, 60, '[]'),
    (roadmap_id, 'Identity & Access Management', 'Master Identity & Access Management in this detailed learning guide.', '# Identity & Access Management

This guide covers the core concepts and practical implementations of Identity & Access Management.', 7, 60, '[]'),
    (roadmap_id, 'Cost Optimization Strategies', 'Master Cost Optimization Strategies in this detailed learning guide.', '# Cost Optimization Strategies

This guide covers the core concepts and practical implementations of Cost Optimization Strategies.', 8, 60, '[]'),
    (roadmap_id, 'Cloud Migration Patterns', 'Master Cloud Migration Patterns in this detailed learning guide.', '# Cloud Migration Patterns

This guide covers the core concepts and practical implementations of Cloud Migration Patterns.', 9, 60, '[]');
END $$;

-- Blockchain Developer
DO $$
DECLARE
  roadmap_id INT;
BEGIN
  INSERT INTO roadmaps (slug, title, description, category, difficulty, created_at)
  VALUES ('blockchain-developer', 'Blockchain Developer', 'Build decentralized applications and smart contracts.', 'blockchain', 'advanced', NOW())
  RETURNING id INTO roadmap_id;

  INSERT INTO steps (roadmap_id, title, description, content, "order", estimated_minutes, resources)
  VALUES
    (roadmap_id, 'Blockchain Fundamentals', 'Master Blockchain Fundamentals in this detailed learning guide.', '# Blockchain Fundamentals

This guide covers the core concepts and practical implementations of Blockchain Fundamentals.', 1, 60, '[]'),
    (roadmap_id, 'Ethereum & Smart Contracts', 'Master Ethereum & Smart Contracts in this detailed learning guide.', '# Ethereum & Smart Contracts

This guide covers the core concepts and practical implementations of Ethereum & Smart Contracts.', 2, 60, '[]'),
    (roadmap_id, 'Solidity Programming', 'Master Solidity Programming in this detailed learning guide.', '# Solidity Programming

This guide covers the core concepts and practical implementations of Solidity Programming.', 3, 60, '[]'),
    (roadmap_id, 'Web3.js Integration', 'Master Web3.js Integration in this detailed learning guide.', '# Web3.js Integration

This guide covers the core concepts and practical implementations of Web3.js Integration.', 4, 60, '[]'),
    (roadmap_id, 'DApp Development', 'Master DApp Development in this detailed learning guide.', '# DApp Development

This guide covers the core concepts and practical implementations of DApp Development.', 5, 60, '[]'),
    (roadmap_id, 'Token Standards (ERC-20, ERC-721)', 'Master Token Standards (ERC-20, ERC-721) in this detailed learning guide.', '# Token Standards (ERC-20, ERC-721)

This guide covers the core concepts and practical implementations of Token Standards (ERC-20, ERC-721).', 6, 60, '[]'),
    (roadmap_id, 'DeFi Protocols', 'Master DeFi Protocols in this detailed learning guide.', '# DeFi Protocols

This guide covers the core concepts and practical implementations of DeFi Protocols.', 7, 60, '[]'),
    (roadmap_id, 'Security Best Practices', 'Master Security Best Practices in this detailed learning guide.', '# Security Best Practices

This guide covers the core concepts and practical implementations of Security Best Practices.', 8, 60, '[]'),
    (roadmap_id, 'Deployment & Testing', 'Master Deployment & Testing in this detailed learning guide.', '# Deployment & Testing

This guide covers the core concepts and practical implementations of Deployment & Testing.', 9, 60, '[]');
END $$;

-- Full-Stack Developer
DO $$
DECLARE
  roadmap_id INT;
BEGIN
  INSERT INTO roadmaps (slug, title, description, category, difficulty, created_at)
  VALUES ('fullstack-developer', 'Full-Stack Developer', 'Master both frontend and backend development.', 'fullstack', 'intermediate', NOW())
  RETURNING id INTO roadmap_id;

  INSERT INTO steps (roadmap_id, title, description, content, "order", estimated_minutes, resources)
  VALUES
    (roadmap_id, 'HTML, CSS & JavaScript Mastery', 'Master HTML, CSS & JavaScript Mastery in this detailed learning guide.', '# HTML, CSS & JavaScript Mastery

This guide covers the core concepts and practical implementations of HTML, CSS & JavaScript Mastery.', 1, 60, '[]'),
    (roadmap_id, 'Modern Frontend Frameworks', 'Master Modern Frontend Frameworks in this detailed learning guide.', '# Modern Frontend Frameworks

This guide covers the core concepts and practical implementations of Modern Frontend Frameworks.', 2, 60, '[]'),
    (roadmap_id, 'Backend Architecture Patterns', 'Master Backend Architecture Patterns in this detailed learning guide.', '# Backend Architecture Patterns

This guide covers the core concepts and practical implementations of Backend Architecture Patterns.', 3, 60, '[]'),
    (roadmap_id, 'Database Design & Optimization', 'Master Database Design & Optimization in this detailed learning guide.', '# Database Design & Optimization

This guide covers the core concepts and practical implementations of Database Design & Optimization.', 4, 60, '[]'),
    (roadmap_id, 'RESTful & GraphQL APIs', 'Master RESTful & GraphQL APIs in this detailed learning guide.', '# RESTful & GraphQL APIs

This guide covers the core concepts and practical implementations of RESTful & GraphQL APIs.', 5, 60, '[]'),
    (roadmap_id, 'Authentication & Authorization', 'Master Authentication & Authorization in this detailed learning guide.', '# Authentication & Authorization

This guide covers the core concepts and practical implementations of Authentication & Authorization.', 6, 60, '[]'),
    (roadmap_id, 'Deployment & Hosting', 'Master Deployment & Hosting in this detailed learning guide.', '# Deployment & Hosting

This guide covers the core concepts and practical implementations of Deployment & Hosting.', 7, 60, '[]'),
    (roadmap_id, 'Performance Optimization', 'Master Performance Optimization in this detailed learning guide.', '# Performance Optimization

This guide covers the core concepts and practical implementations of Performance Optimization.', 8, 60, '[]'),
    (roadmap_id, 'Full-Stack Project Integration', 'Master Full-Stack Project Integration in this detailed learning guide.', '# Full-Stack Project Integration

This guide covers the core concepts and practical implementations of Full-Stack Project Integration.', 9, 60, '[]');
END $$;
