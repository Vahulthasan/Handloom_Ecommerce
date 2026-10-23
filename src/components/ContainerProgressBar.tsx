import React from 'react';
import { Container } from '@/types';
import { getContainerFillPercentage } from '@/lib/container-logic';
import { Ship, Calendar, Anchor } from 'lucide-react';

interface ContainerProgressBarProps {
  container: Container;
  showDetails?: boolean;
}

export default function ContainerProgressBar({ container, showDetails = true }: ContainerProgressBarProps) {
  const percentage = getContainerFillPercentage(container);

  return (
    <div className="w-full bg-white dark:bg-[#16221d] rounded-xl border border-[#d2dbd4] dark:border-[#273b33] p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#173f34] text-[#e5a439]">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                {container.label}
              </h3>
              <span
                className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                  container.status === 'open'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    : container.status === 'full'
                    ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                    : container.status === 'shipped'
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {container.status === 'open'
                  ? `Active Pooling: ${percentage}% Full`
                  : container.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Ocean Sea Container pooled with individual European customer orders
            </p>
          </div>
        </div>

        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
          <span className="font-heading font-black text-lg text-[#173f34] dark:text-[#e5a439]">
            {percentage}% Full
          </span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            {container.used_units} / {container.capacity_units} slot units
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="relative w-full h-3.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#173f34] via-[#23594b] to-[#c68a24] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showDetails && (
        <div className="mt-3.5 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-600 dark:text-gray-400 gap-2">
          <div className="flex items-center gap-1.5">
            <Anchor className="w-3.5 h-3.5 text-[#c68a24]" />
            <span>Route: Port Nhava Sheva (India) ➔ Rotterdam / Hamburg (EU)</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#173f34] dark:text-[#e5a439]" />
            <span>
              Estimated ship window:{' '}
              <strong className="text-[#173f34] dark:text-[#e5a439]">
                {container.estimated_ship_date || 'to be announced'}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
