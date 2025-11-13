import { type QDialogOptions, useQuasar } from 'quasar';

type returnType = {
  ok: boolean;
  data?: unknown;
};

export default function useDialog() {
  const $q = useQuasar();

  const dialog = (options: QDialogOptions) => {
    return new Promise<returnType>((resolve) => {
      $q.dialog(options)
        .onOk((data) => resolve({ ok: true, data }))
        .onCancel(() => resolve({ ok: false }))
        .onDismiss(() => resolve({ ok: false }));
    });
  };

  return dialog;
}
