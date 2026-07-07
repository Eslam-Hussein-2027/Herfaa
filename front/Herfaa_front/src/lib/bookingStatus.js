export const BOOKING_STATUS = {
  pending: { label: 'بانتظار الموافقة', cls: 'bg-gold-50 text-gold-700' },
  accepted: { label: 'مقبول', cls: 'bg-teal-50 text-teal-700' },
  in_progress: { label: 'قيد التنفيذ', cls: 'bg-blue-50 text-blue-700' },
  completed: { label: 'مكتمل', cls: 'bg-success-bg text-success' },
  rejected: { label: 'مرفوض', cls: 'bg-danger-bg text-danger' },
  cancelled: { label: 'ملغى', cls: 'bg-ink-100 text-ink-500' },
}

export const FLOW = ['pending', 'accepted', 'in_progress', 'completed']
export const STEP_LABEL = {
  pending: 'طلب',
  accepted: 'مقبول',
  in_progress: 'تنفيذ',
  completed: 'إنجاز',
}
