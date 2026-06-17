import AddressForm from './AddressForm.jsx'

export default function AddressModal({ onClose, onSuccess }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
        <AddressForm onClose={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  )
}
