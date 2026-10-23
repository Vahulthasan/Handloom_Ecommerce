import { Container, Order, OrderItem } from '@/types';

/**
 * Calculates total container slot units required for an order.
 * Each product defines units_per_container_slot (how much space 1 piece takes in ocean cargo).
 */
export function calculateOrderSlotUnits(items: OrderItem[]): number {
  return items.reduce((sum, item) => {
    const slotWeight = item.units_per_slot || 1;
    return sum + item.qty * slotWeight;
  }, 0);
}

/**
 * Finds or creates an open container and allocates order units into it.
 * 
 * POOLED SHIPPING CONTAINER LOGIC:
 * 1. Find currently open container. If none exists, create a new one.
 * 2. Calculate order slot units needed.
 * 3. If adding this order will cause container to reach or exceed capacity:
 *    - Allocate units up to available space.
 *    - Mark current container status as 'full'.
 *    - Open a new container for subsequent orders.
 *    - (For simple, transparent tracking, we assign the order to the primary container that triggered completion).
 */
export function allocateOrderToContainer(
  order: Order,
  containers: Container[],
  defaultCapacity: number = 200
): {
  assignedContainerId: string;
  updatedContainers: Container[];
  containerBecameFull: boolean;
  containerLabel: string;
} {
  const unitsNeeded = calculateOrderSlotUnits(order.items);
  const containerList = [...containers];

  // Look for currently open container
  let openContainerIndex = containerList.findIndex((c) => c.status === 'open');

  // If no open container exists, spin up a new container
  if (openContainerIndex === -1) {
    const nextSeq = containerList.length + 1;
    const year = new Date().getFullYear();
    const newContainer: Container = {
      id: `cont_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      label: `Container #EU-${year}-${String(nextSeq).padStart(2, '0')}`,
      capacity_units: defaultCapacity,
      used_units: 0,
      status: 'open',
      estimated_ship_date: 'mid-November (to be confirmed)',
      tracking_note: 'Pending pooling completion at Nhava Sheva Port, India',
      created_at: new Date().toISOString(),
      shipped_at: null,
      delivered_at: null,
    };
    containerList.push(newContainer);
    openContainerIndex = containerList.length - 1;
  }

  const currentContainer = { ...containerList[openContainerIndex] };
  const spaceRemaining = currentContainer.capacity_units - currentContainer.used_units;
  let containerBecameFull = false;

  if (unitsNeeded >= spaceRemaining) {
    // Container capacity reached!
    currentContainer.used_units = Math.min(
      currentContainer.capacity_units,
      currentContainer.used_units + unitsNeeded
    );
    currentContainer.status = 'full';
    containerBecameFull = true;
    console.log(`[CONTAINER EVENT] ${currentContainer.label} reached full capacity (${currentContainer.used_units}/${currentContainer.capacity_units}). Notifying admin for sea booking.`);
  } else {
    currentContainer.used_units += unitsNeeded;
  }

  containerList[openContainerIndex] = currentContainer;

  return {
    assignedContainerId: currentContainer.id,
    updatedContainers: containerList,
    containerBecameFull,
    containerLabel: currentContainer.label,
  };
}

/**
 * Returns the fill percentage of a container, safely capped at 100%.
 */
export function getContainerFillPercentage(container: Container): number {
  if (!container || container.capacity_units <= 0) return 0;
  const pct = Math.round((container.used_units / container.capacity_units) * 100);
  return Math.min(100, Math.max(0, pct));
}
