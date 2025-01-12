import { useEffect, useState } from 'react';
import { useThebeServer } from 'thebe-react';
import { useComputeOptions } from './providers';
import type { ThebeEventData, ThebeEventType } from 'thebe-core';
import { selectAreExecutionScopesBuilding, useExecutionScope } from './execute';

export function ConnectionStatusTray() {
  const { thebe } = useComputeOptions();
  const { connecting, ready: serverReady, error: serverError, events } = useThebeServer();
  const { slug, ready: scopeReady, state } = useExecutionScope();
  const [show, setShow] = useState(false);
  const [unsub, setUnsub] = useState<() => void | undefined>();
  const [status, setStatus] = useState<string>('[client] Connecting...');

  const error = serverError; // TODO scope bulding error handling || sessionError;
  const ready = serverReady && scopeReady;
  const busy = connecting || selectAreExecutionScopesBuilding(state, slug);

  const handleStatus = (event: any, data: ThebeEventData) => {
    setStatus(`[${data.subject}]: ${data.message}`);
  };

  useEffect(() => {
    if (!events) return;
    events.on('status' as ThebeEventType, handleStatus);
  }, [events]);

  useEffect(() => {
    if (!thebe) return;
    if (thebe?.useBinder || thebe?.useJupyterLite) {
      if (busy || error) {
        setShow(true);
      } else if (ready) {
        setTimeout(
          () => {
            setShow(false);
            unsub?.();
            setUnsub(undefined);
          },
          thebe?.useJupyterLite ? 3000 : 500,
        );
      }
    }
  }, [thebe, busy, ready, error]);

  const host = thebe?.useBinder ? 'Binder' : thebe?.useJupyterLite ? 'JupyterLite' : 'Local Server';

  // TODO radix ui toast!
  if (show && error) {
    return (
      <div className="fixed p-3 text-sm text-gray-700 bg-white border rounded shadow-lg bottom-2 sm:right-2 max-w-[90%] md:max-w-[300px] min-w-0">
        <div className="mb-2 font-semibold text-center">⛔️ Error connecting to {host} ⛔️</div>
        <div className="my-1 max-h-[15rem] mono overflow-hidden text-ellipsis">{error}</div>
        <div className="flex justify-end">
          <div
            className="text-xs cursor-pointer hover:underline"
            role="button"
            onClick={() => setShow(false)}
          >
            dismiss
          </div>
        </div>
      </div>
    );
  }

  if (show && thebe?.useJupyterLite) {
    return (
      <div className="fixed p-3 text-sm text-gray-700 bg-white border rounded shadow-lg bottom-2 sm:right-2 max-w-[90%] md:max-w-[300px] min-w-0">
        <div className="mb-1 font-semibold text-center">⚡️ Connecting to {host} ⚡️</div>
        {!ready && <div className="max-h-[5rem] mono overflow-hidden text-ellipsis">{status}</div>}
        {ready && (
          <div className="max-h-[15rem] mono overflow-hidden text-ellipsis">
            The in-browser JupyterLite server is ready, press run anytime.
          </div>
        )}
      </div>
    );
  }

  if (show) {
    return (
      <div className="fixed p-3 text-sm text-gray-700 bg-white border rounded shadow-lg bottom-2 sm:right-2 max-w-[90%] md:max-w-[300px] min-w-0">
        <div className="mb-1 font-semibold text-center">⚡️ Connecting to {host} ⚡️</div>
        <div className="max-h-[15rem] mono overflow-hidden text-ellipsis">{status}</div>
      </div>
    );
  }

  return null;
}
