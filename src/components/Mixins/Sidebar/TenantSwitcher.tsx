import React from 'react';
import { ChevronsUpDown, Building2, Check } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

interface TenantSwitcherProps {
  currentTenant: Tenant;
  tenants: Tenant[];
  onTenantChange?: (tenant: Tenant) => void;
}

export function TenantSwitcher({ currentTenant, tenants, onTenantChange }: TenantSwitcherProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent py-8 data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Organisasi</span>
                <span className="text-xs text-muted-foreground">{currentTenant.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
            {tenants.map((tenant) => (
              <DropdownMenuItem
                key={tenant.id}
                onClick={() => onTenantChange?.(tenant)}
                className="flex items-center gap-2"
              >
                <Building2 className="size-4" />
                <span>{tenant.name}</span>
                {tenant.id === currentTenant.id && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    <Check />
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
