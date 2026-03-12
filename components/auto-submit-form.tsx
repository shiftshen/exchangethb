'use client';

import { useEffect, useRef } from 'react';
import { isCompletePositiveDecimal } from '@/lib/amounts';

export function AutoSubmitForm({
  children,
  className,
  delayMs = 350,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement> & { delayMs?: number }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function queueSubmit() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      formRef.current?.requestSubmit();
    }, delayMs);
  }

  function syncTargetValue(target: EventTarget | null) {
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) {
      return;
    }

    const syncTarget = target.dataset.syncTarget;
    if (!syncTarget || !formRef.current) return;

    const linkedInput = formRef.current.querySelector<HTMLInputElement>(`input[type="hidden"][name="${syncTarget}"]`);
    if (!linkedInput) return;
    linkedInput.value = target.value;
  }

  function shouldAutoSubmit() {
    const form = formRef.current;
    if (!form) return false;

    const decimalInputs = form.querySelectorAll<HTMLInputElement>('input[data-decimal-input="true"]');
    for (const input of decimalInputs) {
      if (!input.value.trim()) return false;
      if (!isCompletePositiveDecimal(input.value)) return false;
    }

    const integerInputs = form.querySelectorAll<HTMLInputElement>('input[data-integer-input="true"]');
    for (const input of integerInputs) {
      if (!/^\d+$/.test(input.value.trim())) return false;
    }

    return true;
  }

  function disableSyncControls(disabled: boolean) {
    if (!formRef.current) return;
    const controls = formRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[data-sync-target]');
    controls.forEach((control) => {
      control.disabled = disabled;
    });
  }

  return (
    <form
      {...props}
      ref={formRef}
      className={className}
      onSubmit={(event) => {
        props.onSubmit?.(event);
        if (event.defaultPrevented) return;
        disableSyncControls(true);
      }}
      onInput={(event) => {
        props.onInput?.(event);
        disableSyncControls(false);
        syncTargetValue(event.target);
        if (!shouldAutoSubmit()) return;
        queueSubmit();
      }}
      onChange={(event) => {
        props.onChange?.(event);
        disableSyncControls(false);
        syncTargetValue(event.target);
        if (!shouldAutoSubmit()) return;
        queueSubmit();
      }}
    >
      {children}
    </form>
  );
}
