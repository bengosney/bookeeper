terraform {
  required_providers {
    dokku = {
      source = "aliksend/dokku"
      version = "1.0.18"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  required_version = ">= 1.2.0"
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "ssh_cert" {
  type        = string
  description = "SSH cert"
  default     = "~/.ssh/id_rsa"
}

variable "ssh_host" {
  type        = string
  description = "SSH host"
}

variable "docker_image" {
  type        = string
  description = "Docker image"
}

variable "domain" {
  type        = string
  description = "Domain"
}

provider "dokku" {
  ssh_host     = var.ssh_host
  ssh_cert     = var.ssh_cert
}

resource "dokku_app" "cover_proxy" {
  app_name = "cover-proxy"

  ports = {
    80 = {
      scheme         = "http"
      container_port = 80
    }
  }

  domains = [var.domain]

  deploy = {
    type         = "docker_image"
    docker_image = var.docker_image
  }
}

resource "cloudflare_record" "cover" {
  name            = "covers"
  proxied         = true
  type            = "CNAME"
  content         = var.ssh_host
  zone_id         = var.cloudflare_zone_id
  allow_overwrite = true
}
