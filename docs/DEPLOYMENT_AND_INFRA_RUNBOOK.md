# CAVDAX-FlagSmith Production Deployment & Infrastructure Runbook
**Domain:** `https://cavdax-flagsmith.sahnirmaan.live`  
**Classification:** Operational Runbook, Cloudflare DNS & AWS EC2 Provisioning Guide  
**Maintained by:** Suneet-MASTER-Documentation-Product-Manager-Skill  
**Target Event:** Toggle Wars — The Flagsmith Experimentation Hackathon (Track 03)  
**Last Updated:** 2026-11-26

---

## 1. Architecture Overview & Infrastructure Topology

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 INFRASTRUCTURE & TRAFFIC FLOW                               │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  USER BROWSER / JUDGE                                                                       │
│          │                                                                                  │
│          ▼ HTTPS (Port 443)                                                                 │
│  ┌──────────────────────────────────────────────────────────────┐                           │
│  │ Cloudflare Edge Network (sahnirmaan.live)                   │                           │
│  │   • Hostname: cavdax-flagsmith.sahnirmaan.live               │                           │
│  │   • Proxy: Proxied (Orange Cloud)                            │                           │
│  │   • SSL: Full (strict) or Full                              │                           │
│  │   • DDoS Protection & Edge Caching Enabled                   │                           │
│  └──────────────────────────────────────────────────────────────┘                           │
│          │                                                                                  │
│          ▼ Proxied HTTPS (Port 443 / 80)                                                    │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Dedicated AWS EC2 Instance (t3.small - 2 GB RAM, 2 vCPUs)                            │  │
│  │                                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │ Caddy Reverse Proxy (Container: cavdax-caddy, Ports: 80, 443)                   │  │  │
│  │  │   • Host routing: cavdax-flagsmith.sahnirmaan.live                              │  │  │
│  │  │   • TLS: Internal (Edge terminated by Cloudflare)                               │  │  │
│  │  └──────────────────┬──────────────────────────┬──────────────────────────┬────────┘  │  │
│  │                     │                          │                          │           │  │
│  │      handle /api/*  │        handle /*         │    handle /flagsmith/*   │           │  │
│  │                     ▼                          ▼                          ▼           │  │
│  │  ┌───────────────────────┐  ┌──────────────────────┐  ┌────────────────────────────┐  │  │
│  │  │ CAVDAX Node.js Server │  │ React Vite Web HUD   │  │ Self-Hosted Flagsmith API  │  │  │
│  │  │ (:3000)               │  │ (:5173 preview)      │  │ (:8000)                    │  │  │
│  │  └──────────┬────────────┘  └──────────────────────┘  └─────────────┬──────────────┘  │  │
│  │             │                                                       │                 │  │
│  │             ▼ Redis protocol (:6379)                                ▼ Postgres (:5432)│  │
│  │  ┌───────────────────────┐                            ┌────────────────────────────┐  │  │
│  │  │ FalkorDB Graph Engine │                            │ Flagsmith PostgreSQL DB    │  │  │
│  │  │ (GraphBLAS Store)     │                            │ (Self-Hosted State Store)  │  │  │
│  │  └───────────────────────┘                            └────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Step 1: Cloudflare DNS Setup

Log in to the **Cloudflare Dashboard** and select zone `sahnirmaan.live`.

### 2.1 Add DNS Record
1. Navigate to **DNS** &rarr; **Records** &rarr; **Add record**.
2. Configure with the exact values:

| Field | Value | Notes |
|---|---|---|
| **Type** | `A` | IPv4 address pointer |
| **Name** | `cavdax-flagsmith` | Creates `cavdax-flagsmith.sahnirmaan.live` |
| **IPv4 Address** | `<YOUR_AWS_EC2_PUBLIC_IP>` | Public IPv4 of your new EC2 instance |
| **Proxy Status** | **Proxied (Orange Cloud)** | Mandatory: hides origin IP, provides edge TLS & WAF |
| **TTL** | `Auto` | Cloudflare edge managed |

3. Click **Save**.

### 2.2 Verify SSL/TLS Encryption Mode
1. In the sidebar, go to **SSL/TLS** &rarr; **Overview**.
2. Ensure encryption mode is set to **Full** (or **Full (strict)** if you install an origin cert).

---

## 3. Step 2: AWS EC2 Instance Provisioning

### 3.1 Instance Specifications
* **Region:** Same region as your existing infrastructure (e.g. `ap-south-1` Mumbai or `us-east-1`).
* **AMI:** **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type** (64-bit x86).
* **Instance Type:** **`t3.small`** (2 vCPUs, 2.0 GiB Memory).
  > **DEVIL'S ADVOCATE ADVISORY:** Do not use `t2.micro` or `t3.micro` (1 GB RAM). Running FalkorDB, PostgreSQL, Flagsmith Python engine, and the Node server simultaneously will exhaust 1 GB and trigger Linux kernel OOM kills.
* **Storage:** 20 GiB gp3 root volume.
* **Key Pair:** Select your existing `.pem` key pair or generate a new one (e.g., `cavdax-flagsmith-key.pem`).

### 3.2 Security Group Inbound Rules
Configure a dedicated Security Group named `cavdax-flagsmith-sg`:

| Type | Port Range | Source | Reason |
|---|---|---|---|
| **SSH** | `22` | `My IP` (or GitHub Actions CIDR) | Secure shell administration |
| **HTTP** | `80` | `0.0.0.0/0` (or Cloudflare IP ranges) | ACME / HTTP verification & redirect |
| **HTTPS** | `443` | `0.0.0.0/0` (or Cloudflare IP ranges) | Secure web traffic via Cloudflare Proxy |

> **CRITICAL SECURITY INVARIANT:** Never expose ports `6379` (FalkorDB), `5432` (PostgreSQL), `3000` (Node Backend), or `8000` (Flagsmith Internal API) directly to `0.0.0.0/0`. All internal traffic must communicate over the Docker bridge network via Caddy.

---

## 4. Step 3: Origin VM Initialization & Swap Configuration

SSH into the freshly launched EC2 instance:
```bash
ssh -i /path/to/cavdax-flagsmith-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

Execute the system bootstrap script:

```bash
# 1. Update package manager
sudo apt-get update && sudo apt-get upgrade -y

# 2. Configure 2GB Swap Space (Inviolable guard against memory spikes during container builds)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 3. Install Docker Engine & Docker Compose Plugin
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin git

# 4. Add ubuntu user to docker group
sudo usermod -aG docker $USER
newgrp docker

# 5. Verify installations
docker --version
docker compose version
```

---

## 5. Step 4: Clone Repository & Configure Environment

Clone the repository into `/home/ubuntu/CAVDAX-FlagSmith`:

```bash
cd /home/ubuntu
git clone https://github.com/CAVDAX/CAVDAX-FlagSmith.git
cd CAVDAX-FlagSmith

# Copy template to production environment file
cp .env.example .env
```

Edit `.env` (`nano .env`) and populate production values:

```bash
# Host Domain
DOMAIN=cavdax-flagsmith.sahnirmaan.live
CLIENT_URL=https://cavdax-flagsmith.sahnirmaan.live
ALLOWED_ORIGINS=https://cavdax-flagsmith.sahnirmaan.live

# FalkorDB Store
FALKORDB_HOST=falkordb
FALKORDB_PORT=6379
FALKORDB_GRAPH_NAME=cavdax_flagsmith_graph

# Flagsmith Self-Hosted Config
FLAGSMITH_API_URL=http://flagsmith-api:8000/api/v1
FLAGSMITH_DOMAIN=cavdax-flagsmith.sahnirmaan.live
FLAGSMITH_DB_PASSWORD=YOUR_STRONG_RANDOM_POSTGRES_PASS
FLAGSMITH_ADMIN_EMAIL=admin@sahnirmaan.live
FLAGSMITH_ADMIN_PASSWORD=YOUR_STRONG_FLAGS_ADMIN_PASS
FLAGSMITH_SYNC_INTERVAL_MS=30000

# Security Tokens
SESSION_SECRET=GENERATE_WITH_OPENSSL_RAND_HEX_32
MCP_API_TOKEN=GENERATE_WITH_OPENSSL_RAND_HEX_32
```

---

## 6. Step 5: Launch Containers via Production Compose

Run the multi-container stack in detached mode:

```bash
cd /home/ubuntu/CAVDAX-FlagSmith
docker compose -f infra/docker-compose.prod.yml up --build -d
```

Verify that all 5 services are healthy and running:
```bash
docker compose -f infra/docker-compose.prod.yml ps
```

Expected output:
```
NAME                    IMAGE                           STATUS                  PORTS
cavdax-caddy            caddy:2-alpine                  Up (healthy)            0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
cavdax-client           cavdax-flagsmith-client         Up                      5173/tcp
cavdax-falkordb         falkordb/falkordb:latest        Up (healthy)            6379/tcp
cavdax-flagsmith-api    flagsmith/flagsmith:latest      Up                      8000/tcp
cavdax-flagsmith-db     postgres:15-alpine              Up (healthy)            5432/tcp
cavdax-server           cavdax-flagsmith-server         Up                      3000/tcp
```

---

## 7. Step 6: GitHub Actions Automated CD Setup

To enable zero-touch deployments on every `git push origin main`:

1. Open your repository on GitHub: [github.com/CAVDAX/CAVDAX-FlagSmith](https://github.com/CAVDAX/CAVDAX-FlagSmith).
2. Go to **Settings** &rarr; **Secrets and variables** &rarr; **Actions**.
3. Click **New repository secret** and define the 4 parameters:

| Secret Name | Value | Example |
|---|---|---|
| `VM_HOST` | Public IP or DNS of EC2 instance | `13.232.xxx.xxx` |
| `VM_USER` | SSH username | `ubuntu` |
| `VM_SSH_KEY` | Entire private SSH Key content | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VM_APP_DIR` | Absolute repository root path | `/home/ubuntu/CAVDAX-FlagSmith` |

Now, `.github/workflows/deploy.yml` automatically triggers on push to `main`, tests the syntax, connects via SSH, and reloads the Docker containers with zero downtime.

---

## 8. Verification & Health Check Playbook

Once deployed, run these empirical validation checks from your local machine:

### 1. Test Gateway & Core Health
```bash
curl -I https://cavdax-flagsmith.sahnirmaan.live/api/health
```
*Expected: `HTTP/2 200` with `content-type: application/json`.*

### 2. Test Flagsmith Feature Flags Graph Query
```bash
curl -s https://cavdax-flagsmith.sahnirmaan.live/api/flagsmith/features | jq .
```
*Expected: JSON list of features with in-degree and out-degree metrics.*

### 3. Test GraphBLAS Multi-Hop Blast Radius
```bash
curl -s https://cavdax-flagsmith.sahnirmaan.live/api/flagsmith/blast-radius/dark_mode | jq .
```
*Expected: `downstream_impact_count: 2`, `risk_tier: "HIGH"`, `safe_to_disable: false`, latency `< 2.5ms`.*

### 4. Test Safe Toggle Proactive Guard
```bash
curl -s -X POST https://cavdax-flagsmith.sahnirmaan.live/api/flagsmith/safe-toggle \
  -H "Content-Type: application/json" \
  -d '{"flagName": "dark_mode", "enabled": false, "force": false}' | jq .
```
*Expected: `HTTP 409 Conflict` with `code: "BLAST_RADIUS_VIOLATION"`.*

---

## 9. Rollback Playbook

If an unrecoverable failure occurs during a live hackathon evaluation:
```bash
# 1. SSH into the instance
ssh -i cavdax-flagsmith-key.pem ubuntu@<IP>

# 2. Check running logs
cd /home/ubuntu/CAVDAX-FlagSmith
docker compose -f infra/docker-compose.prod.yml logs --tail=100 -f server

# 3. Rollback to prior known good commit
git checkout HEAD~1
docker compose -f infra/docker-compose.prod.yml up --build -d
```
